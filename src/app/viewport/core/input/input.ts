import { Vector2 } from "@xloxlolex/vector-math";

import { MouseButton } from "./mouse-button";
import { GamepadButton } from "./gamepad-button";
import { GamepadAxis } from "./gamepad-axis";
import { KeyCode } from "./key-code";
import { InvalidArgumentError } from "../../../errors";

/**
 * Represents the input system for handling keyboard and mouse inputs.
 * It tracks the current and previous states of keys and mouse buttons,
 * allowing for detection of key presses, releases, and mouse button actions.
 * It also provides a static property for the mouse position.
 * This class is designed to be used in a game engine or application
 * where user input is required for interaction with the game world.
 * It provides methods to update the input state,
 * set and unset key codes and mouse buttons, and check for key and mouse button events.
 * It also provides a static property for the mouse position,
 * which can be updated based on user input.
 * This class is not meant to be instantiated directly,
 * but rather used as a utility for managing input in the application.
 * It is designed to be updated each frame to ensure accurate input handling.
 * The input system is essential for capturing user interactions,
 * such as keyboard presses and mouse clicks,
 * and translating them into actions within the game or application.
 */
export class Input {
    /**
     * The current position of the mouse in the viewport.
     *
     * This is a static property that tracks the mouse position as a `Vector2` object.
     *
     * @private
     * @static
     * @type {Vector2}
     * @memberof Input
     */
    private static mousePosition: Vector2 = Vector2.zero;

    /**
     * The current scroll delta of the mouse wheel.
     *
     * This value is reset to 0 after each frame.
     *
     * @private
     * @static
     * @type {number}
     * @memberof Input
     */
    private static scrollDelta: number = 0;

    /**
     * The current state of key codes.
     *
     * This is a static array that tracks whether each key is currently pressed.
     * It uses the `KeyCode` enum to index into the array,
     * allowing for efficient checking of key states.
     *
     * @private
     * @static
     * @type {boolean[]}
     * @memberof Input
     */
    private static currentKeyCodes: boolean[] = [];

    /**
     * The previous state of key codes.
     *
     * This is a static array that tracks whether each key was pressed in the previous frame.
     * It uses the `KeyCode` enum to index into the array,
     * allowing for efficient checking of key states.
     *
     * It is used to determine if a key was pressed or released between frames.
     *
     * @private
     * @static
     * @type {boolean[]}
     * @memberof Input
     */
    private static previousKeyCodes: boolean[] = [];

    /**
     * The current state of mouse buttons.
     *
     * This is a static array that tracks whether each mouse button is currently pressed.
     * It uses the `MouseButton` enum to index into the array,
     * allowing for efficient checking of mouse button states.
     *
     * @private
     * @static
     * @type {boolean[]}
     * @memberof Input
     */
    private static currentMouseButtons: boolean[] = [];

    /**
     * The previous state of mouse buttons.
     *
     * This is a static array that tracks whether each mouse button was pressed in the previous frame.
     * It uses the `MouseButton` enum to index into the array,
     * allowing for efficient checking of mouse button states.
     *
     * It is used to determine if a mouse button was clicked or released between frames.
     *
     * @private
     * @static
     * @type {boolean[]}
     * @memberof Input
     */
    private static previousMouseButtons: boolean[] = [];

    /**
     * Current gamepad button states by gamepad index.
     *
     * This is a static object that tracks the current state of gamepad buttons for each connected gamepad.
     * It is used to determine if a gamepad button was pressed or released between frames.
     *
     * @private
     * @static
     * @type {{ [gamepadIndex: number]: boolean[] }}
     * @memberof Input
     */
    private static currentGamepadButtons: { [gamepadIndex: number]: boolean[] } = {};

    /**
     * Previous frame gamepad button states by gamepad index.
     *
     * This is a static object that tracks the previous state of gamepad buttons for each connected gamepad.
     * It is used to determine if a gamepad button was pressed or released between frames.
     *
     * @private
     * @static
     * @type {{ [gamepadIndex: number]: boolean[] }}
     * @memberof Input
     */
    private static previousGamepadButtons: { [gamepadIndex: number]: boolean[] } = {};

