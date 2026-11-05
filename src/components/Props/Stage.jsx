import { STAGES } from "./share";

function Stage() {
    return (
        <>
            {STAGES.map((stage) => {
                return (
                    <mesh position={[stage.x, stage.height / 2, stage.z]}>
                        <boxGeometry args={[stage.halfX * 2, stage.height, stage.halfZ * 2]} />
                        <meshStandardMaterial color={stage.color} />
                    </mesh>
                );
            })}
        </>
    );
}

export default Stage;
