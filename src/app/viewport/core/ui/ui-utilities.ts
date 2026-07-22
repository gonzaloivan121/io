import { Vector2 } from '@xloxlolex/vector-math';
import { Input, KeyCode } from '../input/input';
import { Renderer } from '../renderer';

import { UIInput, UIInputState } from './interfaces/ui-input.interface';
import { UIAnchor } from './types/ui-anchor.type';

/**
 * Utility class providing helper methods for the `UI` system.
 *
 * @export
 * @class UIUtilities
 */
export class UIUtilities {
    /**
     * A private static map to store the state of input fields, keyed by their unique identifiers.
     *
     * @private
     * @static
     * @type {Map<string, UIInputState>}
     * @memberof UIUtilities
     */
    private static readonly inputStates: Map<string, UIInputState> = new Map();

    /**
     * Retrieves the state of an input field by its unique identifier.
     * If the state does not exist, it creates a new state with the provided initial value.
     *
     * @static
     * @param {string} id - The unique identifier for the input field.
     * @param {string} initialValue - The initial value to set if the state does not exist.
     * @returns {UIInputState} The state of the input field.
     * @memberof UIUtilities
     */
    public static GetOrCreateInputState(id: string, initialValue: string): UIInputState {
        let state = this.inputStates.get(id);

        if (!state) {
            state = { value: initialValue };
            this.inputStates.set(id, state);
        }

        return state;
    }

    /**
     * Builds a unique identifier for an input field based on its properties.
     *
     * @static
     * @param {UIInput} options - An object containing the input field rendering options.
     * @returns {string} The unique identifier for the input field.
     * @memberof UIUtilities
     */
    public static BuildInputId(options: UIInput): string {
        const anchor = options.anchor ?? 'top-left';

        return [
            anchor,
            options.position.x,
            options.position.y,
            options.size.x,
            options.size.y,
            options.placeholder ?? '',
        ].join(':');
    }

    /**
     * Determines whether the caret (text cursor) should be drawn based on the current time.
     *
     * @static
     * @returns {boolean} `true` if the caret should be drawn, `false` otherwise.
     * @memberof UIUtilities
     */
    public static ShouldDrawCaret(): boolean {
        return Math.floor(performance.now() / 500) % 2 === 0;
    }

    /**
     * Fits the provided text within the specified width, trimming it if necessary.
     *
     * @static
     * @param {string} text - The text to be fitted within the width.
     * @param {string} font - The font to be used for measuring the text width.
     * @param {number} availableWidth - The maximum width available for the text.
     * @param {boolean} trimFromStart - Whether to trim the text from the start or the end.
     * @returns {string} The fitted text.
     * @memberof UIUtilities
     */
    public static FitInputTextToWidth(
        text: string,
        font: string,
        availableWidth: number,
        trimFromStart: boolean,
    ): string {
        if (availableWidth <= 0 || text.length === 0) {
            return '';
        }

        Renderer.SetFont(font);

        if (Renderer.MeasureText(text).width <= availableWidth) {
            return text;
        }

        if (!trimFromStart) {
            let clipped = text;

            while (clipped.length > 0 && Renderer.MeasureText(clipped).width > availableWidth) {
                clipped = clipped.slice(0, -1);
            }

            return clipped;
        }

        let clipped = text;

        while (clipped.length > 0 && Renderer.MeasureText(`...${clipped}`).width > availableWidth) {
            clipped = clipped.slice(1);
        }

        return clipped.length < text.length ? `...${clipped}` : clipped;
    }

