import { Input, MouseButton, KeyCode } from "./input/input";
import { Renderer } from "./renderer";

/**
 * Handles viewport events such as resizing, mouse movements, and keyboard inputs.
 * This class provides static methods to handle various events and update the input system accordingly.
 * It listens for events like window resize, mouse movement, key presses, and mouse button actions,
 * and updates the `Renderer` and `Input` classes accordingly.
 */
export class Events {
    /**
     * Handles the window resize event.
     * This method is called when the window is resized and updates the `Renderer`'s viewport size.
     * @param {Event} event - The resize event triggered by the window.
     */
    public static OnResize(event: Event): void {
        Renderer.Resize();
    }

    /**
     * Handles the mouse move event.
     * This method is called when the mouse is moved and updates the `Input`'s mouse position.
     * @param {MouseEvent} event - The mouse move event containing the new mouse position.
     */
    public static OnMouseMove(event: MouseEvent): void {
        Input.SetMousePosition(event.clientX, event.clientY);
    }

    /**
     * Handles the key down event.
     * This method is called when a key is pressed and updates the `Input`'s key code state.
     * @param {KeyboardEvent} event - The key down event containing the pressed key code.
     */
    public static OnKeyDown(event: KeyboardEvent): void {
        Input.SetKeyCode(event.keyCode as KeyCode);
    }

    /**
     * Handles the key up event.
     * This method is called when a key is released and updates the `Input`'s key code state.
     * @param {KeyboardEvent} event - The key up event containing the released key code.
     */
    public static OnKeyUp(event: KeyboardEvent): void {
        Input.UnsetKeyCode(event.keyCode as KeyCode);
    }

    /**
     * Handles the mouse down event.
     * This method is called when a mouse button is pressed and updates the `Input`'s mouse button state.
     * @param {MouseEvent} event - The mouse down event containing the pressed mouse button.
     */
    public static OnMouseDown(event: MouseEvent): void {
        Input.SetMouseButton(event.button as MouseButton);
    }

    /**
     * Handles the mouse up event.
     * This method is called when a mouse button is released and updates the `Input`'s mouse button state.
     * @param {MouseEvent} event - The mouse up event containing the released mouse button.
     */
    public static OnMouseUp(event: MouseEvent): void {
        Input.UnsetMouseButton(event.button as MouseButton);
    }

    /**
     * Handles the mouse scroll event.
     * This method is called when the mouse wheel is scrolled and updates the `Input`'s mouse scroll state.
     * @param {WheelEvent} event - The mouse scroll event containing the scroll delta.
     */
    public static OnMouseScroll(event: WheelEvent): void {
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
     * @memberof Events
     */
    public static OnGamepadConnected(event: GamepadEvent): void {
        Input.AddGamepad(event.gamepad);
    }

    /**
     * Handles the gamepad disconnected event.
     * 
     * This method is called when a gamepad is disconnected and removes the gamepad from the `Input`'s gamepad list.
     *
     * @static
     * @param {GamepadEvent} event - The gamepad disconnected event containing the disconnected gamepad.
     * @memberof Events
     */
    public static OnGamepadDisconnected(event: GamepadEvent): void {
        Input.RemoveGamepad(event.gamepad);
    }
}