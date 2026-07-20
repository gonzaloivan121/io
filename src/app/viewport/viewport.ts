import { AfterViewInit, Component, ElementRef, Host, HostListener, ViewChild } from '@angular/core';

import { Engine } from './core/engine';
import { Events } from './core/events';
import { Game } from './core/game';

@Component({
    selector: 'app-viewport',
    imports: [],
    templateUrl: './viewport.html',
    styleUrl: './viewport.css',
})
export class Viewport implements AfterViewInit {
    @ViewChild('canvas', { static: false })
    private canvas!: ElementRef<HTMLCanvasElement>;

    constructor() {}

    ngAfterViewInit(): void {
        this.Initialize();
    }

    @HostListener('window:resize', ['$event'])
    OnResize(event: Event): void {
        Events.OnResize(event);
    }

    @HostListener('window:mousemove', ['$event'])
    OnMouseMove(event: MouseEvent): void {
        Events.OnMouseMove(event);
    }

    @HostListener('window:keydown', ['$event'])
    OnKeyDown(event: KeyboardEvent): void {
        Events.OnKeyDown(event);
    }

    @HostListener('window:keyup', ['$event'])
    OnKeyUp(event: KeyboardEvent): void {
        Events.OnKeyUp(event);
    }

    @HostListener('window:mousedown', ['$event'])
    OnMouseDown(event: MouseEvent): void {
        Events.OnMouseDown(event);
    }

    @HostListener('window:mouseup', ['$event'])
    OnMouseUp(event: MouseEvent): void {
        Events.OnMouseUp(event);
    }

    @HostListener('window:wheel', ['$event'])
    OnMouseScroll(event: WheelEvent): void {
        Events.OnMouseScroll(event);
    }

    @HostListener('contextmenu', ['$event'])
    OnRightClick(event: Event) {
        event.preventDefault();
        return false;
    }

    @HostListener('window:gamepadconnected', ['$event'])
    OnGamepadConnected(event: GamepadEvent): void {
        Events.OnGamepadConnected(event);
    }

    @HostListener('window:gamepaddisconnected', ['$event'])
    OnGamepadDisconnected(event: GamepadEvent): void {
        Events.OnGamepadDisconnected(event);
    }

    private Initialize(): void {
        Engine.Initialize(this.canvas.nativeElement);

        const game: Game = new Game();
        game.Run();
    }
}
