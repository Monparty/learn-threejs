import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { isBlocked, overlaps, STAGES } from "./share";

const GROUND_Y = 0.5; // ความสูงของกล่องตอนอยู่บนพื้น
const JUMP_HEIGHT = 2; // กระโดดสูงกี่หน่วย
const JUMP_DURATION = 0.6; // ลอยอยู่กี่วินาที
const GRAVITY = (8 * JUMP_HEIGHT) / JUMP_DURATION ** 2; // แรงดึงลง (หน่วยต่อวินาที²)
const JUMP_SPEED = (4 * JUMP_HEIGHT) / JUMP_DURATION; // ความเร็วพุ่งขึ้นตอนเริ่มกระโดด
const forwardDir = new Vector3();
const rightDir = new Vector3();
const followPos = new Vector3();
const move = new Vector3();

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

        const handleJump = (floors) => {
            if (jump && floors.some((floor) => pos.y <= floor)) {
                velocityY.current = JUMP_SPEED;
            }
        };

        const handleFloorCollision = (floors) => {
            floors.forEach((floor) => {
                if (pos.y <= floor) {
                    pos.y = floor;
                    velocityY.current = 0;
                }
            });
        };

        // พื้นใต้เท้าตอนนี้ ถ้าอยู่เหนือแท่นคือหลังแท่น ไม่งั้นคือพื้นปกติ
        const floors = STAGES.map((s) => (overlaps(s, pos.x, pos.z) ? s.topY : GROUND_Y));

        handleJump(floors);

        // แรงโน้มถ่วงลดความเร็วลงทุกเฟรม กล่องเลยขึ้นช้าลง แล้วค่อยตกลงมา
        velocityY.current -= GRAVITY * dt;
        pos.y += velocityY.current * dt;

        // ตกถึงพื้นแล้วให้หยุด ไม่จมลงไป
        handleFloorCollision(floors);

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
            <meshStandardMaterial color={pressed ? "hotpink" : "red"} />
        </mesh>
    );
}

export default Player;
