import { Input, MouseButton, KeyCode } from "../input/input";
import { Renderer } from "./renderer";

import { InvalidArgumentError } from "../../errors";

/**
 * Handles viewport events such as resizing, mouse movements, and keyboard inputs.
 * 
 * This class provides static methods to handle various events and update the input system accordingly.
 * 
 * It listens for events like window resize, mouse movement, key presses, and mouse button actions,
 * and updates the `Renderer` and `Input` classes accordingly.
 * 
 * @export
 * @class Events
 */
export class Events {
    /**
     * Handles the window resize event.
     *
     * This method is called when the window is resized and updates the `Renderer`'s viewport size.
     *
     * @static
     * @param {Event} [event] - The resize event (optional).
     * @memberof Events
     */
    public static OnResize(event?: Event): void {
        Renderer.Resize();
    }

    /**
     * Handles the mouse move event.
     *
     * This method is called when the mouse is moved and updates the `Input`'s mouse position.
     *
     * @static
     * @param {MouseEvent} event - The mouse move event containing the new mouse position.
     * @throws {InvalidArgumentError} If the `MouseEvent` is not provided.
     * @memberof Events
     */
    public static OnMouseMove(event: MouseEvent): void {
        if (!event) {
            throw new InvalidArgumentError('MouseEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
    }

    /**
     * Handles the key down event.
     *
     * This method is called when a key is pressed and updates the `Input`'s key code state.
     *
     * @static
     * @param {KeyboardEvent} event - The key down event containing the pressed key code.
     * @throws {InvalidArgumentError} If the `KeyboardEvent` is not provided.
     * @memberof Events
     */
    public static OnKeyDown(event: KeyboardEvent): void {
        if (!event) {
            throw new InvalidArgumentError('KeyboardEvent must be provided.');
        }

        Input.SetKeyCode(event.keyCode as KeyCode);
    }

    /**
     * Handles the key up event.
     *
     * This method is called when a key is released and updates the `Input`'s key code state.
     *
     * @static
     * @param {KeyboardEvent} event - The key up event containing the released key code.
     * @throws {InvalidArgumentError} If the `KeyboardEvent` is not provided.
     * @memberof Events
     */
    public static OnKeyUp(event: KeyboardEvent): void {
        if (!event) {
            throw new InvalidArgumentError('KeyboardEvent must be provided.');
        }

        Input.UnsetKeyCode(event.keyCode as KeyCode);
    }

    /**
     * Handles the mouse down event.
     *
     * This method is called when a mouse button is pressed and updates the `Input`'s mouse button state.
     *
     * @static
     * @param {MouseEvent} event - The mouse down event containing the pressed mouse button.
     * @throws {InvalidArgumentError} If the `MouseEvent` is not provided.
     * @memberof Events
     */
    public static OnMouseDown(event: MouseEvent): void {
        if (!event) {
            throw new InvalidArgumentError('MouseEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
        Input.SetMouseButton(event.button as MouseButton);
    }

    /**
     * Handles the mouse up event.
     *
     * This method is called when a mouse button is released and updates the `Input`'s mouse button state.
     *
     * @static
     * @param {MouseEvent} event - The mouse up event containing the released mouse button.
     * @throws {InvalidArgumentError} If the `MouseEvent` is not provided.
     * @memberof Events
     */
    public static OnMouseUp(event: MouseEvent): void {
        if (!event) {
            throw new InvalidArgumentError('MouseEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
        Input.UnsetMouseButton(event.button as MouseButton);
    }

    /**
     * Handles the mouse scroll event.
     *
     * This method is called when the mouse wheel is scrolled and updates the `Input`'s mouse scroll state.
     *
     * @static
     * @param {WheelEvent} event - The mouse scroll event containing the scroll delta.
     * @throws {InvalidArgumentError} If the `WheelEvent` is not provided.
     * @memberof Events
     */
    public static OnMouseScroll(event: WheelEvent): void {
        if (!event) {
            throw new InvalidArgumentError('WheelEvent must be provided.');
        }

        const normalizedDelta: number = Math.sign(event.deltaY);

        if (normalizedDelta !== 0) {
            Input.SetMouseScrollDelta(normalizedDelta);
        }
    }

    /**
     * Handles the gamepad connected event.
     *
     * This method is called when a gamepad is connected and adds the gamepad to the `Input`'s gamepad list.
     *
     * @static
     * @param {GamepadEvent} event - The gamepad connected event containing the connected gamepad.
     * @throws {InvalidArgumentError} If the `GamepadEvent` is not provided.
     * @memberof Events
     */
    public static OnGamepadConnected(event: GamepadEvent): void {
        if (!event) {
            throw new InvalidArgumentError('GamepadEvent must be provided.');
        }

        Input.AddGamepad(event.gamepad);
    }

    /**
     * Handles the gamepad disconnected event.
     *
     * This method is called when a gamepad is disconnected and removes the gamepad from the `Input`'s gamepad list.
     *
     * @static
     * @param {GamepadEvent} event - The gamepad disconnected event containing the disconnected gamepad.
     * @throws {InvalidArgumentError} If the `GamepadEvent` is not provided.
     * @memberof Events
     */
    public static OnGamepadDisconnected(event: GamepadEvent): void {
        if (!event) {
            throw new InvalidArgumentError('GamepadEvent must be provided.');
        }

        Input.RemoveGamepad(event.gamepad);
    }

    /**
     * Handles the pointer down event.
     *
     * @static
     * @param {PointerEvent} event - The pointer down event to process.
     * @throws {InvalidArgumentError} If the `PointerEvent` is not provided.
     * @memberof Events
     */
    public static OnPointerDown(event: PointerEvent): void {
        if (!event) {
            throw new InvalidArgumentError('PointerEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
        Input.OnPointerDown(event);

        if (!event.defaultPrevented) {
            Input.SetMouseButton(MouseButton.Left);
        }
    }

    /**
     * Handles the pointer move event.
     *
     * @static
     * @param {PointerEvent} event - The pointer move event to process.
     * @throws {InvalidArgumentError} If the `PointerEvent` is not provided.
     * @memberof Events
     */
    public static OnPointerMove(event: PointerEvent): void {
        if (!event) {
            throw new InvalidArgumentError('PointerEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
        Input.OnPointerMove(event);
    }

    /**
     * Handles the pointer up event.
     *
     * @static
     * @param {PointerEvent} event - The pointer up event to process.
     * @throws {InvalidArgumentError} If the `PointerEvent` is not provided.
     * @memberof Events
     */
    public static OnPointerUp(event: PointerEvent): void {
        if (!event) {
            throw new InvalidArgumentError('PointerEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
        Input.OnPointerUp(event);

        if (!event.defaultPrevented) {
            Input.UnsetMouseButton(MouseButton.Left);
        }
    }

    /**
     * Handles the pointer cancel event.
     *
     * @static
     * @param {PointerEvent} event - The pointer cancel event to process.
     * @throws {InvalidArgumentError} If the `PointerEvent` is not provided.
     * @memberof Events
     */
    public static OnPointerCancel(event: PointerEvent): void {
        if (!event) {
            throw new InvalidArgumentError('PointerEvent must be provided.');
        }

        Input.SetMousePosition(event.clientX, event.clientY);
        Input.OnPointerCancel(event);

        if (!event.defaultPrevented) {
            Input.UnsetMouseButton(MouseButton.Left);
        }
    }
}