    /**
     * Current gamepad axis states by gamepad index.
     *
     * This is a static object that tracks the current state of gamepad axes for each connected gamepad.
     * It is used to determine the current state of gamepad axes for each connected gamepad.
     *
     * @private
     * @static
     * @type {{ [gamepadIndex: number]: number[] }}
     * @memberof Input
     */
    private static currentGamepadAxes: { [gamepadIndex: number]: number[] } = {};

    /**
     * The list of connected gamepads.
     *
     * This is a static array that tracks the currently connected gamepads.
     * It is updated when gamepads are connected or disconnected,
     * allowing for input from game controllers to be handled in the application.
     *
     * @private
     * @static
     * @type {Gamepad[]}
     * @memberof Input
     */
    private static gamepads: Gamepad[] = [];

    /**
     * Gets the current mouse position in the viewport.
     *
     * @readonly
     * @static
     * @type {Vector2}
     * @memberof Input
     */
    public static get MousePosition(): Vector2 {
        return this.mousePosition;
    }

    /**
     * Gets the current scroll delta of the mouse wheel.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Input
     */
    public static get ScrollDelta(): number {
        return this.scrollDelta;
    }

    /**
     * Initializes the input system.
     *
     * @static
     * @memberof Input
     */
    public static Initialize(): void {
        // Initialize the input system, if needed.
    }

    /**
     * Updates the input state for the current frame.
     *
     * This method should be called each frame to ensure that the input system
     * is up-to-date with the latest user interactions.
     *
     * It copies the current key codes, mouse buttons, gamepad buttons and gamepad axes
     * to their previous states, allowing for detection of key presses and releases.
     *
     * @static
     * @memberof Input
     */
    public static Update(): void {
        this.previousKeyCodes = [...this.currentKeyCodes];
        this.previousMouseButtons = [...this.currentMouseButtons];
        this.previousGamepadButtons = {};

        for (const gamepadIndexKey of Object.keys(this.currentGamepadButtons)) {
            const gamepadIndex = Number(gamepadIndexKey);
            this.previousGamepadButtons[gamepadIndex] = [
                ...this.currentGamepadButtons[gamepadIndex],
            ];
        }

        this.scrollDelta = 0;

        const connectedGamepads: (Gamepad | null)[] = navigator.getGamepads
            ? navigator.getGamepads()
            : [];
        const activeIndices: Set<number> = new Set<number>();

        for (const gamepad of connectedGamepads) {
            if (!gamepad) {
                continue;
            }

            activeIndices.add(gamepad.index);
            this.gamepads[gamepad.index] = gamepad;

            const buttonStates: boolean[] = this.currentGamepadButtons[gamepad.index] ?? [];
            const axisStates: number[] = this.currentGamepadAxes[gamepad.index] ?? [];

            for (let i = 0; i < gamepad.buttons.length; i++) {
                buttonStates[i] = gamepad.buttons[i].pressed;
            }

            for (let i = 0; i < gamepad.axes.length; i++) {
                axisStates[i] = gamepad.axes[i];
            }

            // Some mappings expose triggers as button values instead of axes.
            axisStates[GamepadAxis.LeftTrigger] = gamepad.buttons[GamepadButton.LT]?.value ?? 0;
            axisStates[GamepadAxis.RightTrigger] = gamepad.buttons[GamepadButton.RT]?.value ?? 0;

            this.currentGamepadButtons[gamepad.index] = buttonStates;
            this.currentGamepadAxes[gamepad.index] = axisStates;
        }

        for (const gamepadIndexKey of Object.keys(this.currentGamepadButtons)) {
            const gamepadIndex = Number(gamepadIndexKey);

            if (!activeIndices.has(gamepadIndex)) {
                delete this.currentGamepadButtons[gamepadIndex];
                delete this.previousGamepadButtons[gamepadIndex];
                delete this.currentGamepadAxes[gamepadIndex];
                delete this.gamepads[gamepadIndex];
            }
        }
    }

