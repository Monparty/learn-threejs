import { KeyboardControls, OrbitControls, useKeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

// 1. ตั้งชื่อ action และบอกว่าใช้ปุ่มไหน
const keyMap = [
    { name: "forward", keys: ["KeyW"] },
    { name: "backward", keys: ["KeyS"] },
    { name: "left", keys: ["KeyA"] },
    { name: "right", keys: ["KeyD"] },
    { name: "jump", keys: ["Space"] },
];

const GROUND_Y = 0.5; // ความสูงของกล่องตอนอยู่บนพื้น
const JUMP_HEIGHT = 2; // กระโดดสูงกี่หน่วย
const JUMP_DURATION = 0.6; // ลอยอยู่กี่วินาที

// แปลงความสูงและเวลาลอยเป็นค่าฟิสิกส์ จะได้ปรับแค่ 2 ค่าด้านบน
const GRAVITY = (8 * JUMP_HEIGHT) / JUMP_DURATION ** 2; // แรงดึงลง (หน่วยต่อวินาที²)
const JUMP_SPEED = (4 * JUMP_HEIGHT) / JUMP_DURATION; // ความเร็วพุ่งขึ้นตอนเริ่มกระโดด

const PLAYER_HALF = 0.5; // ครึ่งหนึ่งของความกว้างกล่องผู้เล่น

// สิ่งกีดขวาง สูงกว่าที่กระโดดพ้น เลยชนได้ทุกความสูง
const WALL = { x: 0, z: -6, halfX: 1.5, halfZ: 1.5, height: 4 };
// แท่นที่กระโดดขึ้นไปยืนได้
const STAGE = { x: 6, z: 1, halfX: 2.25, halfZ: 2.25, height: 0.5 };
const STAGE_TOP_Y = STAGE.height + PLAYER_HALF; // ความสูงของกล่องตอนยืนบนแท่น

const forwardDir = new Vector3();
const rightDir = new Vector3();
const followPos = new Vector3();
const move = new Vector3();

// กล่อง 2 ใบซ้อนกัน เมื่อระยะห่างน้อยกว่าครึ่งกว้างรวมกัน ทั้งแกน x และ z
function overlaps(box, x, z) {
    return Math.abs(x - box.x) < PLAYER_HALF + box.halfX && Math.abs(z - box.z) < PLAYER_HALF + box.halfZ;
}

// เดินไปตำแหน่ง x, z ที่ความสูง y ได้ไหม แท่นจะขวางเฉพาะตอนกล่องอยู่ต่ำกว่าหลังแท่น
function isBlocked(x, z, y) {
    return overlaps(WALL, x, z) || (overlaps(STAGE, x, z) && y < STAGE_TOP_Y);
}

function Wall() {
    return (
        <mesh position={[WALL.x, WALL.height / 2, WALL.z]}>
            <boxGeometry args={[WALL.halfX * 2, WALL.height, WALL.halfZ * 2]} />
            <meshStandardMaterial color="skyblue" />
        </mesh>
    );
}

function Stage() {
    return (
        <mesh position={[STAGE.x, STAGE.height / 2, STAGE.z]}>
            <boxGeometry args={[STAGE.halfX * 2, STAGE.height, STAGE.halfZ * 2]} />
            <meshStandardMaterial color="pink" />
        </mesh>
    );
}

function Player() {
    const ref = useRef();
    const velocityY = useRef(0); // ความเร็วแนวตั้ง บวก = ขึ้น, ลบ = ลง
    // 2. ขอฟังก์ชันสำหรับอ่านสถานะปุ่ม
    const [, getKeys] = useKeyboardControls();
    const pressed = useKeyboardControls((s) => s.forward || s.backward || s.left || s.right);

    useFrame((state, delta) => {
        // จำกัด delta ไว้ กันเฟรมกระตุกแล้วกล่องวาร์ปทะลุกำแพง
        const dt = Math.min(delta, 0.1);
        const speed = 10 * dt; // 10 หน่วยต่อวินาที
        // 3. อ่านสถานะปุ่มทุกเฟรม
        const { forward, backward, left, right, jump } = getKeys();
        const pos = ref.current.position;

        // หาทิศที่กล้องมอง โดยไม่นับการก้มเงย
        state.camera.getWorldDirection(forwardDir);
        forwardDir.y = 0;
        forwardDir.normalize();

        // หาทิศขวาของกล้อง
        rightDir.crossVectors(forwardDir, state.camera.up);

        // รวมระยะที่จะเดินในเฟรมนี้ก่อน ยังไม่ขยับจริง
        move.set(0, 0, 0);
        if (forward) move.addScaledVector(forwardDir, speed);
        if (backward) move.addScaledVector(forwardDir, -speed);
        if (right) move.addScaledVector(rightDir, speed);
        if (left) move.addScaledVector(rightDir, -speed);

        // เช็กทีละแกน ถ้าชนแกนเดียวจะยังเดินเลียบกำแพงด้วยอีกแกนได้
        if (!isBlocked(pos.x + move.x, pos.z, pos.y)) pos.x += move.x;
        if (!isBlocked(pos.x, pos.z + move.z, pos.y)) pos.z += move.z;

        // พื้นใต้เท้าตอนนี้ ถ้าอยู่เหนือแท่นคือหลังแท่น ไม่งั้นคือพื้นปกติ
        const floorY = overlaps(STAGE, pos.x, pos.z) ? STAGE_TOP_Y : GROUND_Y;

        // เริ่มกระโดดได้เฉพาะตอนยืนบนพื้นหรือแท่น กันกระโดดซ้ำกลางอากาศ
        if (jump && pos.y <= floorY) velocityY.current = JUMP_SPEED;

        // แรงโน้มถ่วงลดความเร็วลงทุกเฟรม กล่องเลยขึ้นช้าลง แล้วค่อยตกลงมา
        velocityY.current -= GRAVITY * dt;
        pos.y += velocityY.current * dt;

        // ตกถึงพื้นแล้วให้หยุด ไม่จมลงไป
        if (pos.y <= floorY) {
            pos.y = floorY;
            velocityY.current = 0;
        }

        // ใช้ทำให้มุมกล้องขยับตาม obj
        const controls = state.controls;
        if (!controls) return; // เฟรมแรกๆ controls ยังไม่พร้อม

        // กล้องตามแค่แนวราบ ไม่ตามตอนกระโดด จะได้เห็นกล่องลอยขึ้นจริง
        followPos.set(pos.x, GROUND_Y, pos.z);
        state.camera.position.add(followPos).sub(controls.target); // กล้องขยับตามระยะที่วัตถุขยับ
        controls.target.copy(followPos); // ให้กล้องหมุนรอบวัตถุ
    });

    return (
        <mesh ref={ref} position={[0, GROUND_Y, 0]}>
            <boxGeometry />
            {/* <meshStandardMaterial color="red" /> */}
            <meshStandardMaterial color={pressed ? "hotpink" : "red"} />
        </mesh>
    );
}

function TestObjMoveGame() {
    return (
        // 4. ครอบ Canvas ไว้ เพื่อให้ทุกอย่างข้างในอ่านปุ่มได้
        <KeyboardControls map={keyMap}>
            <Canvas camera={{ position: [0, 3, 6] }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[3, 4, 5]} intensity={2} />
                <gridHelper args={[60, 60]} />
                <Wall />
                <Stage />
                <Player />
                <OrbitControls
                    makeDefault
                    maxPolarAngle={Math.PI / 2}
                    target={[0, 0.8, 0]}
                    minDistance={3}
                    maxDistance={8}
                />
            </Canvas>
        </KeyboardControls>
    );
}

export default TestObjMoveGame;
