import { Vector2 } from '@xloxlolex/vector-math';

import { MouseButton } from './mouse-button';
import { GamepadButton } from './gamepad-button';
import { GamepadAxis } from './gamepad-axis';
import { KeyCode } from './key-code';
import { Log } from '../log/log';
import { Device } from '../engine/device';
import { UIAnchor } from '../ui/types/ui-anchor.type';
import { UIVirtualJoystick } from '../ui/interfaces/ui-virtual-joystick.interface';

import { AlreadyInitializedError, InvalidArgumentError, NotInitializedError } from '../../errors';
import { VirtualJoystickState } from './interfaces/virtual-joystick-state.interface';

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
     * Indicates whether the input system has been initialized.
     *
     * @private
     * @static
     * @type {boolean}
     * @memberof Input
     */
    private static initialized: boolean = false;

    private static readonly virtualJoystickDesktopMargin: number = 24;
    private static readonly virtualJoystickMobileMargin: number = 16;
    private static readonly virtualJoystickDesktopOuterRadius: number = 72;
    private static readonly virtualJoystickMobileOuterRadius: number = 64;
    private static readonly virtualJoystickDesktopThumbRadius: number = 36;
    private static readonly virtualJoystickMobileThumbRadius: number = 32;
    private static readonly virtualJoystickDistanceFactor: number = 0.56;

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
     * Mouse buttons that were pressed during the current frame.
     *
     * This allows pointer taps that begin and end between updates to still
     * register as a click for one frame.
     *
     * @private
     * @static
     * @type {boolean[]}
     * @memberof Input
     */
    private static mouseButtonPressedThisFrame: boolean[] = [];

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
     * Virtual gamepad axis states by gamepad index.
     *
     * This is used by touch-first controls, such as the mobile virtual joystick,
     * to feed axis input through the same path as physical gamepads.
     *
     * @private
     * @static
     * @type {{ [gamepadIndex: number]: number[] }}
     * @memberof Input
     */
    private static virtualGamepadAxes: { [gamepadIndex: number]: number[] } = {};

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

    private static virtualJoysticks: { [id: string]: VirtualJoystickState } = {};
    private static activeVirtualJoystickIdsByPointer: { [pointerId: number]: string } = {};

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
     * Returns whether the virtual joystick should be active for the current device.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Input
     */
    public static get VirtualJoystickEnabled(): boolean {
        return Device.Mobile || Device.Phone || Device.Tablet;
    }

    /**
     * Indicates whether the `Input` system has been initialized.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Input
     */
    public static get Initialized(): boolean {
        return this.initialized;
    }

    /**
     * Initializes the `Input` system.
     *
     * @static
     * @throws {AlreadyInitializedError} If the `Input` system has already been initialized.
     * @memberof Input
     */
    public static Initialize(): void {
        Log.Info('Input.Initialize() - Initializing Input...');
        Log.Trace('Input.Initialize() - Checking if Input is already initialized...');

        if (this.initialized) {
            throw new AlreadyInitializedError(
                'Input is already initialized. Please call Input.Shutdown() before initializing again.',
            );
        }

        Log.Trace(
            'Input.Initialize() - Input is not initialized. Proceeding with initialization...',
        );

        this.initialized = true;
        Log.Debug('Input.Initialize() - Input initialized successfully.');
    }

    /**
     * Configures a virtual joystick by its unique identifier.
     *
     * @static
     * @param {string} id - The unique joystick identifier.
     * @param {UIVirtualJoystick} options - The joystick configuration.
     * @memberof Input
     */
    public static ConfigureVirtualJoystick(id: string, options: UIVirtualJoystick): void {
        const previousState = this.virtualJoysticks[id];

        this.virtualJoysticks[id] = {
            options,
            thumbOffset: previousState?.thumbOffset ?? new Vector2(0, 0),
            activePointerId: previousState?.activePointerId ?? null,
        };

        if (!(options.enabled ?? true) && previousState?.activePointerId !== null) {
            this.ResetVirtualJoystick(id);
        }
    }

    /**
     * Returns the current layout metrics for a virtual joystick.
     *
     * @static
     * @param {string} id - The unique joystick identifier.
     * @returns {{ center: Vector2; outerRadius: number; thumbRadius: number; maxThumbDistance: number; } | null}
     * The resolved center point and radii used to draw and hit-test the joystick.
     * @memberof Input
     */
    public static GetVirtualJoystickMetrics(id: string): {
        center: Vector2;
        outerRadius: number;
        thumbRadius: number;
        maxThumbDistance: number;
    } | null {
        const joystick = this.virtualJoysticks[id];

        if (!joystick) {
            return null;
        }

        const options = joystick.options;
        const compactLayout = Device.ViewportWidth <= 768;
        const margin = compactLayout
            ? this.virtualJoystickMobileMargin
            : this.virtualJoystickDesktopMargin;
        const outerRadius =
            options.outerRadius ??
            (compactLayout
                ? this.virtualJoystickMobileOuterRadius
                : this.virtualJoystickDesktopOuterRadius);
        const thumbRadius =
            options.thumbRadius ??
            (compactLayout
                ? this.virtualJoystickMobileThumbRadius
                : this.virtualJoystickDesktopThumbRadius);
        const size = new Vector2(outerRadius * 2, outerRadius * 2);
        const position = this.ResolveAnchoredPosition(options.position, options.anchor, size);

        return {
            center: new Vector2(position.x + outerRadius, position.y + outerRadius),
            outerRadius,
            thumbRadius,
            maxThumbDistance:
                options.maxThumbDistance ??
                Math.max(1, outerRadius * this.virtualJoystickDistanceFactor),
        };
    }

    /**
     * Returns the current thumb offset for a virtual joystick.
     *
     * @static
     * @param {string} id - The unique joystick identifier.
     * @returns {Vector2} The current thumb offset.
     * @memberof Input
     */
    public static GetVirtualJoystickThumbOffset(id: string): Vector2 {
        const joystick = this.virtualJoysticks[id];

        return joystick ? joystick.thumbOffset : new Vector2(0, 0);
    }

    /**
     * Determines whether a screen-space point lies within the virtual joystick hit area.
     *
     * @static
     * @param {Vector2} point - The screen-space point to test.
     * @returns {boolean} `true` if the point is inside the joystick region, `false` otherwise.
     * @memberof Input
     */
    public static IsPointInsideVirtualJoystick(id: string, point: Vector2): boolean {
        const metrics = this.GetVirtualJoystickMetrics(id);

        if (!metrics) {
            return false;
        }

        return (
            Math.hypot(point.x - metrics.center.x, point.y - metrics.center.y) <=
            metrics.outerRadius
        );
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
        this.mouseButtonPressedThisFrame = [];
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
     * Shuts down the `Input` system and performs any necessary cleanup.
     *
     * @static
     * @throws {NotInitializedError} If the `Input` system has not been initialized.
     * @memberof Input
     */
    public static Shutdown(): void {
        Log.Info('Input.Shutdown() - Shutting down Input...');
        Log.Trace('Input.Shutdown() - Checking if Input is initialized...');

        if (!this.initialized) {
            throw new NotInitializedError(
                'Input is not initialized. Please call Input.Initialize() before shutting down.',
            );
        }

        Log.Trace('Input.Shutdown() - Input is initialized. Proceeding with shutdown...');

        this.gamepads = [];
        this.currentGamepadAxes = {};
        this.virtualGamepadAxes = {};
        this.currentGamepadButtons = {};
        this.previousGamepadButtons = {};
        this.currentKeyCodes = [];
        this.currentMouseButtons = [];
        this.previousKeyCodes = [];
        this.previousMouseButtons = [];
        this.scrollDelta = 0;
        this.virtualJoysticks = {};
        this.activeVirtualJoystickIdsByPointer = {};

        this.initialized = false;
        Log.Debug('Input.Shutdown() - Input shut down successfully.');
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
        this.mouseButtonPressedThisFrame[mouseButton] = true;
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
     * Sets a virtual gamepad axis value.
     *
     * This is primarily used by touch controls so they can share the same axis
     * query path as a physical gamepad.
     *
     * @static
     * @param {GamepadAxis} axis - The axis to update.
     * @param {number} value - The normalized axis value in range `[-1, 1]`.
     * @param {number} gamepadIndex - The virtual gamepad index. Defaults to `0`.
     * @memberof Input
     */
    public static SetVirtualGamepadAxis(
        axis: GamepadAxis,
        value: number,
        gamepadIndex: number = 0,
    ): void {
        if (!this.virtualGamepadAxes[gamepadIndex]) {
            this.virtualGamepadAxes[gamepadIndex] = [];
        }

        this.virtualGamepadAxes[gamepadIndex][axis] = Math.max(-1, Math.min(1, value));
    }

    /**
     * Clears all virtual gamepad axes for the specified index.
     *
     * @static
     * @param {number} gamepadIndex - The virtual gamepad index. Defaults to `0`.
     * @memberof Input
     */
    public static ClearVirtualGamepadAxes(gamepadIndex: number = 0): void {
        delete this.virtualGamepadAxes[gamepadIndex];
    }

    /**
     * Clears a single virtual gamepad axis for the specified index.
     *
     * @static
     * @param {GamepadAxis} axis - The axis to clear.
     * @param {number} gamepadIndex - The virtual gamepad index. Defaults to `0`.
     * @memberof Input
     */
    public static ClearVirtualGamepadAxis(axis: GamepadAxis, gamepadIndex: number = 0): void {
        if (!this.virtualGamepadAxes[gamepadIndex]) {
            return;
        }

        this.virtualGamepadAxes[gamepadIndex][axis] = 0;
    }

    /**
     * Resets a virtual joystick thumb and its mapped axes to their centered state.
     *
     * @static
     * @param {string} id - The unique joystick identifier.
     * @memberof Input
     */
    public static ResetVirtualJoystick(id: string): void {
        const joystick = this.virtualJoysticks[id];

        if (!joystick) {
            return;
        }

        if (joystick.activePointerId !== null) {
            delete this.activeVirtualJoystickIdsByPointer[joystick.activePointerId];
        }

        joystick.activePointerId = null;
        joystick.thumbOffset = new Vector2(0, 0);

        const gamepadIndex = joystick.options.gamepadIndex ?? 0;

        this.ClearVirtualGamepadAxis(
            joystick.options.xAxis ?? GamepadAxis.LeftStickX,
            gamepadIndex,
        );
        this.ClearVirtualGamepadAxis(
            joystick.options.yAxis ?? GamepadAxis.LeftStickY,
            gamepadIndex,
        );
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
        return (
            (this.mouseButtonPressedThisFrame[mouseButton] ?? false) ||
            (this.currentMouseButtons[mouseButton] && !this.previousMouseButtons[mouseButton])
        );
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
     * Returns a connected gamepad by index.
     *
     * @static
     * @param {number} gamepadIndex - The gamepad index. Defaults to `0`.
     * @returns {(Gamepad | null)} The connected gamepad, or `null` if unavailable.
     * @memberof Input
     */
    public static GetGamepad(gamepadIndex: number = 0): Gamepad | null {
        return this.gamepads[gamepadIndex] ?? null;
    }

    /**
     * Returns the browser-reported gamepad identifier string.
     *
     * @static
     * @param {number} gamepadIndex - The gamepad index. Defaults to `0`.
     * @returns {(string | null)} The gamepad id string, or `null`.
     * @memberof Input
     */
    public static GetGamepadId(gamepadIndex: number = 0): string | null {
        return this.GetGamepad(gamepadIndex)?.id ?? null;
    }

    /**
     * Returns the browser-reported gamepad mapping string.
     *
     * @static
     * @param {number} gamepadIndex - The gamepad index. Defaults to `0`.
     * @returns {(string | null)} The mapping string, or `null`.
     * @memberof Input
     */
    public static GetGamepadMapping(gamepadIndex: number = 0): string | null {
        return this.GetGamepad(gamepadIndex)?.mapping ?? null;
    }

    /**
     * Returns the connected gamepad indices currently tracked by the input system.
     *
     * @static
     * @returns {number[]} Sorted connected gamepad indices.
     * @memberof Input
     */
    public static GetConnectedGamepadIndices(): number[] {
        return Object.keys(this.gamepads)
            .map((index) => Number(index))
            .filter((index) => !Number.isNaN(index) && this.gamepads[index] !== undefined)
            .sort((a, b) => a - b);
    }

    /**
     * Returns the lowest connected gamepad index, if any.
     *
     * @static
     * @returns {(number | null)} The first connected gamepad index, or `null`.
     * @memberof Input
     */
    public static GetFirstConnectedGamepadIndex(): number | null {
        const indices = this.GetConnectedGamepadIndices();

        return indices.length > 0 ? indices[0] : null;
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
        const physicalValue = this.currentGamepadAxes[gamepadIndex]?.[axis] ?? 0;
        const virtualValue = this.virtualGamepadAxes[gamepadIndex]?.[axis] ?? 0;

        if (axis === GamepadAxis.LeftTrigger || axis === GamepadAxis.RightTrigger) {
            return Math.max(physicalValue, virtualValue);
        }

        return Math.abs(virtualValue) > Math.abs(physicalValue) ? virtualValue : physicalValue;
    }

    /**
     * Handles pointer down events for the virtual joystick.
     *
     * @static
     * @param {PointerEvent} event - The pointer event to process.
     * @memberof Input
     */
    public static OnPointerDown(event: PointerEvent): void {
        if (!this.VirtualJoystickEnabled) {
            return;
        }

        const pointerPosition = new Vector2(event.clientX, event.clientY);
        const joystickId = this.FindVirtualJoystickAtPoint(pointerPosition);

        if (!joystickId) {
            return;
        }

        this.virtualJoysticks[joystickId].activePointerId = event.pointerId;
        this.activeVirtualJoystickIdsByPointer[event.pointerId] = joystickId;
        event.preventDefault();
        this.UpdateVirtualJoystick(joystickId, event.clientX, event.clientY);
    }

    /**
     * Handles pointer move events for the virtual joystick.
     *
     * @static
     * @param {PointerEvent} event - The pointer event to process.
     * @memberof Input
     */
    public static OnPointerMove(event: PointerEvent): void {
        const joystickId = this.activeVirtualJoystickIdsByPointer[event.pointerId];

        if (!joystickId) {
            return;
        }

        event.preventDefault();
        this.UpdateVirtualJoystick(joystickId, event.clientX, event.clientY);
    }

    /**
     * Handles pointer release and cancel events for the virtual joystick.
     *
     * @static
     * @param {PointerEvent} event - The pointer event to process.
     * @memberof Input
     */
    public static OnPointerUp(event: PointerEvent): void {
        const joystickId = this.activeVirtualJoystickIdsByPointer[event.pointerId];

        if (!joystickId) {
            return;
        }

        event.preventDefault();
        this.ResetVirtualJoystick(joystickId);
    }

    /**
     * Handles pointer cancel events for the virtual joystick.
     *
     * @static
     * @param {PointerEvent} event - The pointer event to process.
     * @memberof Input
     */
    public static OnPointerCancel(event: PointerEvent): void {
        this.OnPointerUp(event);
    }

    /**
     * Updates the virtual joystick thumb offset and left stick axis values.
     *
     * @private
     * @static
     * @param {number} clientX - The pointer x-coordinate in screen space.
     * @param {number} clientY - The pointer y-coordinate in screen space.
     * @memberof Input
     */
    private static UpdateVirtualJoystick(id: string, clientX: number, clientY: number): void {
        const joystick = this.virtualJoysticks[id];
        const metrics = this.GetVirtualJoystickMetrics(id);

        if (!joystick || !metrics) {
            return;
        }

        const deltaX = clientX - metrics.center.x;
        const deltaY = clientY - metrics.center.y;
        const maxDistance = Math.max(1, metrics.maxThumbDistance);
        const distance = Math.hypot(deltaX, deltaY);
        const clampScale = distance > maxDistance ? maxDistance / distance : 1;
        const clampedX = deltaX * clampScale;
        const clampedY = deltaY * clampScale;

        joystick.thumbOffset = new Vector2(clampedX, clampedY);

        const gamepadIndex = joystick.options.gamepadIndex ?? 0;

        this.SetVirtualGamepadAxis(
            joystick.options.xAxis ?? GamepadAxis.LeftStickX,
            clampedX / maxDistance,
            gamepadIndex,
        );
        this.SetVirtualGamepadAxis(
            joystick.options.yAxis ?? GamepadAxis.LeftStickY,
            clampedY / maxDistance,
            gamepadIndex,
        );
    }

    /**
     * Finds the closest enabled virtual joystick under the provided point.
     *
     * @private
     * @static
     * @param {Vector2} point - The screen-space point to test.
     * @returns {(string | null)} The matching joystick identifier, or `null`.
     * @memberof Input
     */
    private static FindVirtualJoystickAtPoint(point: Vector2): string | null {
        let selectedId: string | null = null;
        let selectedDistance: number = Number.POSITIVE_INFINITY;

        for (const [id, joystick] of Object.entries(this.virtualJoysticks)) {
            if (!(joystick.options.enabled ?? true) || joystick.activePointerId !== null) {
                continue;
            }

            const metrics = this.GetVirtualJoystickMetrics(id);

            if (!metrics || !this.IsPointInsideVirtualJoystick(id, point)) {
                continue;
            }

            const distance = Math.hypot(point.x - metrics.center.x, point.y - metrics.center.y);

            if (distance < selectedDistance) {
                selectedDistance = distance;
                selectedId = id;
            }
        }

        return selectedId;
    }

    /**
     * Resolves a joystick position relative to the viewport using the provided anchor and size.
     *
     * @private
     * @static
     * @param {Vector2} position - The position relative to the anchor origin.
     * @param {UIAnchor} [anchor='bottom-left'] - The viewport anchor.
     * @param {Vector2} size - The joystick bounds size.
     * @returns {Vector2} The resolved top-left position.
     * @memberof Input
     */
    private static ResolveAnchoredPosition(
        position: Vector2,
        anchor: UIAnchor = 'bottom-left',
        size: Vector2,
    ): Vector2 {
        const origin = this.GetAnchorOrigin(anchor);

        return new Vector2(
            origin.x + position.x - size.x * this.GetHorizontalAnchorFactor(anchor),
            origin.y + position.y - size.y * this.GetVerticalAnchorFactor(anchor),
        );
    }

    private static GetAnchorOrigin(anchor: UIAnchor): Vector2 {
        switch (anchor) {
            case 'top-center':
                return new Vector2(Device.ViewportWidth * 0.5, 0);
            case 'top-right':
                return new Vector2(Device.ViewportWidth, 0);
            case 'center-left':
                return new Vector2(0, Device.ViewportHeight * 0.5);
            case 'center':
                return new Vector2(Device.ViewportWidth * 0.5, Device.ViewportHeight * 0.5);
            case 'center-right':
                return new Vector2(Device.ViewportWidth, Device.ViewportHeight * 0.5);
            case 'bottom-center':
                return new Vector2(Device.ViewportWidth * 0.5, Device.ViewportHeight);
            case 'bottom-right':
                return new Vector2(Device.ViewportWidth, Device.ViewportHeight);
            case 'bottom-left':
                return new Vector2(0, Device.ViewportHeight);
            case 'top-left':
            default:
                return Vector2.zero;
        }
    }

    private static GetHorizontalAnchorFactor(anchor: UIAnchor): number {
        if (anchor.endsWith('right')) {
            return 1;
        }

        if (anchor.includes('center')) {
            return 0.5;
        }

        return 0;
    }

    private static GetVerticalAnchorFactor(anchor: UIAnchor): number {
        if (anchor.startsWith('bottom')) {
            return 1;
        }

        if (anchor.startsWith('center')) {
            return 0.5;
        }

        return 0;
    }
}

export { MouseButton };
export { GamepadButton };
export { GamepadAxis };
export { KeyCode };
