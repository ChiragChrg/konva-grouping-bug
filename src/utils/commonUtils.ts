import { BoundingBox } from "@/store/signals";

type RectPos = { x: number; y: number };


/**
 * Function that updates the position of the group based on the selected rectangle.
 * It sets the position of the group to the position of the selected rectangle.
 */
export const getBoundingBox = (rects: RectPos[], RECT_SIZE: number): BoundingBox => {
    const xs = rects.map(r => r.x);
    const ys = rects.map(r => r.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs) + RECT_SIZE;
    const maxY = Math.max(...ys) + RECT_SIZE;

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}