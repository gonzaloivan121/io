import { Vector2 } from "@xloxlolex/vector-math";

/**
 * Represents a `Transform` that defines the position, rotation, and scale of an entity in 2D space.
 * 
 * The `Transform` class provides properties for the position, rotation, and scale of an entity.
 * It is used to manipulate the entity's transformation in the viewport.
 *
 * @export
 * @class Transform
 */
export class Transform {
    /**
     * The position of the `Transform` in 2D space.
     *
     * @type {Vector2}
     * @memberof Transform
     */
    public position: Vector2 = Vector2.zero;

    /**
     * The rotation of the `Transform` in degrees.
     *
     * @type {number}
     * @memberof Transform
     */
    public rotation: number = 0;

    /**
     * The scale of the `Transform` in 2D space.
     *
     * @type {Vector2}
     * @memberof Transform
     */
    public scale: Vector2 = Vector2.one;
}