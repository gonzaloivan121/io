import { Vector2 } from "@xloxlolex/vector-math";

import { Entity } from "./entity";
import { Color } from "./color";
import { Timer } from "./timer";
import { Utilities } from "./utilities";
import { Renderer } from "./renderer";

/**
 * Represents a `Point` entity in the game.
 * 
 * Points have a lifetime, and can be deleted after their lifetime expires.
 *
 * @export
 * @class Point
 * @extends {Entity}
 */
export class Point extends Entity {
    /**
     * The value awarded for collecting this `Point`.
     *
     * @type {number}
     * @memberof Point
     */
    public value: number = 1;

    /**
     * The minimum value that a `Point` can have.
     *
     * @type {number}
     * @memberof Point
     */
    public minValue: number = 1;

    /**
     * The maximum value that a `Point` can have.
     *
     * @type {number}
     * @memberof Point
     */
    public maxValue: number = 3;

    /**
     * The lifetime of the `Point` in seconds before it can be deleted.
     *
     * After this time, the `Point` will be considered for deletion.
     *
     * @type {number}
     * @memberof Point
     */
    public lifeTime: number = 60;

    /**
     * The minimum lifetime that a `Point` can have.
     *
     * @type {number}
     * @memberof Point
     */
    public minLifeTime: number = 10;

    /**
     * The maximum lifetime that a `Point` can have.
     *
     * @type {number}
     * @memberof Point
     */
    public maxLifeTime: number = 60;

    /**
     * A timer to track the elapsed time since the `Point` was created.
     *
     * This timer is used to determine when the `Point` can be deleted based on its lifetime.
     *
     * @private
     * @type {Timer}
     * @memberof Point
     */
    private timer: Timer = new Timer();

    /**
     * Creates a new `Point` instance.
     *
     * @param {Vector2} position - The initial position of the `Point`.
     * @param {number} rotation - The initial rotation of the `Point`.
     * @param {Vector2} scale - The scale of the `Point`.
     * @param {number} speed - The movement speed of the `Point`.
     * @param {Color} color - The color of the `Point`.
     */
    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one,
        speed: number = 0,
        color: Color = Color.White,
    ) {
        super(position, rotation, scale, speed, color);
        this.Recycle(position);
    }

    /**
     * Recycles the `Point` by resetting its position, value, lifetime, and color.
     *
     * @param {Vector2} position - The new position of the `Point`.
     * @memberof Point
     */
    public Recycle(position: Vector2): void {
        this.position = position;
        this.value = Utilities.RandomInt(this.minValue, this.maxValue);
        this.lifeTime = Utilities.RandomInt(this.minLifeTime, this.maxLifeTime);
        this.color = this.ColorForValue();
        this.timer.Reset();
    }

    /**
     * Determines the color of the `Point` based on its value.
     *
     * @private
     * @param {number} value - The value of the `Point`.
     * @returns {Color} The color corresponding to the `Point`'s value.
     * @memberof Point
     */
    private ColorForValue(): Color {
        switch (this.value) {
            case 1:     return Color.Bronze;
            case 2:     return Color.Silver;
            default:    return Color.Gold;
        }
    }

    /**
     * Checks if the `Point` has expired based on its lifetime.
     *
     * @returns {boolean} `true` if the `Point` has expired, `false` otherwise.
     * @memberof Point
     */
    public Expired(): boolean {
        return this.timer.Elapsed() > this.lifeTime * 1000;
    }

    public override Start(): void {}

    public override Update(): void {}

    public override Draw(): void {
        const position: Vector2 = new Vector2(
            this.position.x - this.scale.x / 2,
            this.position.y - this.scale.y / 2,
        );

        Renderer.FillRect(position, this.scale, this.color.String);

        const borderWidth: number = 5;

        Renderer.StrokeRect(position, this.scale, this.color.Darker.String, borderWidth);
    }
}