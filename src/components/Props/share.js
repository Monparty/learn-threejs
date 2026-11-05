const PLAYER_HALF = 0.5;
export const WALL = { x: 0, z: -6, halfX: 1.5, halfZ: 1.5, height: 4 };
export function overlaps(box, x, z) {
    return Math.abs(x - box.x) < PLAYER_HALF + box.halfX && Math.abs(z - box.z) < PLAYER_HALF + box.halfZ;
}
export function isBlocked(x, z, y) {
    return overlaps(WALL, x, z) || STAGES.some((stage) => overlaps(stage, x, z) && y < stage.topY);
}

export const STAGES = [
    // เพิ่ม STAGES
    { x: 6, z: 1, halfX: 2.25, halfZ: 2.25, height: 0.5, color: "pink" },
    { x: 10, z: 8, halfX: 4, halfZ: 2.25, height: 1, color: "green" },
].map((stage) => ({
    ...stage,
    topY: stage.height + PLAYER_HALF,
}));
