import { WALL } from "./share";

export default function Wall() {
    return (
        <mesh position={[WALL.x, WALL.height / 2, WALL.z]}>
            <boxGeometry args={[WALL.halfX * 2, WALL.height, WALL.halfZ * 2]} />
            <meshStandardMaterial color="skyblue" />
        </mesh>
    );
}
