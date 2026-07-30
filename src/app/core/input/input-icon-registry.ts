import { Engine } from '../engine/engine';

import { GamepadButton } from './gamepad-button';
import { Input } from './input';
import { KeyCode } from './key-code';
import { MouseButton } from './mouse-button';
import { InputIconFamily } from './input-icon-family';
import { GamepadIconTheme, KeyboardMouseIconTheme } from './input-icon-theme';

/**
 * Centralized registry responsible for mapping input tokens to icon assets.
 *
 * The registry supports keyboard, mouse, and multiple gamepad families,
 * and resolves the best matching icon set based on the connected controller.
 *
 * @export
 * @class InputIconRegistry
 */
export class InputIconRegistry {
    private static readonly basePath: string = 'assets/images/input';

    private static keyboardMouseTheme: KeyboardMouseIconTheme = KeyboardMouseIconTheme.Dark;

    private static readonly gamepadThemes: Record<InputIconFamily, GamepadIconTheme> = {
        [InputIconFamily.KeyboardMouse]: GamepadIconTheme.Default,
        [InputIconFamily.Xbox]: GamepadIconTheme.Default,
        [InputIconFamily.PlayStation4]: GamepadIconTheme.Default,
        [InputIconFamily.PlayStation5]: GamepadIconTheme.Default,
        [InputIconFamily.Switch]: GamepadIconTheme.Default,
        [InputIconFamily.Generic]: GamepadIconTheme.Default,
    };

    private static fallbackGamepadFamily: InputIconFamily = InputIconFamily.Xbox;
    private static readonly imageCache: Map<string, CanvasImageSource> = new Map();

    /**
     * Sets the active keyboard and mouse theme.
     *
     * @static
     * @param {KeyboardMouseIconTheme} theme - The theme to use.
     * @memberof InputIconRegistry
     */
    public static SetKeyboardMouseTheme(theme: KeyboardMouseIconTheme): void {
        this.keyboardMouseTheme = theme;
    }

    /**
     * Sets the active gamepad theme for a specific icon family.
     *
     * @static
     * @param {InputIconFamily} family - The family whose theme should be updated.
     * @param {GamepadIconTheme} theme - The desired theme.
     * @memberof InputIconRegistry
     */
    public static SetGamepadTheme(family: InputIconFamily, theme: GamepadIconTheme): void {
        if (family === InputIconFamily.KeyboardMouse) {
            return;
        }

        this.gamepadThemes[family] = theme;
    }

    /**
     * Sets the fallback gamepad family used when controller detection is unknown.
     *
     * @static
     * @param {InputIconFamily} family - The fallback family.
     * @memberof InputIconRegistry
     */
    public static SetFallbackGamepadFamily(family: InputIconFamily): void {
        if (family === InputIconFamily.KeyboardMouse || family === InputIconFamily.Generic) {
            return;
        }

        this.fallbackGamepadFamily = family;
    }

    /**
     * Clears cached icon images.
     *
     * @static
     * @memberof InputIconRegistry
     */
    public static ClearCache(): void {
        this.imageCache.clear();
    }

    /**
     * Resolves the icon family for a connected gamepad index.
     *
     * @static
     * @param {number} gamepadIndex - The gamepad index. Defaults to `0`.
     * @returns {InputIconFamily} The resolved icon family.
     * @memberof InputIconRegistry
     */
    public static GetGamepadFamily(gamepadIndex: number = 0): InputIconFamily {
        const gamepadId = Input.GetGamepadId(gamepadIndex);

        if (!gamepadId) {
            return this.fallbackGamepadFamily;
        }

        const detectedFamily = this.DetectGamepadFamily(gamepadId);

        if (detectedFamily === InputIconFamily.Generic) {
            return this.fallbackGamepadFamily;
        }

        return detectedFamily;
    }

    /**
     * Detects the gamepad icon family by browser identifier.
     *
     * @static
     * @param {string} gamepadId - Browser-reported gamepad id.
     * @returns {InputIconFamily} The detected family.
     * @memberof InputIconRegistry
     */
    public static DetectGamepadFamily(gamepadId: string): InputIconFamily {
        const id = gamepadId.toLowerCase();

        if (id.includes('dualsense') || id.includes('playstation 5') || id.includes('ps5')) {
            return InputIconFamily.PlayStation5;
        }

        if (id.includes('dualshock') || id.includes('playstation 4') || id.includes('ps4')) {
            return InputIconFamily.PlayStation4;
        }

        if (
            id.includes('switch') ||
            id.includes('nintendo') ||
            id.includes('joy-con') ||
            id.includes('joycon') ||
            id.includes('steam')
        ) {
            return InputIconFamily.Switch;
        }

        if (id.includes('xbox') || id.includes('xinput')) {
            return InputIconFamily.Xbox;
        }

        return InputIconFamily.Generic;
    }

