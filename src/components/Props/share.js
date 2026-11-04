const PLAYER_HALF = 0.5;
export const WALL = { x: 0, z: -6, halfX: 1.5, halfZ: 1.5, height: 4 };
export const STAGE = { x: 6, z: 1, halfX: 2.25, halfZ: 2.25, height: 0.5 };

export const STAGE_TOP_Y = STAGE.height + PLAYER_HALF;
export function isBlocked(x, z, y) {
    return overlaps(WALL, x, z) || (overlaps(STAGE, x, z) && y < STAGE_TOP_Y);
}
export function overlaps(box, x, z) {
    return Math.abs(x - box.x) < PLAYER_HALF + box.halfX && Math.abs(z - box.z) < PLAYER_HALF + box.halfZ;
}
