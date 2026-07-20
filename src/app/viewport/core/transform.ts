import { Vector2 } from "@xloxlolex/vector-math";

export class Transform {
    public position: Vector2 = Vector2.zero;
    public rotation: number = 0;
    public scale: Vector2 = Vector2.one;
}