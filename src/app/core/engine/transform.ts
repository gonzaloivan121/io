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
    public position: Vector2;

    /**
     * The rotation of the `Transform` in degrees.
     *
     * @type {number}
     * @memberof Transform
     */
    public rotation: number;

    /**
     * The scale of the `Transform` in 2D space.
     *
     * @type {Vector2}
     * @memberof Transform
     */
    public scale: Vector2;

    /**
     * Creates an instance of `Transform`.
     * 
     * @param {Vector2} [position=Vector2.zero] - The position of the `Transform` in 2D space. Defaults to `Vector2.zero`.
     * @param {number} [rotation=0] - The rotation of the `Transform` in degrees. Defaults to `0`.
     * @param {Vector2} [scale=Vector2.one] - The scale of the `Transform` in 2D space. Defaults to `Vector2.one`.
     * @memberof Transform
     */
    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}