    /**
     * Resolves the keyboard icon image for a key code.
     *
     * @static
     * @param {KeyCode} keyCode - The key code.
     * @returns {CanvasImageSource} The loaded icon image.
     * @memberof InputIconRegistry
     */
    public static GetKeyboardKeyImage(keyCode: KeyCode): CanvasImageSource {
        return this.GetCachedImage(this.GetKeyboardKeyImagePath(keyCode));
    }

    /**
     * Resolves the keyboard icon path for a key code.
     *
     * @static
     * @param {KeyCode} keyCode - The key code.
     * @returns {string} The icon path.
     * @memberof InputIconRegistry
     */
    public static GetKeyboardKeyImagePath(keyCode: KeyCode): string {
        const token = this.GetKeyboardKeyToken(keyCode);
        const theme = this.keyboardMouseTheme;

        return `${this.basePath}/Keyboard_Mouse/${theme}/T_${token}_Key_${theme}.png`;
    }

    /**
     * Resolves the mouse icon image for a mouse button.
     *
     * @static
     * @param {MouseButton} mouseButton - The mouse button.
     * @returns {CanvasImageSource} The loaded icon image.
     * @memberof InputIconRegistry
     */
    public static GetMouseButtonImage(mouseButton: MouseButton): CanvasImageSource {
        return this.GetCachedImage(this.GetMouseButtonImagePath(mouseButton));
    }

    /**
     * Resolves the mouse icon path for a mouse button.
     *
     * @static
     * @param {MouseButton} mouseButton - The mouse button.
     * @returns {string} The icon path.
     * @memberof InputIconRegistry
     */
    public static GetMouseButtonImagePath(mouseButton: MouseButton): string {
        const theme = this.keyboardMouseTheme;
        const token = this.GetMouseButtonToken(mouseButton);

        return `${this.basePath}/Keyboard_Mouse/${theme}/T_Mouse_${token}_Key_${theme}.png`;
    }

    /**
     * Resolves a gamepad icon image for the specified button and connected gamepad index.
     *
     * @static
     * @param {GamepadButton} button - The gamepad button.
     * @param {number} gamepadIndex - The gamepad index. Defaults to `0`.
     * @returns {CanvasImageSource} The loaded icon image.
     * @memberof InputIconRegistry
     */
    public static GetGamepadButtonImage(
        button: GamepadButton,
        gamepadIndex: number = 0,
    ): CanvasImageSource {
        return this.GetCachedImage(this.GetGamepadButtonImagePath(button, gamepadIndex));
    }

    /**
     * Resolves a gamepad icon path for the specified button and connected gamepad index.
     *
     * @static
     * @param {GamepadButton} button - The gamepad button.
     * @param {number} gamepadIndex - The gamepad index. Defaults to `0`.
     * @returns {string} The icon path.
     * @memberof InputIconRegistry
     */
    public static GetGamepadButtonImagePath(button: GamepadButton, gamepadIndex: number = 0): string {
        const family = this.GetGamepadFamily(gamepadIndex);

        return this.GetGamepadButtonImagePathByFamily(button, family);
    }

    /**
     * Resolves a gamepad icon path for the specified button and explicit icon family.
     *
     * @static
     * @param {GamepadButton} button - The gamepad button.
     * @param {InputIconFamily} family - The icon family.
     * @returns {string} The icon path.
     * @memberof InputIconRegistry
     */
    public static GetGamepadButtonImagePathByFamily(
        button: GamepadButton,
        family: InputIconFamily,
    ): string {
        const effectiveFamily = this.NormalizeGamepadFamily(family);
        const theme = this.GetGamepadTheme(effectiveFamily);
        const directory = this.GetGamepadDirectory(effectiveFamily);
        const token = this.GetGamepadButtonToken(button, effectiveFamily);
        const prefix = this.GetGamepadPrefix(effectiveFamily);

        return `${this.basePath}/${directory}/${theme}/T_${prefix}_${token}.png`;
    }

