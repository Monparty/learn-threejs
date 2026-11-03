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
];

const forwardDir = new Vector3();
const rightDir = new Vector3();

function Player() {
    const ref = useRef();
    // 2. ขอฟังก์ชันสำหรับอ่านสถานะปุ่ม
    const [, getKeys] = useKeyboardControls();
    const pressed = useKeyboardControls((s) => s.forward || s.backward || s.left || s.right);

    useFrame((state, delta) => {
        const speed = 10 * delta; // 10 หน่วยต่อวินาที
        // 3. อ่านสถานะปุ่มทุกเฟรม
        const { forward, backward, left, right } = getKeys();
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

        // ใช้ทำให้มุมกล้องขยับตาม obj
        const controls = state.controls;
        if (!controls) return; // เฟรมแรกๆ controls ยังไม่พร้อม

        state.camera.position.add(pos).sub(controls.target); // กล้องขยับตามระยะที่วัตถุขยับ
        controls.target.copy(pos); // ให้กล้องหมุนรอบวัตถุ
    });

    return (
        <mesh ref={ref} position={[0, 0.5, 0]}>
            <boxGeometry />
            {/* <meshStandardMaterial color="red" /> */}
            <meshStandardMaterial color={pressed ? "hotpink" : "red"} />
        </mesh>
    );
}

function TestObjMoveWhenKey() {
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

export default TestObjMoveWhenKey;
