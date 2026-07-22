import { Vector2 } from "@xloxlolex/vector-math";

import { GamepadAxis, Input } from "./input/input";
import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Time } from "./time";

/**
 * Represents a camera in the viewport that can follow entities, clamp its position within bounds, and handle zooming.
 *
 * @export
 * @class Camera
 * @extends {Entity}
 */
export class Camera extends Entity {
    /**
     * The zoom level of the `Camera`.
     * A value of 1 represents no zoom, values greater than 1 represent zooming in, and values less than 1 represent zooming out.
     *
     * @type {number}
     * @memberof Camera
     */
    public zoom: number = 1;

    /**
     * The speed at which the `Camera` zooms in and out when the mouse wheel is scrolled.
     *
     * @type {number}
     * @memberof Camera
     */
    public zoomSpeed: number = 0.01;

    /**
     * The minimum zoom level of the `Camera`.
     * The `Camera` cannot zoom out beyond this level.
     *
     * @type {number}
     * @memberof Camera
     */
    public minZoom: number = 0.2;

    /**
     * The maximum zoom level of the `Camera`.
     * The `Camera` cannot zoom in beyond this level.
     *
     * @type {number}
     * @memberof Camera
     */
    public maxZoom: number = 1;

    /**
     * Creates an instance of `Camera`.
     *
     * @param {Vector2} [position=Vector2.zero] - The initial position of the `Camera` in world coordinates.
     * @param {number} [rotation=0] - The initial rotation of the `Camera` in degrees.
     * @param {Vector2} [scale=Vector2.one] - The initial scale (width and height) of the `Camera`'s viewport.
     * @param {number} [speed=10] - The speed at which the `Camera` moves when following an entity.
     * @memberof Camera
     */
    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one,
        speed: number = 10,
    ) {
        super(position, rotation, scale, speed);
    }

    /**
     * Clamps the `Camera`'s position within the bounds defined by the given center and scale.
     *
     * @param {Vector2} clampCenter - The center point around which the `Camera`'s position will be clamped.
     * @param {Vector2} clampScale - The scale (width and height) that defines the clamping area around the `clampCenter`.
     * @memberof Camera
     */
    public Clamp(clampCenter: Vector2, clampScale: Vector2): void {
        const halfMap: Vector2 = Vector2.Multiply(clampScale, 0.5);
        const halfView: Vector2 = Vector2.Multiply(this.scale, 0.5 / this.zoom);

        let minX: number = clampCenter.x - halfMap.x + halfView.x;
        let maxX: number = clampCenter.x + halfMap.x - halfView.x;
        let minY: number = clampCenter.y - halfMap.y + halfView.y;
        let maxY: number = clampCenter.y + halfMap.y - halfView.y;

        // If the viewport is larger than the map on an axis, keep camera centered.
        if (minX > maxX) {
            minX = clampCenter.x;
            maxX = clampCenter.x;
        }

        if (minY > maxY) {
            minY = clampCenter.y;
            maxY = clampCenter.y;
        }

        this.position.x = Math.max(minX, Math.min(this.position.x, maxX));
        this.position.y = Math.max(minY, Math.min(this.position.y, maxY));
    }

    /**
     * Begins the `Camera` transformation by applying translation and scaling to the `Renderer`'s drawing context.
     *
     * @memberof Camera
     */
    public Begin(): void {
        Renderer.Save();

        Renderer.Translate(Renderer.ViewportCenter);
        Renderer.Scale(new Vector2(this.zoom, this.zoom));
        Renderer.Translate(Vector2.Multiply(this.position, -1));
    }

    /**
     * Restores the previous transformation state of the `Renderer` after `Camera` transformations have been applied.
     * This method should be called after all drawing operations that require the `Camera`'s transformations are completed.
     *
     * @memberof Camera
     */
    public End(): void {
        Renderer.Restore();
    }

    public override Start(): void {}

    public override Update(): void {
        this.scale = Renderer.ViewportSize;

        if (Input.ScrollDelta !== 0) {
            this.zoom -= Input.ScrollDelta * this.zoomSpeed * 10;
            this.zoom = Math.max(this.minZoom, Math.min(this.zoom, this.maxZoom));
        }

        const input: Vector2 = new Vector2(
            Input.GetGamepadAxis(GamepadAxis.RightStickX),
            Input.GetGamepadAxis(GamepadAxis.RightStickY),
        );

        const moveSpeed: number = this.speed * 350;
        const delta: Vector2 = Vector2.Multiply(input, moveSpeed * Time.DeltaTime);

        this.position = Vector2.Add(this.position, delta);

        const rightTrigger: number = Input.GetGamepadAxis(GamepadAxis.RightTrigger);
        const leftTrigger: number = Input.GetGamepadAxis(GamepadAxis.LeftTrigger);

        if (rightTrigger > 0) {
            this.zoom += rightTrigger * this.zoomSpeed;
        }

        if (leftTrigger > 0) {
            this.zoom -= leftTrigger * this.zoomSpeed;
        }

        this.zoom = Math.max(this.minZoom, Math.min(this.zoom, this.maxZoom));
    }

    public override Draw(): void {}

    /**
     * Converts a screen position to a world position based on the `Camera`'s position and zoom level.
     *
     * @param {Vector2} screen - The screen position to convert.
     * @returns {Vector2} The world position corresponding to the given screen position.
     * @memberof Camera
     */
    public ScreenToWorld(screen: Vector2): Vector2 {
        return new Vector2(
            (screen.x - Renderer.ViewportCenter.x) / this.zoom + this.position.x,
            (screen.y - Renderer.ViewportCenter.y) / this.zoom + this.position.y,
        );
    }
}