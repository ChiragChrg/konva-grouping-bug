import { signal } from "@preact/signals-react";

// Define the BoundingBox type
export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export const propertiesSignal = signal<BoundingBox | null>();
