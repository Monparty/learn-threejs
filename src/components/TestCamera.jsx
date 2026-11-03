import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";

function TestCamera() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 5]} intensity={2} />
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
            {/* <mesh position={[1.5, 0, 0]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="hotpink" />
                </mesh> */}
            <OrbitControls
            // enableDamping
            // autoRotate
            // target={[0, 0.5, 0]}
            // minDistance={3}
            // maxDistance={10}
            // maxPolarAngle={Math.PI / 2}
            />

            <Line
                points={[
                    [-100, 0, 0],
                    [100, 0, 0],
                ]}
                color="red"
            />
            <Line
                points={[
                    [0, -100, 0],
                    [0, 100, 0],
                ]}
                color="green"
            />
            <Line
                points={[
                    [0, 0, -100],
                    [0, 0, 100],
                ]}
                color="blue"
            />
        </Canvas>
    );
}

export default TestCamera;