    /**
     * Sets the mouse position to the specified coordinates.
     *
     * This method updates the static MousePosition property,
     * which can be accessed globally to determine where the mouse is currently located.
     *
     * @static
     * @param {number} x - The x-coordinate of the mouse position.
     * @param {number} y - The y-coordinate of the mouse position.
     * @memberof Input
     */
    public static SetMousePosition(x: number, y: number): void {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
    }

    /**
     * Sets the state of a key code to pressed.
     *
     * This method updates the currentKeyCodes array to indicate that the specified key is currently pressed.
     *
     * @static
     * @param {KeyCode} keyCode - The key code to set as pressed.
     * @memberof Input
     */
    public static SetKeyCode(keyCode: KeyCode): void {
        this.currentKeyCodes[keyCode] = true;
    }

    /**
     * Unsets the state of a key code to not pressed.
     *
     * This method updates the currentKeyCodes array to indicate that the specified key is no longer pressed.
     *
     * @static
     * @param {KeyCode} keyCode - The key code to unset.
     * @memberof Input
     */
    public static UnsetKeyCode(keyCode: KeyCode): void {
        this.currentKeyCodes[keyCode] = false;
    }

    /**
     * Sets the state of a mouse button to pressed.
     * 
     * This method updates the currentMouseButtons array to indicate that the specified mouse button is currently pressed.
     * 
     * @static
     * @param {MouseButton} mouseButton - The mouse button to set as pressed.
     * @memberof Input
     */
    public static SetMouseButton(mouseButton: MouseButton): void {
        this.currentMouseButtons[mouseButton] = true;
    }

    /**
     * Unsets the state of a mouse button to not pressed.
     * 
     * This method updates the currentMouseButtons array to indicate that the specified mouse button is no longer pressed.
     * 
     * @static
     * @param {MouseButton} mouseButton - The mouse button to unset.
     * @memberof Input
     */
    public static UnsetMouseButton(mouseButton: MouseButton): void {
        this.currentMouseButtons[mouseButton] = false;
    }

    /**
     * Sets the mouse wheel scroll delta to the specified value.
     *
     * This method updates the static ScrollDelta property,
     * which can be accessed globally to determine how much the mouse wheel has been scrolled.
     *
     * @static
     * @param {number} delta - The scroll delta value to set.
     * @memberof Input
     */
    public static SetMouseScrollDelta(delta: number): void {
        this.scrollDelta += delta;
    }

    /**
     * Checks if a specific key was pressed in the current frame.
     *
     * This method compares the current state of the key with its previous state
     * to determine if it was pressed this frame.
     *
     * @static
     * @param {KeyCode} keyCode - The key code to check.
     * @returns {boolean} `true` if the key was pressed this frame, `false` otherwise.
     * @memberof Input
     */
    public static GetKeyDown(keyCode: KeyCode): boolean {
        return this.currentKeyCodes[keyCode] && !this.previousKeyCodes[keyCode];
    }

    /**
     * Checks if a specific key was released in the current frame.
     *
     * This method compares the current state of the key with its previous state
     * to determine if it was released this frame.
     *
     * @static
     * @param {KeyCode} keyCode - The key code to check.
     * @returns {boolean} `true` if the key was released this frame, `false` otherwise.
     * @memberof Input
     */
    public static GetKeyUp(keyCode: KeyCode): boolean {
        return !this.currentKeyCodes[keyCode] && this.previousKeyCodes[keyCode];
    }

    /**
     * Checks if a specific key is currently pressed.
     *
     * This method checks the current state of the key to determine if it is pressed.
     *
     * @static
     * @param {KeyCode} keyCode - The key code to check.
     * @returns {boolean} `true` if the key is currently pressed, `false` otherwise.
     * @memberof Input
     */
    public static GetKey(keyCode: KeyCode): boolean {
        return this.currentKeyCodes[keyCode];
    }

