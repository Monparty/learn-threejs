import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function BoxGeometry() {
    const ref = useRef();

    useFrame((state) => {
        ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2;
    });

    return (
        <mesh ref={ref} position={[0, 0, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

function SphereGeometry() {
    const ref = useRef();

    useFrame((state, delta) => {
        ref.current.position.x += delta; // 1 หน่วยต่อวินาที
        if (ref.current.position.x > 3) {
            ref.current.position.x = -3;
        }
    });

    return (
        <mesh ref={ref} position={[2, 0, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="teal" />
        </mesh>
    );
}

function ConeGeometry() {
    const ref = useRef();

    useFrame((state) => {
        ref.current.position.y = Math.sin(state.clock.elapsedTime) * 1;
    });

    return (
        <mesh ref={ref} position={[4, 0, 0]}>
            <coneGeometry args={[0.5, 1, 32]} />
            <meshStandardMaterial color="yellow" />
        </mesh>
    );
}

function CylinderGeometry() {
    return (
        <mesh position={[6, 0, 0]}>
            <cylinderGeometry />
            <meshStandardMaterial color="skyblue" />
        </mesh>
    );
}

function TorusGeometry() {
    return (
        <mesh position={[8, 0, 0]}>
            <torusGeometry />
            <meshStandardMaterial color="coral" />
        </mesh>
    );
}

function TorusKnotGeometry() {
    return (
        <mesh position={[10, 0, 0]}>
            <torusKnotGeometry args={[1, 0.3, 100, 16]} />
            <meshStandardMaterial color="purple" />
        </mesh>
    );
}

function PlaneGeometry() {
    return (
        <mesh position={[-2, 0, 0]}>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial color="pink" />
        </mesh>
    );
}

function RingGeometry() {
    return (
        <mesh position={[-4, 0, 0]}>
            <ringGeometry args={[0.4, 1, 36]} />
            <meshStandardMaterial color="cyan" />
        </mesh>
    );
}

function TetrahedronGeometry() {
    return (
        <mesh position={[-6, 0, 0]}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
}

function OctahedronGeometry() {
    return (
        <mesh position={[-8, 0, 0]}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="lime" />
        </mesh>
    );
}

function DodecahedronGeometry() {
    return (
        <mesh position={[-10, 0, 0]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="gold" />
        </mesh>
    );
}

function IcosahedronGeometry() {
    return (
        <mesh position={[-12, 0, 0]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}

function CapsuleGeometry() {
    return (
        <mesh position={[0, 4, 0]}>
            <capsuleGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}

function CircleGeometry() {
    return (
        <mesh position={[2, 4, 0]}>
            <circleGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function EdgesGeometry() {
    return (
        <mesh position={[4, 4, 0]}>
            <edgesGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function ExtrudeGeometry() {
    return (
        <mesh position={[6, 4, 0]}>
            <extrudeGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function LatheGeometry() {
    return (
        <mesh position={[8, 4, 0]}>
            <latheGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function PolyhedronGeometry() {
    return (
        <mesh position={[10, 4, 0]}>
            <polyhedronGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function ShapeGeometry() {
    return (
        <mesh position={[-2, 4, 0]}>
            <shapeGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function TubeGeometry() {
    return (
        <mesh position={[-4, 4, 0]}>
            <tubeGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}
function WireframeGeometry() {
    return (
        <mesh position={[-6, 4, 0]}>
            <wireframeGeometry />
            <meshStandardMaterial color="tomato" />
        </mesh>
    );
}

function TestObjMove() {
    return (
        <Canvas>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 5]} intensity={2} />

            <BoxGeometry />
            <SphereGeometry />
            <ConeGeometry />
            <CylinderGeometry />
            <TorusGeometry />
            <TorusKnotGeometry />
            <PlaneGeometry />
            <RingGeometry />
            <TetrahedronGeometry />
            <OctahedronGeometry />
            <DodecahedronGeometry />
            <IcosahedronGeometry />

            <CapsuleGeometry />
            <CircleGeometry />
            <EdgesGeometry />
            <ExtrudeGeometry />
            <LatheGeometry />
            <PolyhedronGeometry />
            <ShapeGeometry />
            <TubeGeometry />
            <WireframeGeometry />

            <OrbitControls
            // enableDamping
            // autoRotate
            // target={[0, 0.5, 0]}
            // minDistance={3}
            // maxDistance={10}
            // maxPolarAngle={Math.PI / 2}
            />
        </Canvas>
    );
}

export default TestObjMove;
