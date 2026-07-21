import { Vector2 } from "@xloxlolex/vector-math";
import { Time } from "./time";
import { Color } from "./color";
import { Input } from "./input/input";
import { IBoundingBox } from "./bounding-box";
import { Transform } from "./transform";

/**
 * Represents an abstract entity in the viewport.
 * Entities have a position, scale, speed, color, and a square representation.
 * They can be drawn, checked for collisions, followed, and restrained within another entity.
 * They also provide properties for mouse interaction and bounding box collision detection.
 * This class is meant to be extended by specific entity types.
 * It provides basic functionality for movement, collision detection, and rendering.
 */
export abstract class Entity {
    // public transform: Transform = new Transform();

    /**
     * The position of the `Entity` in the viewport.
     *
     * This is a `Vector2` representing the `x` and `y` coordinates of the `Entity`.
     *
     * @type {Vector2}
     * @memberof Entity
     */
    public position: Vector2;

    /**
     * The rotation of the `Entity` in degrees.
     *
     * @type {number}
     * @memberof Entity
     */
    public rotation: number;

    /**
     * The scale of the `Entity`.
     *
     * This is a `Vector2` representing the `x` and `y` scaling factors of the `Entity`.
     *
     * @type {Vector2}
     * @memberof Entity
     */
    public scale: Vector2;

    /**
     * The speed of the `Entity`.
     *
     * This is a number representing how fast the `Entity` moves.
     *
     * @type {number}
     * @memberof Entity
     */
    public speed: number;

    /**
     * The color of the `Entity`.
     *
     * This is an instance of the `Color` class that defines the color of the `Entity`.
     *
     * @type {Color}
     * @memberof Entity
     */
    public color: Color;

    /**
     * Gets the bounding box of the `Entity`.
     *
     * The bounding box is represented as an object with `left`, `right`, `top`, and `bottom` properties.
     *
     * @readonly
     * @type {IBoundingBox}
     * @memberof Entity
     */
    public get bounds(): IBoundingBox {
        const halfWidth = this.scale.x / 2;
        const halfHeight = this.scale.y / 2;

        return {
            left: this.position.x - halfWidth,
            right: this.position.x + halfWidth,
            top: this.position.y - halfHeight,
            bottom: this.position.y + halfHeight,
        };
    }

    /**
     * Checks if the mouse is currently over the `Entity`.
     *
     * @readonly
     * @type {boolean}
     * @memberof Entity
     */
    public get mouseOver(): boolean {
        const bounds = this.bounds;
        const mousePosition = Input.MousePosition;

        return (
            mousePosition.x >= bounds.left &&
            mousePosition.x <= bounds.right &&
            mousePosition.y >= bounds.top &&
            mousePosition.y <= bounds.bottom
        );
    }

    /**
     * Creates an instance of `Entity`.
     *
     * Initializes the `position`, `rotation`, `scale`, `speed` and `color`.
     *
     * @param {Vector2} position - The initial position of the `Entity`.
     * @param {number} rotation - The initial rotation of the `Entity`.
     * @param {Vector2} scale - The initial scale of the `Entity`.
     * @param {number} speed - The initial speed of the `Entity`.
     * @param {Color} color - The initial color of the `Entity`.
     */
    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one,
        speed: number = 1,
        color: Color = Color.White,
    ) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.speed = speed;
        this.color = color;

        this.Start();
    }

    /**
     * Checks if the `Entity` collides with another `Entity`.
     *
     * This is done by checking if the bounding boxes of both entities overlap.
     *
     * @param {Entity} other - The other `Entity` to check for collision.
     * @returns {boolean} `true` if the entities collide, `false` otherwise.
     */
    public CollidesWith(other: Entity): boolean {
        const a = this.bounds;
        const b = other.bounds;

        return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    }

    /**
     * Follows another `Entity` by moving towards its position.
     *
     * This method updates the position of the `Entity` to move towards the position of the other `Entity`
     * at a speed defined by this `Entity`'s `speed` property.
     *
     * @param {Entity} other - The `Entity` to follow.
     */
    public Follow(other: Entity, smooth: boolean = true): void {
        this.FollowPosition(other.position, smooth);
    }

    /**
     * Follows a specific position in the viewport.
     *
     * This method updates the position of this `Entity` to move towards the specified position
     * at a speed defined by this `Entity`'s `speed` property.
     *
     * @param {Vector2} position - The position to follow.
     */
    public FollowPosition(position: Vector2, smooth: boolean = true): void {
        if (smooth) {
            this.position = Vector2.Lerp(this.position, position, this.speed * Time.DeltaTime);
        } else {
            this.position = position;
        }
    }

    /**
     * Restrains this `Entity` inside another `Entity`'s bounding box.
     *
     * This method clamps the position of this `Entity` to ensure it stays within the bounds of the other `Entity`.
     *
     * It calculates the minimum and maximum x and y coordinates based on the other `Entity`'s bounding box
     * and adjusts this `Entity`'s position accordingly.
     *
     * @param {Entity} other - The `Entity` whose bounding box will be used to restrain this `Entity`.
     */
    public RestrainInside(other: Entity): void {
        const thisBox = this.bounds;
        const otherBox = other.bounds;

        const minX = otherBox.left + (thisBox.right - thisBox.left) / 2;
        const maxX = otherBox.right - (thisBox.right - thisBox.left) / 2;
        const minY = otherBox.top + (thisBox.bottom - thisBox.top) / 2;
        const maxY = otherBox.bottom - (thisBox.bottom - thisBox.top) / 2;

        const clampedX = Math.max(minX, Math.min(this.position.x, maxX));
        const clampedY = Math.max(minY, Math.min(this.position.y, maxY));

        this.position = new Vector2(clampedX, clampedY);
    }

    /**
     * Draws the `Entity` on the viewport.
     *
     * This method is abstract and should be implemented by subclasses to define specific drawing behavior.
     *
     * @protected
     * @abstract
     * @memberof Entity
     */
    protected abstract Draw(): void;

    /**
     * Initializes the `Entity` when it is first created.
     *
     * This method is abstract and should be implemented by subclasses to define specific initialization behavior.
     *
     * @protected
     * @abstract
     * @memberof Entity
     */
    protected Start(): void {}

    /**
     * Updates the state of the `Entity`.
     *
     * This method is abstract and should be implemented by subclasses to define specific update behavior.
     *
     * @protected
     * @abstract
     * @memberof Entity
     */
    protected abstract Update(): void;
}