    /**
     * Checks if a specific mouse button was pressed in the current frame.
     *
     * This method compares the current state of the mouse button with its previous state
     * to determine if it was pressed this frame.
     *
     * @static
     * @param {MouseButton} mouseButton - The mouse button to check.
     * @returns {boolean} `true` if the mouse button was pressed this frame, `false` otherwise.
     * @memberof Input
     */
    public static GetMouseButtonDown(mouseButton: MouseButton): boolean {
        return this.currentMouseButtons[mouseButton] && !this.previousMouseButtons[mouseButton];
    }

    /**
     * Checks if a specific mouse button was released in the current frame.
     *
     * This method compares the current state of the mouse button with its previous state
     * to determine if it was released this frame.
     *
     * @static
     * @param {MouseButton} mouseButton - The mouse button to check.
     * @returns {boolean} `true` if the mouse button was released this frame, `false` otherwise.
     * @memberof Input
     */
    public static GetMouseButtonUp(mouseButton: MouseButton): boolean {
        return !this.currentMouseButtons[mouseButton] && this.previousMouseButtons[mouseButton];
    }

    /**
     * Checks if a specific mouse button is currently pressed.
     *
     * This method checks the current state of the mouse button to determine if it is pressed.
     *
     * @static
     * @param {MouseButton} mouseButton - The mouse button to check.
     * @returns {boolean} `true` if the mouse button is currently pressed, `false` otherwise.
     * @memberof Input
     */
    public static GetMouseButton(mouseButton: MouseButton): boolean {
        return this.currentMouseButtons[mouseButton];
    }

    /**
     * Checks whether a gamepad button was pressed this frame.
     *
     * @static
     * @param {GamepadButton} button - The button index to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @returns {boolean} `true` if the button was pressed this frame, `false` otherwise.
     * @memberof Input
     */
    public static GetGamepadButtonDown(button: GamepadButton, gamepadIndex: number = 0): boolean {
        return (
            this.GetCurrentGamepadButtonState(gamepadIndex, button) &&
            !this.GetPreviousGamepadButtonState(gamepadIndex, button)
        );
    }

    /**
     * Checks whether a gamepad button was released this frame.
     *
     * @static
     * @param {GamepadButton} button - The button index to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @returns {boolean} `true` if the button was released this frame, `false` otherwise.
     * @memberof Input
     */
    public static GetGamepadButtonUp(button: GamepadButton, gamepadIndex: number = 0): boolean {
        return (
            !this.GetCurrentGamepadButtonState(gamepadIndex, button) &&
            this.GetPreviousGamepadButtonState(gamepadIndex, button)
        );
    }

    /**
     * Checks whether a gamepad button is currently held.
     *
     * @static
     * @param {GamepadButton} button - The button index to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @returns {boolean} `true` if the button is currently pressed, `false` otherwise.
     * @memberof Input
     */
    public static GetGamepadButton(button: GamepadButton, gamepadIndex: number = 0): boolean {
        return this.GetCurrentGamepadButtonState(gamepadIndex, button);
    }

    /**
     * Gets the current value of a gamepad axis.
     *
     * @static
     * @param {GamepadAxis} axis - The axis to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @param {number} deadZone - Dead zone used for stick axes. Defaults to `0.1`.
     * @returns {number} Axis value in range `[-1, 1]` for sticks and `[0, 1]` for triggers.
     * @memberof Input
     */
    public static GetGamepadAxis(
        axis: GamepadAxis,
        gamepadIndex: number = 0,
        deadZone: number = 0.1,
    ): number {
        const value: number = this.GetCurrentGamepadAxisState(gamepadIndex, axis);

        if (axis === GamepadAxis.LeftTrigger || axis === GamepadAxis.RightTrigger) {
            return Math.max(0, Math.min(1, value));
        }

        return Math.abs(value) < deadZone ? 0 : value;
    }