    private static GetGamepadTheme(family: InputIconFamily): GamepadIconTheme {
        if (family === InputIconFamily.PlayStation4 && this.gamepadThemes[family] === GamepadIconTheme.Alt2) {
            return GamepadIconTheme.Alt;
        }

        if (family === InputIconFamily.Switch && this.gamepadThemes[family] === GamepadIconTheme.Stylized) {
            return GamepadIconTheme.Default;
        }

        if (family === InputIconFamily.Xbox && this.gamepadThemes[family] === GamepadIconTheme.Stylized) {
            return GamepadIconTheme.Default;
        }

        if (family === InputIconFamily.PlayStation5 && this.gamepadThemes[family] === GamepadIconTheme.Stylized) {
            return GamepadIconTheme.Default;
        }

        return this.gamepadThemes[family] ?? GamepadIconTheme.Default;
    }

    private static NormalizeGamepadFamily(family: InputIconFamily): InputIconFamily {
        if (family === InputIconFamily.KeyboardMouse || family === InputIconFamily.Generic) {
            return this.fallbackGamepadFamily;
        }

        return family;
    }

    private static GetGamepadPrefix(family: InputIconFamily): string {
        switch (family) {
            case InputIconFamily.PlayStation4:
                return 'P4';
            case InputIconFamily.PlayStation5:
                return 'P5';
            case InputIconFamily.Switch:
                return 'S';
            case InputIconFamily.Xbox:
            default:
                return 'X';
        }
    }

    private static GetGamepadDirectory(family: InputIconFamily): string {
        switch (family) {
            case InputIconFamily.PlayStation4:
                return 'P4Gamepad';
            case InputIconFamily.PlayStation5:
                return 'P5Gamepad';
            case InputIconFamily.Switch:
                return 'SGamepad';
            case InputIconFamily.Xbox:
            default:
                return 'XGamepad';
        }
    }

    private static GetGamepadButtonToken(button: GamepadButton, family: InputIconFamily): string {
        switch (family) {
            case InputIconFamily.PlayStation4:
            case InputIconFamily.PlayStation5:
                return this.GetPlayStationButtonToken(button);
            case InputIconFamily.Switch:
                return this.GetSwitchButtonToken(button);
            case InputIconFamily.Xbox:
            default:
                return this.GetXboxButtonToken(button);
        }
    }

    private static GetXboxButtonToken(button: GamepadButton): string {
        switch (button) {
            case GamepadButton.A:
                return 'A_Color';
            case GamepadButton.B:
                return 'B_Color';
            case GamepadButton.X:
                return 'X_Color';
            case GamepadButton.Y:
                return 'Y_Color';
            case GamepadButton.LB:
                return 'LB';
            case GamepadButton.RB:
                return 'RB';
            case GamepadButton.LT:
                return 'LT';
            case GamepadButton.RT:
                return 'RT';
            case GamepadButton.View:
                return 'Share';
            case GamepadButton.Menu:
                return 'X';
            case GamepadButton.LeftStick:
                return 'Left_Stick_Click';
            case GamepadButton.RightStick:
                return 'Right_Stick_Click';
            case GamepadButton.Up:
                return 'Dpad_Up';
            case GamepadButton.Down:
                return 'Dpad_Down';
            case GamepadButton.Left:
                return 'Dpad_Left';
            case GamepadButton.Right:
                return 'Dpad_Right';
            case GamepadButton.Home:
                return 'Share';
            default:
                return 'Share';
        }
    }

    private static GetPlayStationButtonToken(button: GamepadButton): string {
        switch (button) {
            case GamepadButton.Cross:
                return 'Cross';
            case GamepadButton.Circle:
                return 'Circle';
            case GamepadButton.Square:
                return 'Square';
            case GamepadButton.Triangle:
                return 'Triangle';
            case GamepadButton.L1:
                return 'L1';
            case GamepadButton.R1:
                return 'R1';
            case GamepadButton.L2:
                return 'L2';
            case GamepadButton.R2:
                return 'R2';
            case GamepadButton.Select:
                return 'Share';
            case GamepadButton.Start:
                return 'Options';
            case GamepadButton.L3:
                return 'L3';
            case GamepadButton.R3:
                return 'R3';
            case GamepadButton.Up:
                return 'Dpad_UP';
            case GamepadButton.Down:
                return 'Dpad_Down';
            case GamepadButton.Left:
                return 'Dpad_Left';
            case GamepadButton.Right:
                return 'Dpad_Right';
            case GamepadButton.TouchPad:
                return 'Touch_Pad';
            default:
                return 'Options';
        }
    }
    private static GetSwitchButtonToken(button: GamepadButton): string {
        switch (button) {
            case GamepadButton.A:
                return 'A';
            case GamepadButton.B:
                return 'B';
            case GamepadButton.X:
                return 'X';
            case GamepadButton.Y:
                return 'Y';
            case GamepadButton.LB:
                return 'LB';
            case GamepadButton.RB:
                return 'RB';
            case GamepadButton.LT:
                return 'LT';
            case GamepadButton.RT:
                return 'RT';
            case GamepadButton.View:
                return 'Minus';
            case GamepadButton.Menu:
                return 'Plus';
            case GamepadButton.LeftStick:
                return 'L';
            case GamepadButton.RightStick:
                return 'R';
            case GamepadButton.Up:
                return 'Up';
            case GamepadButton.Down:
                return 'Down';
            case GamepadButton.Left:
                return 'Left';
            case GamepadButton.Right:
                return 'Right';
            case GamepadButton.Home:
                return 'Home';
            default:
                return 'Plus';
        }
    }