    /**
     * Retrieves the characters typed by the user based on the current key states.
     *
     * @static
     * @returns {string} The characters typed by the user.
     * @memberof UIUtilities
     */
    public static GetTypedCharacters(): string {
        const shiftPressed = Input.GetKey(KeyCode.Shift);

        const printableKeyMap: Array<{ key: KeyCode; normal: string; shifted?: string }> = [
            { key: KeyCode.Space, normal: ' ' },
            { key: KeyCode.Zero, normal: '0', shifted: ')' },
            { key: KeyCode.One, normal: '1', shifted: '!' },
            { key: KeyCode.Two, normal: '2', shifted: '@' },
            { key: KeyCode.Three, normal: '3', shifted: '#' },
            { key: KeyCode.Four, normal: '4', shifted: '$' },
            { key: KeyCode.Five, normal: '5', shifted: '%' },
            { key: KeyCode.Six, normal: '6', shifted: '^' },
            { key: KeyCode.Seven, normal: '7', shifted: '&' },
            { key: KeyCode.Eight, normal: '8', shifted: '*' },
            { key: KeyCode.Nine, normal: '9', shifted: '(' },
            { key: KeyCode.Numpad0, normal: '0' },
            { key: KeyCode.Numpad1, normal: '1' },
            { key: KeyCode.Numpad2, normal: '2' },
            { key: KeyCode.Numpad3, normal: '3' },
            { key: KeyCode.Numpad4, normal: '4' },
            { key: KeyCode.Numpad5, normal: '5' },
            { key: KeyCode.Numpad6, normal: '6' },
            { key: KeyCode.Numpad7, normal: '7' },
            { key: KeyCode.Numpad8, normal: '8' },
            { key: KeyCode.Numpad9, normal: '9' },
            { key: KeyCode.Dash, normal: '-', shifted: '_' },
            { key: KeyCode.Equals, normal: '=', shifted: '+' },
            { key: KeyCode.OpenBracket, normal: '[', shifted: '{' },
            { key: KeyCode.ClosedBracket, normal: ']', shifted: '}' },
            { key: KeyCode.ForwardSlash, normal: '/', shifted: '?' },
            { key: KeyCode.SemiColon, normal: ';', shifted: ':' },
            { key: KeyCode.Quote, normal: "'", shifted: '"' },
            { key: KeyCode.Comma, normal: ',', shifted: '<' },
            { key: KeyCode.Period, normal: '.', shifted: '>' },
            { key: KeyCode.GraveAccent, normal: '`', shifted: '~' },
        ];

        let result = '';

        for (let keyCode = KeyCode.A; keyCode <= KeyCode.Z; keyCode++) {
            if (Input.GetKeyDown(keyCode)) {
                const letter = String.fromCharCode(keyCode);
                result += shiftPressed ? letter : letter.toLowerCase();
            }
        }

        for (const key of printableKeyMap) {
            if (Input.GetKeyDown(key.key)) {
                result += shiftPressed ? (key.shifted ?? key.normal) : key.normal;
            }
        }

        return result;
    }

    /**
     * Executes a drawing function in screen space, resetting the transformation matrix before and restoring it afterward.
     *
     * @static
     * @param {() => void} draw - The drawing function to be executed in screen space.
     * @memberof UIUtilities
     */
    public static DrawScreenSpace(draw: () => void): void {
        Renderer.Save();
        Renderer.ResetTransform();

        try {
            draw();
        } finally {
            Renderer.Restore();
        }
    }

    /**
     * Measures the size of a button based on its text, font, and padding.
     *
     * @static
     * @param {string} text - The text to be displayed on the button.
     * @param {string} font - The font to be used for measuring the text size.
     * @param {Vector2} padding - The padding to be applied around the text.
     * @returns {Vector2} The measured size of the button.
     * @memberof UIUtilities
     */
    public static MeasureButtonSize(text: string, font: string, padding: Vector2): Vector2 {
        Renderer.SetFont(font);

        const metrics = Renderer.MeasureText(text);
        const width = Math.max(96, metrics.width + padding.x * 2);
        const height = Math.max(36, this.MeasureLineHeight(font) + padding.y * 2);

        return new Vector2(width, height);
    }

    /**
     * Measures the line height of a given font.
     *
     * @static
     * @param {string} font - The font to be used for measuring the line height.
     * @returns {number} The measured line height of the font.
     * @memberof UIUtilities
     */
    public static MeasureLineHeight(font: string): number {
        const match = font.match(/(\d+(?:\.\d+)?)px/);

        if (!match) {
            return 16;
        }

        return Number(match[1]) * 1.2;
    }

