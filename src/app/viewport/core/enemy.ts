import { Vector2 } from "@xloxlolex/vector-math";

import { Entity } from "./entity";
import { Time } from "./time";
import { Color } from "./color";
import { Renderer } from "./renderer";

/**
 * Represents an `Enemy` in the viewport that can follow a target `Entity`.
 *
 * @export
 * @class Enemy
 * @extends {Entity}
 */
export class Enemy extends Entity {
    /**
     * The target `Entity` that the `Enemy` will follow.
     *
     * @type {(Entity | null)}
     * @memberof Enemy
     */
    public target: Entity | null = null;

    private baseScale: Vector2;
    private score: number = 0;
    private growth: number = 0.001;

    /**
     * Creates a new `Enemy` instance.
     *
     * @param {Vector2} position - The initial position of the `Enemy`.
     * @param {number} rotation - The initial rotation of the `Enemy`.
     * @param {Vector2} scale - The scale of the `Enemy`.
     * @param {number} speed - The movement speed of the `Enemy`.
     * @param {Color} color - The color of the `Enemy`.
     */
    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one,
        speed: number = 1,
        color: Color = Color.White,
    ) {
        super(position, rotation, scale, speed, color);
        this.baseScale = new Vector2(scale.x, scale.y);
    }

    public get scoreValue(): number {
        return this.score;
    }

    public Score(amount: number): void {
        this.score = Math.max(0, this.score + amount);
    }

    public LoseScore(amount: number): void {
        if (amount <= 0) {
            return;
        }

        this.score = Math.max(0, this.score - amount);
    }

    public Reset(position: Vector2): void {
        this.position = position;
        this.scale = new Vector2(this.baseScale.x, this.baseScale.y);
        this.score = 0;
        this.target = null;
    }

    public override Update(): void {
        const destination = this.target?.position ?? this.position;
        this.position = Vector2.Lerp(this.position, destination, this.speed * Time.DeltaTime);

        this.UpdateScale();
    }

    public override Draw(): void {
        const position: Vector2 = new Vector2(
            this.position.x - this.scale.x / 2,
            this.position.y - this.scale.y / 2,
        );

        Renderer.FillRect(position, this.scale, this.color.String);
        Renderer.StrokeRect(position, this.scale, this.color.Darker.String);
    }

    private UpdateScale(): void {
        this.scale = Vector2.Multiply(this.baseScale, 1 + this.score * this.growth);
    }
}