    private static GetKeyboardKeyToken(keyCode: KeyCode): string {
        const explicitToken = this.GetExplicitKeyboardKeyToken(keyCode);

        if (explicitToken) {
            return explicitToken;
        }

        const enumName = KeyCode[keyCode];

        if (!enumName) {
            return 'Esc';
        }

        if (/^F\d+$/.test(enumName)) {
            return enumName;
        }

        if (/^[A-Z]$/.test(enumName)) {
            return enumName;
        }

        if (enumName.startsWith('Numpad')) {
            const suffix = enumName.replace('Numpad', '');

            if (/^\d+$/.test(suffix)) {
                return suffix;
            }
        }

        return enumName;
    }

    private static GetExplicitKeyboardKeyToken(keyCode: KeyCode): string | null {
        switch (keyCode) {
            case KeyCode.Backspace:
                return 'BackSpace';
            case KeyCode.Tab:
                return 'Tab';
            case KeyCode.Enter:
                return 'Enter';
            case KeyCode.Shift:
                return 'Shift';
            case KeyCode.Ctrl:
                return 'Crtl';
            case KeyCode.Alt:
                return 'Alt';
            case KeyCode.CapsLock:
                return 'CapsLock';
            case KeyCode.Escape:
                return 'Esc';
            case KeyCode.Space:
                return 'Space';
            case KeyCode.PageUp:
                return 'PageUp';
            case KeyCode.PageDown:
                return 'PageDown';
            case KeyCode.Home:
                return 'Home';
            case KeyCode.End:
                return 'End';
            case KeyCode.Insert:
                return 'Ins';
            case KeyCode.Delete:
                return 'Del';
            case KeyCode.LeftArrow:
                return 'Left';
            case KeyCode.RightArrow:
                return 'Right';
            case KeyCode.UpArrow:
                return 'Up';
            case KeyCode.DownArrow:
                return 'Down';
            case KeyCode.Zero:
                return '0';
            case KeyCode.One:
                return '1';
            case KeyCode.Two:
                return '2';
            case KeyCode.Three:
                return '3';
            case KeyCode.Four:
                return '4';
            case KeyCode.Five:
                return '5';
            case KeyCode.Six:
                return '6';
            case KeyCode.Seven:
                return '7';
            case KeyCode.Eight:
                return '8';
            case KeyCode.Nine:
                return '9';
            case KeyCode.Multiply:
                return 'Asterisk';
            case KeyCode.Add:
                return 'Plus';
            case KeyCode.Subtract:
                return 'Minus';
            case KeyCode.DecimalPoint:
                return 'Period';
            case KeyCode.Divide:
                return 'Slash';
            case KeyCode.NumLock:
                return 'NumLock';
            case KeyCode.SemiColon:
                return 'Semicolon';
            case KeyCode.Equals:
                return 'Plus';
            case KeyCode.Comma:
                return 'Comma';
            case KeyCode.Dash:
                return 'Minus';
            case KeyCode.Period:
                return 'Period';
            case KeyCode.ForwardSlash:
                return 'Slash';
            case KeyCode.Tilde:
                return 'Tilde';
            case KeyCode.OpenBracket:
                return 'Brackets_L';
            case KeyCode.ClosedBracket:
                return 'Brackets_R';
            case KeyCode.Quote:
                return 'Quotation';
            default:
                return null;
        }
    }

    private static GetMouseButtonToken(mouseButton: MouseButton): string {
        switch (mouseButton) {
            case MouseButton.Left:
                return 'Left';
            case MouseButton.Center:
                return 'Middle';
            case MouseButton.Right:
                return 'Right';
            case MouseButton.Back:
            case MouseButton.Forward:
            default:
                return 'Simple';
        }
    }

    private static GetCachedImage(path: string): CanvasImageSource {
        const cached = this.imageCache.get(path);

        if (cached) {
            return cached;
        }

        const image = Engine.LoadImage(path);
        this.imageCache.set(path, image);

        return image;
    }
}
