import { Vector2 } from "@xloxlolex/vector-math";
import { Key as KeyCode } from 'ts-keycode-enum';

/**
 * Represents the mouse buttons used in the input system.
 * Each button is represented by an enum value.
 */
export enum MouseButton {
    Button0 = 0,
    Button1 = 1,
    Button2 = 2,
    Button3 = 3,
    Button4 = 4,

    Left = Button0,
    Center = Button1,
    Right = Button2,
    Back = Button3,
    Forward = Button4,
}

export enum GamepadButton {
    Button0 = 0,
    Button1 = 1,
    Button2 = 2,
    Button3 = 3,
    Button4 = 4,
    Button5 = 5,
    Button6 = 6,
    Button7 = 7,
    Button8 = 8,
    Button9 = 9,
    Button10 = 10,
    Button11 = 11,
    Button12 = 12,
    Button13 = 13,
    Button14 = 14,
    Button15 = 15,
    Button16 = 16,

    A = Button0,
    B = Button1,
    X = Button2,
    Y = Button3,
    LB = Button4,
    RB = Button5,
    LT = Button6,
    RT = Button7,
    View = Button8,
    Menu = Button9,
    LeftStick = Button10,
    RightStick = Button11,
    DPadUp = Button12,
    DPadDown = Button13,
    DPadLeft = Button14,
    DPadRight = Button15,
    Home = Button16,
    Xbox = Button16,
    Guide = Button16,
}

export enum GamepadAxis {
    Axis0 = 0,
    Axis1 = 1,
    Axis2 = 2,
    Axis3 = 3,
    Axis4 = 4,
    Axis5 = 5,

    LeftStickX = Axis0,
    LeftStickY = Axis1,
    RightStickX = Axis2,
    RightStickY = Axis3,
    LeftTrigger = Axis4,
    RightTrigger = Axis5,
}

