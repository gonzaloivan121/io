import { Vector2 } from '@xloxlolex/vector-math';

import { Entity } from './entity';
import { Color } from './color';
import { Input, KeyCode } from './input/input';
import { Renderer } from './renderer';

export class Map extends Entity {
    public innerGridSize: number = 32;
    public normalGridSize: number = this.innerGridSize * 4;
    public outerGridSize: number = this.normalGridSize * 4;

    public drawGrid: boolean = true;
    public drawOuterGrid: boolean = true;
    public drawNormalGrid: boolean = true;
    public drawInnerGrid: boolean = true;

    public innerGridLineWidth: number = 1;
    public normalGridLineWidth: number = 2;
    public outerGridLineWidth: number = 3;

    public outerGridColor: Color = new Color(0, 0, 0, 0.75);
    public normalGridColor: Color = new Color(0, 0, 0, 0.5);
    public innerGridColor: Color = new Color(0, 0, 0, 0.25);

    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = new Vector2(1024 * 10, 1024 * 10),
        speed: number = 0,
        color: Color = Color.Gray,
    ) {
        super(position, rotation, scale, speed, color);
    }

    public override Update(): void {
        if (Input.GetKeyDown(KeyCode.G)) {
            this.drawGrid = !this.drawGrid;
        }

        if (Input.GetKeyDown(KeyCode.O)) {
            this.drawOuterGrid = !this.drawOuterGrid;
        }

        if (Input.GetKeyDown(KeyCode.I)) {
            this.drawInnerGrid = !this.drawInnerGrid;
        }
    }

    public override Draw(): void {
        const position: Vector2 = new Vector2(
            this.position.x - (this.scale.x / 2),
            this.position.y - (this.scale.y / 2)
        );

        Renderer.FillRect(position, this.scale, this.color.String);

        if (!this.drawGrid) {
            return;
        }

        const left = position.x - this.scale.x;
        const right = position.x + this.scale.x;
        const top = position.y - this.scale.y;
        const bottom = position.y + this.scale.y;

        const outerSize = this.GetSafeGridSize(this.outerGridSize);
        const normalSize = this.GetSafeGridSize(this.normalGridSize);
        const innerSize = this.GetSafeGridSize(this.innerGridSize);

        if (this.drawInnerGrid) {
            this.DrawGridLayer(
                left,
                right,
                top,
                bottom,
                innerSize,
                this.innerGridColor,
                this.innerGridLineWidth,
                this.drawOuterGrid ? outerSize : undefined,
            );
        }

        if (this.drawNormalGrid) {
            this.DrawGridLayer(
                left,
                right,
                top,
                bottom,
                normalSize,
                this.normalGridColor,
                this.normalGridLineWidth,
                this.drawOuterGrid ? outerSize : undefined,
            );
        }

        if (this.drawOuterGrid) {
            this.DrawGridLayer(
                left,
                right,
                top,
                bottom,
                outerSize,
                this.outerGridColor,
                this.outerGridLineWidth,
            );
        }
    }

    private DrawGridLayer(
        left: number,
        right: number,
        top: number,
        bottom: number,
        step: number,
        color: Color,
        lineWidth: number,
        skipEveryStep?: number,
    ): void {
        const width = Math.max(0.1, lineWidth);

        for (let x = left; x <= right; x += step) {
            if (skipEveryStep !== undefined && this.IsLineOnMajorGrid(x - left, skipEveryStep)) {
                continue;
            }

            Renderer.DrawLine(new Vector2(x, top), new Vector2(x, bottom), color.String, width);
        }

        for (let y = top; y <= bottom; y += step) {
            if (skipEveryStep !== undefined && this.IsLineOnMajorGrid(y - top, skipEveryStep)) {
                continue;
            }

            Renderer.DrawLine(new Vector2(left, y), new Vector2(right, y), color.String, width);
        }
    }

    private GetSafeGridSize(value: number): number {
        return Math.max(1, Math.abs(value));
    }

    private IsLineOnMajorGrid(distanceFromStart: number, majorStep: number): boolean {
        const normalized = Math.abs(distanceFromStart % majorStep);
        return normalized < 0.0001 || Math.abs(normalized - majorStep) < 0.0001;
    }
}