    /**
     * Determines whether a given point is inside a rectangle defined by its position and size.
     *
     * @static
     * @param {Vector2} point - The point to be checked.
     * @param {Vector2} position - The position of the rectangle.
     * @param {Vector2} size - The size of the rectangle.
     * @returns {boolean} `true` if the point is inside the rectangle, `false` otherwise.
     * @memberof UIUtilities
     */
    public static IsPointInsideRect(point: Vector2, position: Vector2, size: Vector2): boolean {
        return (
            point.x >= position.x &&
            point.x <= position.x + size.x &&
            point.y >= position.y &&
            point.y <= position.y + size.y
        );
    }

    /**
     * Resolves the position of a UI element based on its anchor point and size.
     *
     * @static
     * @param {Vector2} position - The position of the UI element relative to its anchor point.
     * @param {UIAnchor} [anchor='top-left'] - The anchor point of the UI element.
     * @param {Vector2} [size=Vector2.zero] - The size of the UI element.
     * @returns {Vector2} The resolved position of the UI element.
     * @memberof UIUtilities
     */
    public static ResolvePosition(
        position: Vector2,
        anchor: UIAnchor = 'top-left',
        size: Vector2 = Vector2.zero,
    ): Vector2 {
        const origin = this.GetAnchorOrigin(anchor);

        return new Vector2(
            origin.x + position.x - size.x * this.GetHorizontalAnchorFactor(anchor),
            origin.y + position.y - size.y * this.GetVerticalAnchorFactor(anchor),
        );
    }

    /**
     * Retrieves the origin point for a given anchor type,
     * which is used to position UI elements relative to the viewport.
     *
     * @static
     * @param {UIAnchor} anchor - The anchor type for which to retrieve the origin point.
     * @returns {Vector2} The origin point corresponding to the specified anchor type.
     * @memberof UIUtilities
     */
    public static GetAnchorOrigin(anchor: UIAnchor): Vector2 {
        switch (anchor) {
            case 'top-center':
                return new Vector2(Renderer.ViewportCenter.x, 0);
            case 'top-right':
                return new Vector2(Renderer.ViewportSize.x, 0);
            case 'center-left':
                return new Vector2(0, Renderer.ViewportCenter.y);
            case 'center':
                return Renderer.ViewportCenter;
            case 'center-right':
                return new Vector2(Renderer.ViewportSize.x, Renderer.ViewportCenter.y);
            case 'bottom-left':
                return new Vector2(0, Renderer.ViewportSize.y);
            case 'bottom-center':
                return new Vector2(Renderer.ViewportCenter.x, Renderer.ViewportSize.y);
            case 'bottom-right':
                return new Vector2(Renderer.ViewportSize.x, Renderer.ViewportSize.y);
            case 'top-left':
            default:
                return Vector2.zero;
        }
    }

    /**
     * Retrieves the horizontal anchor factor for a given anchor type,
     * which is used to position UI elements relative to their anchor point.
     *
     * @static
     * @param {UIAnchor} anchor - The anchor type for which to retrieve the horizontal anchor factor.
     * @returns {number} The horizontal anchor factor corresponding to the specified anchor type.
     * @memberof UIUtilities
     */
    public static GetHorizontalAnchorFactor(anchor: UIAnchor): number {
        if (anchor.endsWith('right')) {
            return 1;
        }

        if (anchor.includes('center')) {
            return 0.5;
        }

        return 0;
    }

    /**
     * Retrieves the vertical anchor factor for a given anchor type,
     * which is used to position UI elements relative to their anchor point.
     *
     * @static
     * @param {UIAnchor} anchor - The anchor type for which to retrieve the vertical anchor factor.
     * @returns {number} The vertical anchor factor corresponding to the specified anchor type.
     * @memberof UIUtilities
     */
    public static GetVerticalAnchorFactor(anchor: UIAnchor): number {
        if (anchor.startsWith('bottom')) {
            return 1;
        }

        if (anchor.startsWith('center')) {
            return 0.5;
        }

        return 0;
    }
}