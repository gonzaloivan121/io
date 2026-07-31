import { Vector2 } from '@xloxlolex/vector-math';

import { Renderer } from './engine/renderer';
import { Color } from './engine/color';

import { Input, KeyCode } from './input/input';

import { Entity } from './entity';

export interface IGridOptions {
    draw: boolean;
    size: number;
    width: number;
    color: Color;
}

export class Map extends Entity {
    public drawGrid: boolean = true;

    public readonly innerGrid: IGridOptions = {
        draw: true,
        size: 32,
        width: 1,
        color: new Color(0, 0, 0, 0.25),
    };

    public readonly normalGrid: IGridOptions = {
        draw: true,
        size: this.innerGrid.size * 3,
        width: this.innerGrid.width * 2,
        color: new Color(0, 0, 0, 0.5),
    };

    public readonly outerGrid: IGridOptions = {
        draw: true,
        size: this.normalGrid.size * 3,
        width: this.normalGrid.width * 2,
        color: new Color(0, 0, 0, 0.75),
    };

    constructor(
        position: Vector2 = Vector2.zero,
        rotation: number = 0,
        scale: Vector2 = Vector2.one,
        speed: number = 0,
        color: Color = Color.Gray,
    ) {
        super(position, rotation, scale, speed, color);
    }

    public override Start(): void {}

    public override Update(): void {
        if (Input.GetKeyDown(KeyCode.G)) {
            this.drawGrid = !this.drawGrid;
        }

        if (Input.GetKeyDown(KeyCode.I)) {
            this.innerGrid.draw = !this.innerGrid.draw;
        }

        if (Input.GetKeyDown(KeyCode.N)) {
            this.normalGrid.draw = !this.normalGrid.draw;
        }

        if (Input.GetKeyDown(KeyCode.O)) {
            this.outerGrid.draw = !this.outerGrid.draw;
        }
    }

    public override Draw(): void {
        const position: Vector2 = new Vector2(
            this.transform.position.x - this.transform.scale.x / 2,
            this.transform.position.y - this.transform.scale.y / 2,
        );

        Renderer.FillRect(position, this.transform.scale, this.color.String);

        if (!this.drawGrid) {
            return;
        }

        const left = position.x - this.transform.scale.x;
        const right = position.x + this.transform.scale.x;
        const top = position.y - this.transform.scale.y;
        const bottom = position.y + this.transform.scale.y;

        const outerSize = this.GetSafeGridSize(this.outerGrid.size);
        const normalSize = this.GetSafeGridSize(this.normalGrid.size);
        const innerSize = this.GetSafeGridSize(this.innerGrid.size);

        if (this.innerGrid.draw) {
            this.DrawGridLayer(
                left,
                right,
                top,
                bottom,
                innerSize,
                this.innerGrid.color,
                this.innerGrid.width,
                this.outerGrid.draw ? outerSize : undefined,
            );
        }

        if (this.normalGrid.draw) {
            this.DrawGridLayer(
                left,
                right,
                top,
                bottom,
                normalSize,
                this.normalGrid.color,
                this.normalGrid.width,
                this.outerGrid.draw ? outerSize : undefined,
            );
        }

        if (this.outerGrid.draw) {
            this.DrawGridLayer(
                left,
                right,
                top,
                bottom,
                outerSize,
                this.outerGrid.color,
                this.outerGrid.width,
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
