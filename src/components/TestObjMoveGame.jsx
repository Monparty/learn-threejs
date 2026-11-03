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

const forwardDir = new Vector3();
const rightDir = new Vector3();
const followPos = new Vector3();

function Player() {
    const ref = useRef();
    const jumpTime = useRef(null); // null = อยู่บนพื้น, ตัวเลข = กระโดดมาแล้วกี่วินาที
    // 2. ขอฟังก์ชันสำหรับอ่านสถานะปุ่ม
    const [, getKeys] = useKeyboardControls();
    const pressed = useKeyboardControls((s) => s.forward || s.backward || s.left || s.right);

    useFrame((state, delta) => {
        const speed = 10 * delta; // 10 หน่วยต่อวินาที
        // 3. อ่านสถานะปุ่มทุกเฟรม
        const { forward, backward, left, right, jump } = getKeys();
        const pos = ref.current.position;

        // หาทิศที่กล้องมอง โดยไม่นับการก้มเงย
        state.camera.getWorldDirection(forwardDir);
        forwardDir.y = 0;
        forwardDir.normalize();

        // หาทิศขวาของกล้อง
        rightDir.crossVectors(forwardDir, state.camera.up);

        if (forward) pos.addScaledVector(forwardDir, speed);
        if (backward) pos.addScaledVector(forwardDir, -speed);
        if (right) pos.addScaledVector(rightDir, speed);
        if (left) pos.addScaledVector(rightDir, -speed);

        // เริ่มกระโดดได้เฉพาะตอนอยู่บนพื้น กันกระโดดซ้ำกลางอากาศ
        if (jump && jumpTime.current === null) jumpTime.current = 0;

        if (jumpTime.current !== null) {
            jumpTime.current += delta;
            const progress = jumpTime.current / JUMP_DURATION; // 0 = เริ่มกระโดด, 1 = ลงถึงพื้น

            if (progress >= 1) {
                pos.y = GROUND_Y;
                jumpTime.current = null;
            } else {
                // sin(0 ถึง PI) ได้ค่า 0 -> 1 -> 0 เป็นครึ่งคลื่นพอดี
                pos.y = GROUND_Y + Math.sin(progress * Math.PI) * JUMP_HEIGHT;
            }
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