export { KeyCode };

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
     * This is a static property that can be accessed globally.
     * It is updated based on user input and can be used for various purposes,
     * such as determining where to draw UI elements or where the player is pointing.
     */
    private static mousePosition: Vector2 = Vector2.zero;

    /**
     * The current scroll delta of the mouse wheel.
     * This is a static property that can be accessed globally.
     * It is updated based on user input and can be used for various purposes,
     * such as zooming in and out of the game world or scrolling through menus.
     */
    private static scrollDelta: number = 0;

    /**
     * The current state of key codes.
     * This is a static array that tracks whether each key is currently pressed.
     * It uses the KeyCode enum to index into the array,
     * allowing for efficient checking of key states.
     */
    private static currentKeyCodes: boolean[] = [];

    /**
     * The previous state of key codes.
     * This is a static array that tracks whether each key was pressed in the previous frame.
     * It is used to determine if a key was pressed or released between frames.
     */
    private static previousKeyCodes: boolean[] = [];

    /**
     * The current state of mouse buttons.
     * This is a static array that tracks whether each mouse button is currently pressed.
     * It uses the MouseButton enum to index into the array,
     * allowing for efficient checking of mouse button states.
     */
    private static currentMouseButtons: boolean[] = [];

    /**
     * The previous state of mouse buttons.
     * This is a static array that tracks whether each mouse button was pressed in the previous frame.
     * It is used to determine if a mouse button was clicked or released between frames.
     */
    private static previousMouseButtons: boolean[] = [];

    /**
     * Current gamepad button states by gamepad index.
     */
    private static currentGamepadButtons: { [gamepadIndex: number]: boolean[] } = {};

    /**
     * Previous frame gamepad button states by gamepad index.
     */
    private static previousGamepadButtons: { [gamepadIndex: number]: boolean[] } = {};

    /**
     * Current gamepad axis states by gamepad index.
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
     * This method should be called each frame to ensure that the input system
     * is up-to-date with the latest user interactions.
     * It copies the current key codes and mouse buttons to their previous states,
     * allowing for detection of key presses and releases.
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
     * This method updates the static MousePosition property,
     * which can be accessed globally to determine where the mouse is currently located.
     * @param {number} x - The x-coordinate of the mouse position.
     * @param {number} y - The y-coordinate of the mouse position.
     */
    public static SetMousePosition(x: number, y: number): void {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
    }

    /**
     * Sets the state of a key code to pressed.
     * This method updates the currentKeyCodes array to indicate that the specified key is currently pressed
     * @param {KeyCode} keyCode - The key code to set as pressed.
     */
    public static SetKeyCode(keyCode: KeyCode): void {
        this.currentKeyCodes[keyCode] = true;
    }

    /**
     * Unsets the state of a key code to not pressed.
     * This method updates the currentKeyCodes array to indicate that the specified key is no longer pressed.
     * @param {KeyCode} keyCode - The key code to unset.
     */
    public static UnsetKeyCode(keyCode: KeyCode): void {
        this.currentKeyCodes[keyCode] = false;
    }

    /**
     * Sets the state of a mouse button to pressed.
     * This method updates the currentMouseButtons array to indicate that the specified mouse button is currently pressed.
     * @param {MouseButton} mouseButton - The mouse button to set as pressed.
     */
    public static SetMouseButton(mouseButton: MouseButton): void {
        this.currentMouseButtons[mouseButton] = true;
    }

    /**
     * Unsets the state of a mouse button to not pressed.
     * This method updates the currentMouseButtons array to indicate that the specified mouse button is no longer pressed.
     * @param {MouseButton} mouseButton - The mouse button to unset.
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
     * @param {KeyCode} keyCode - The key code to check.
     * @returns {boolean} `true` if the key was pressed this frame, `false` otherwise.
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
     * @param {KeyCode} keyCode - The key code to check.
     * @returns {boolean} `true` if the key was released this frame, `false` otherwise.
     */
    public static GetKeyUp(keyCode: KeyCode): boolean {
        return !this.currentKeyCodes[keyCode] && this.previousKeyCodes[keyCode];
    }

    /**
     * Checks if a specific key is currently pressed.
     *
     * This method checks the current state of the key to determine if it is pressed.
     *
     * @param {KeyCode} keyCode - The key code to check.
     * @returns {boolean} `true` if the key is currently pressed, `false` otherwise.
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
     * @param {MouseButton} mouseButton - The mouse button to check.
     * @returns {boolean} `true` if the mouse button was pressed this frame, `false` otherwise.
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
     * @param {MouseButton} mouseButton - The mouse button to check.
     * @returns {boolean} `true` if the mouse button was released this frame, `false` otherwise.
     */
    public static GetMouseButtonUp(mouseButton: MouseButton): boolean {
        return !this.currentMouseButtons[mouseButton] && this.previousMouseButtons[mouseButton];
    }

    /**
     * Checks if a specific mouse button is currently pressed.
     *
     * This method checks the current state of the mouse button to determine if it is pressed.
     *
     * @param {MouseButton} mouseButton - The mouse button to check.
     * @returns {boolean} `true` if the mouse button is currently pressed, `false` otherwise.
     */
    public static GetMouseButton(mouseButton: MouseButton): boolean {
        return this.currentMouseButtons[mouseButton];
    }

    /**
     * Checks whether a gamepad button was pressed this frame.
     *
     * @param {GamepadButton} button - The button index to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @returns {boolean} `true` if the button was pressed this frame.
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
     * @param {GamepadButton} button - The button index to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @returns {boolean} `true` if the button was released this frame.
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
     * @param {GamepadButton} button - The button index to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @returns {boolean} `true` if the button is currently pressed.
     */
    public static GetGamepadButton(button: GamepadButton, gamepadIndex: number = 0): boolean {
        return this.GetCurrentGamepadButtonState(gamepadIndex, button);
    }

    /**
     * Gets the current value of a gamepad axis.
     *
     * @param {GamepadAxis} axis - The axis to query.
     * @param {number} gamepadIndex - The connected gamepad index. Defaults to `0`.
     * @param {number} deadZone - Dead zone used for stick axes. Defaults to `0.1`.
     * @returns {number} Axis value in range `[-1, 1]` for sticks and `[0, 1]` for triggers.
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
     * @param {number} gamepadIndex - The gamepad index to check.
     * @returns {boolean} `true` if the gamepad is connected.
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
     * @memberof Input
     */
    public static AddGamepad(gamepad: Gamepad): void {
        // Implementation for adding a gamepad to the input system
        // This could involve storing the gamepad in a list of connected gamepads
        // and setting up event listeners for gamepad input.

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

        console.log('Gamepad connected:', gamepad);
    }

    /**
     * Handles the gamepad disconnected event.
     *
     * This method is called when a gamepad is disconnected and removes the gamepad from the `Input`'s gamepad list.
     *
     * @static
     * @param {Gamepad} gamepad - The disconnected gamepad to remove from the input system.
     * @memberof Input
     */
    public static RemoveGamepad(gamepad: Gamepad): void {
        // Implementation for removing a gamepad from the input system
        // This could involve removing the gamepad from the list of connected gamepads
        // and cleaning up any associated event listeners.

        delete this.gamepads[gamepad.index];
        delete this.currentGamepadButtons[gamepad.index];
        delete this.previousGamepadButtons[gamepad.index];
        delete this.currentGamepadAxes[gamepad.index];

        console.log('Gamepad disconnected:', gamepad);
    }

    private static GetCurrentGamepadButtonState(
        gamepadIndex: number,
        button: GamepadButton,
    ): boolean {
        return this.currentGamepadButtons[gamepadIndex]?.[button] ?? false;
    }

    private static GetPreviousGamepadButtonState(
        gamepadIndex: number,
        button: GamepadButton,
    ): boolean {
        return this.previousGamepadButtons[gamepadIndex]?.[button] ?? false;
    }

    private static GetCurrentGamepadAxisState(
        gamepadIndex: number,
        axis: GamepadAxis,
    ): number {
        return this.currentGamepadAxes[gamepadIndex]?.[axis] ?? 0;
    }
}