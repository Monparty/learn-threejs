import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Player from "./Props/Player";
import Stage from "./Props/Stage";
import Wall from "./Props/Wall";

// 1. ตั้งชื่อ action และบอกว่าใช้ปุ่มไหน
const keyMap = [
    { name: "forward", keys: ["KeyW"] },
    { name: "backward", keys: ["KeyS"] },
    { name: "left", keys: ["KeyA"] },
    { name: "right", keys: ["KeyD"] },
    { name: "jump", keys: ["Space"] },
];

function TestObjMoveGame() {
    return (
        // 4. ครอบ Canvas ไว้ เพื่อให้ทุกอย่างข้างในอ่านปุ่มได้
        <KeyboardControls map={keyMap}>
            <Canvas camera={{ position: [0, 3, 6] }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[3, 4, 5]} intensity={2} />
                <gridHelper args={[60, 60]} />
                <OrbitControls
                    makeDefault
                    maxPolarAngle={Math.PI / 2}
                    target={[0, 0.8, 0]}
                    minDistance={3}
                    maxDistance={8}
                />

                {/* components */}
                <Wall />
                <Player />
                <Stage />
            </Canvas>
        </KeyboardControls>
    );
}

export default TestObjMoveGame;
