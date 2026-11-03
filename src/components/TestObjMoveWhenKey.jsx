import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

function TestObjMoveWhenKey() {
    function Player() {
        const ref = useRef();
        const keys = useRef({});

        useEffect(() => {
            const onKeyDown = (e) => {
                keys.current[e.code] = true;
            };
            const onKeyUp = (e) => {
                keys.current[e.code] = false;
            };

            window.addEventListener("keydown", onKeyDown);
            window.addEventListener("keyup", onKeyUp);

            return () => {
                window.removeEventListener("keydown", onKeyDown);
                window.removeEventListener("keyup", onKeyUp);
            };
        }, []);

        useFrame((state, delta) => {
            const speed = 10 * delta; // 10 หน่วยต่อวินาที

            if (keys.current.ArrowLeft) ref.current.position.x -= speed;
            if (keys.current.ArrowRight) ref.current.position.x += speed;

            if (keys.current.ArrowUp) ref.current.position.y += speed;
            if (keys.current.ArrowDown) ref.current.position.y -= speed;

            if (keys.current.BracketLeft) ref.current.position.z += speed;
            if (keys.current.BracketRight) ref.current.position.z -= speed;

            // ใช้ทำให้มุมกล้องขยับตาม obj
            const controls = state.controls;
            if (!controls) return; // เฟรมแรกๆ controls ยังไม่พร้อม

            const pos = ref.current.position;
            state.camera.position.add(pos).sub(controls.target); // กล้องขยับตามระยะที่วัตถุขยับ
            controls.target.copy(pos); // ให้กล้องหมุนรอบวัตถุ
        });

        return (
            <mesh ref={ref}>
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
        );
    }

    return (
        <Canvas>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 5]} intensity={2} />
            <gridHelper args={[60, 60]} />
            <Player />
            <OrbitControls makeDefault />
        </Canvas>
    );
}

export default TestObjMoveWhenKey;