    /**
     * Checks whether a gamepad with the given index is currently connected.
     *
     * @static
     * @param {number} gamepadIndex - The gamepad index to check.
     * @returns {boolean} `true` if the gamepad is connected.
     * @memberof Input
     */
    public static IsGamepadConnected(gamepadIndex: number = 0): boolean {
        return this.gamepads[gamepadIndex] !== undefined;
    }

    /**
     * Handles the gamepad connected event.
     *
     * This method is called when a gamepad is connected and adds the gamepad to the `Input`'s gamepad list.
     *
     * @static
     * @param {Gamepad} gamepad - The connected gamepad to add to the input system.
     * @throws {InvalidArgumentError} If the gamepad is not provided or is not a valid Gamepad object.
     * @memberof Input
     */
    public static AddGamepad(gamepad: Gamepad): void {
        if (!gamepad) {
            throw new InvalidArgumentError(
                'Gamepad must be provided and must be a valid Gamepad object.',
            );
        }

        this.gamepads[gamepad.index] = gamepad;

        if (!this.currentGamepadButtons[gamepad.index]) {
            this.currentGamepadButtons[gamepad.index] = [];
        }

        if (!this.previousGamepadButtons[gamepad.index]) {
            this.previousGamepadButtons[gamepad.index] = [];
        }

        gamepad.vibrationActuator?.playEffect('dual-rumble', {
            duration: 100,
            strongMagnitude: 1.0,
            weakMagnitude: 1.0,
        });
    }

    /**
     * Handles the gamepad disconnected event.
     *
     * This method is called when a gamepad is disconnected and removes the gamepad from the `Input`'s gamepad list.
     *
     * @static
     * @param {Gamepad} gamepad - The disconnected gamepad to remove from the input system.
     * @throws {InvalidArgumentError} If the gamepad is not provided or is not a valid Gamepad object.
     * @memberof Input
     */
    public static RemoveGamepad(gamepad: Gamepad): void {
        if (!gamepad) {
            throw new InvalidArgumentError(
                'Gamepad must be provided and must be a valid Gamepad object.',
            );
        }

        delete this.gamepads[gamepad.index];
        delete this.currentGamepadButtons[gamepad.index];
        delete this.previousGamepadButtons[gamepad.index];
        delete this.currentGamepadAxes[gamepad.index];
    }

    /**
     * Checks the current state of a gamepad button for a specific gamepad index.
     *
     * @private
     * @static
     * @param {number} gamepadIndex - The index of the connected gamepad to check.
     * @param {GamepadButton} button - The button index to query.
     * @returns {boolean} `true` if the button is currently pressed, `false` otherwise.
     * @memberof Input
     */
    private static GetCurrentGamepadButtonState(
        gamepadIndex: number,
        button: GamepadButton,
    ): boolean {
        return this.currentGamepadButtons[gamepadIndex]?.[button] ?? false;
    }

    /**
     * Checks the previous state of a gamepad button for a specific gamepad index.
     *
     * @private
     * @static
     * @param {number} gamepadIndex - The index of the connected gamepad to check.
     * @param {GamepadButton} button - The button index to query.
     * @returns {boolean} `true` if the button was pressed in the previous frame, `false` otherwise.
     * @memberof Input
     */
    private static GetPreviousGamepadButtonState(
        gamepadIndex: number,
        button: GamepadButton,
    ): boolean {
        return this.previousGamepadButtons[gamepadIndex]?.[button] ?? false;
    }

    /**
     * Checks the current state of a gamepad axis for a specific gamepad index.
     *
     * @private
     * @static
     * @param {number} gamepadIndex - The index of the connected gamepad to check.
     * @param {GamepadAxis} axis - The axis index to query.
     * @returns {number} The current value of the specified axis, or `0` if the axis is not available.
     * @memberof Input
     */
    private static GetCurrentGamepadAxisState(gamepadIndex: number, axis: GamepadAxis): number {
        return this.currentGamepadAxes[gamepadIndex]?.[axis] ?? 0;
    }
}

export { MouseButton };
export { GamepadButton };
export { GamepadAxis };
export { KeyCode };