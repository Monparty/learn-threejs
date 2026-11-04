import { STAGE } from "./share";

function Stage() {
    return (
        <mesh position={[STAGE.x, STAGE.height / 2, STAGE.z]}>
            <boxGeometry args={[STAGE.halfX * 2, STAGE.height, STAGE.halfZ * 2]} />
            <meshStandardMaterial color="pink" />
        </mesh>
    );
}

export default Stage;
