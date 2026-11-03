import SphereGeometry from "./SphereGeometry";
import TestCamera from "./TestCamera";
import TestObjMove from "./TestObjMove";
import TestObjMoveGame from "./TestObjMoveGame";
import TestObjMoveWhenKey from "./TestObjMoveWhenKey";
import ThreeScene from "./ThreeScene";

function MainScreen() {
    return (
        <div style={{ height: "100dvh", background: "#d8d4d4" }}>
            {/* <TestCamera /> */}
            {/* <SphereGeometry /> */}
            {/* <ThreeScene /> */}
            {/* <TestObjMove /> */}
            {/* <TestObjMoveWhenKey /> */}
            <TestObjMoveGame />
        </div>
    );
}

export default MainScreen;
