import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function SphereGeometry() {
    function Spinner1() {
        const meshRef1 = useRef();
        const meshRef2 = useRef();

        useFrame((state, delta) => {
            meshRef1.current.rotation.x += delta;
            meshRef1.current.rotation.y += delta * 0.5;
        });

        return (
            <mesh position={[1.5, 0, 0]} ref={meshRef1}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        );
    }

    function Spinner2() {
        const meshRef2 = useRef();

        useFrame((state, delta) => {
            meshRef2.current.rotation.z += delta;
        });

        return (
            <mesh position={[-1.5, 0, 0]} ref={meshRef2}>
                <circleGeometry args={[1, 32]} />
                <meshStandardMaterial color="yellow" />
                <mesh position={[0.6, 0, 0.05]}>
                    <boxGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </mesh>
        );
    }

    return (
        <Canvas>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 5]} intensity={2} />

            <Spinner1 />
            <Spinner2 />
        </Canvas>
    );
}

export default SphereGeometry;
