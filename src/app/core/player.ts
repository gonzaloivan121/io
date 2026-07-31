import { Vector2 } from '@xloxlolex/vector-math';

import { Renderer } from './engine/renderer';
import { Color } from './engine/color';
import { Time } from './engine/time';

import {
    GamepadAxis,
    GamepadButton,
    Input,
    KeyCode,
} from './input/input';

import { Entity } from './entity';

/**
 * Represents the player entity in the game, extending the base `Entity` class.
 *
 * The `Player` class manages the player's position, rotation, scale, speed, color, and score.
 *
 * @export
 * @class Player
 * @extends {Entity}
 */
export class Player extends Entity {
    private baseScale: Vector2;
    private score: number = 0;
    private growth: number = 0.001;

    /**
     * Creates an instance of `Player`.
     *
     * @param {Vector2} [position=Vector2.zero] - The initial position of the `Player` in world coordinates.
     * @param {number} [rotation=0] - The initial rotation of the `Player` in degrees.
     * @param {Vector2} [scale=Vector2.one] - The initial scale (width and height) of the `Player`.
     * @param {number} [speed=1] - The speed at which the `Player` moves.
     * @param {Color} [color=Color.AppleGreen] - The color of the `Player`.
     * @memberof Player
     */
    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one,
        speed: number = 1,
        color: Color = Color.AppleGreen,
    ) {
        super(position, rotation, scale, speed, color);
        this.baseScale = new Vector2(scale.x, scale.y);
    }

    public get scoreValue(): number {
        return this.score;
    }

    public override Start(): void {}

    public override Update(): void {
        const input: Vector2 = new Vector2(
            Input.GetGamepadAxis(GamepadAxis.LeftStickX),
            Input.GetGamepadAxis(GamepadAxis.LeftStickY),
        );

        if (Input.GetKey(KeyCode.A)) {
            input.x = -1;
        } else if (Input.GetKey(KeyCode.D)) {
            input.x = 1;
        }

        if (Input.GetKey(KeyCode.W)) {
            input.y = -1;
        } else if (Input.GetKey(KeyCode.S)) {
            input.y = 1;
        }

        const moveSpeed: number = this.speed * 350;
        const delta: Vector2 = Vector2.Multiply(input, moveSpeed * Time.DeltaTime);
        this.transform.position = Vector2.Add(this.transform.position, delta);

        this.UpdateScale();
    }

    public override Draw(): void {
        const position: Vector2 = new Vector2(
            this.transform.position.x - this.transform.scale.x / 2,
            this.transform.position.y - this.transform.scale.y / 2,
        );

        const borderWidth: number = 5 + this.score * this.growth;

        Renderer.FillRect(position, this.transform.scale, this.color.String);
        Renderer.StrokeRect(position, this.transform.scale, this.color.Darker.String, borderWidth);
    }

    /**
     * Increases the player's score by the specified amount.
     * The score cannot go below zero.
     *
     * @param {number} amount - The amount to increase the score by.
     * @memberof Player
     */
    public Score(amount: number): void {
        this.score = Math.max(0, this.score + amount);
    }

    /**
     * Decreases the player's score by the specified amount.
     * The score cannot go below zero.
     *
     * @param {number} amount - The amount to decrease the score by.
     * @memberof Player
     */
    public LoseScore(amount: number): void {
        if (amount <= 0) {
            return;
        }

        this.score = Math.max(0, this.score - amount);
    }

    /**
     * Resets the player's position, scale, and score to their initial values.
     *
     * @param {Vector2} [position=Renderer.ViewportCenter] - The position to reset the player to.
     * @memberof Player
     */
    public Reset(position: Vector2 = Renderer.ViewportCenter): void {
        this.transform.position = position;
        this.transform.scale = new Vector2(this.baseScale.x, this.baseScale.y);
        this.score = 0;
    }

    /**
     * Updates the player's scale based on the current score and growth factor.
     *
     * @private
     * @memberof Player
     */
    private UpdateScale(): void {
        this.transform.scale = Vector2.Multiply(this.baseScale, 1 + this.score * this.growth);
    }
}
