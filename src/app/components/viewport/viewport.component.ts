import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    ViewChild,
} from '@angular/core';

import { Engine } from '../../core/engine/engine';
import { Events } from '../../core/engine/events';

import { WelcomeApplication } from '../../core/application/welcome.application';
import { IOApplication } from '../../core/application/io.application';

@Component({
    selector: 'app-viewport',
    templateUrl: './viewport.component.html',
    styleUrl: './viewport.component.css',
})
export class ViewportComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas', { static: false })
    private canvas!: ElementRef<HTMLCanvasElement>;

    constructor() {}

    ngAfterViewInit(): void {
        this.Initialize();
    }

    ngOnDestroy(): void {
        Engine.Shutdown();
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

    @HostListener('window:pointerdown', ['$event'])
    OnPointerDown(event: PointerEvent): void {
        Events.OnPointerDown(event);
    }

    @HostListener('window:pointermove', ['$event'])
    OnPointerMove(event: PointerEvent): void {
        Events.OnPointerMove(event);
    }

    @HostListener('window:pointerup', ['$event'])
    OnPointerUp(event: PointerEvent): void {
        Events.OnPointerUp(event);
    }

    @HostListener('window:pointercancel', ['$event'])
    OnPointerCancel(event: PointerEvent): void {
        Events.OnPointerCancel(event);
    }

    private Initialize(): void {
        Engine.Initialize(this.canvas.nativeElement, new IOApplication());
        Engine.Start();
    }
}
