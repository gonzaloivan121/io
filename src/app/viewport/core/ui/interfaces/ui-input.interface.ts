import { Vector2 } from "@xloxlolex/vector-math";
import { UIAnchor } from "../types/ui-anchor.type";
import { FillStyle, StrokeStyle } from "../../renderer";

/**
 * Interface defining the options for rendering an input field in the `UI` system.
 *
 * @export
 * @interface UIInput
 */
export interface UIInput {
    /**
     * The unique identifier for the input field, used to reference it in the `UI` system.
     *
     * @type {string}
     * @memberof UIInput
     */
    id?: string;

    /**
     * The position of the input field in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIInput
     */
    position: Vector2;

    /**
     * The size of the input field in the UI coordinate system.
     *
     * @type {Vector2}
     * @memberof UIInput
     */
    size: Vector2;

    /**
     * The current value of the input field, which can be modified by user input or programmatically.
     *
     * @type {string}
     * @memberof UIInput
     */
    value?: string;

    /**
     * Indicates whether the input field is enabled or disabled.
     * A disabled input field will not respond to user interactions.
     *
     * @type {boolean}
     * @memberof UIInput
     */
    enabled?: boolean;

    /**
     * Indicates whether the input field is read-only.
     * A read-only input field will not allow user modifications but can still be focused and selected.
     *
     * @type {boolean}
     * @memberof UIInput
     */
    readOnly?: boolean;

    /**
     * The maximum length of the input field's value.
     * If specified, the input field will not accept more characters than this limit.
     *
     * @type {number}
     * @memberof UIInput
     */
    maxLength?: number;

    /**
     * The placeholder text displayed in the input field when it is empty.
     *
     * @type {string}
     * @memberof UIInput
     */
    placeholder?: string;

    /**
     * The anchor point of the input field, which determines how the input field is positioned relative to its position.
     *
     * @type {UIAnchor}
     * @memberof UIInput
     */
    anchor?: UIAnchor;

    /**
     * The fill style of the input field, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIInput
     */
    fillStyle?: FillStyle;

    /**
     * The fill style of the input field when the mouse is hovering over it, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIInput
     */
    hoverFillStyle?: FillStyle;

    /**
     * The fill style of the input field when it is focused, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIInput
     */
    focusedFillStyle?: FillStyle;

    /**
     * The stroke style of the input field, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UIInput
     */
    strokeStyle?: StrokeStyle;

    /**
     * The stroke style of the input field when it is focused, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {StrokeStyle}
     * @memberof UIInput
     */
    focusedStrokeStyle?: StrokeStyle;

    /**
     * The text color of the input field, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIInput
     */
    textColor?: FillStyle;

    /**
     * The text color of the placeholder text in the input field, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIInput
     */
    placeholderColor?: FillStyle;

    /**
     * The font used for the text in the input field, specified as a CSS font string.
     *
     * @type {string}
     * @memberof UIInput
     */
    font?: string;

    /**
     * The text alignment of the input field's text, which can be 'left', 'right', 'center', 'start', or 'end'.
     *
     * @type {CanvasTextAlign}
     * @memberof UIInput
     */
    textAlign?: CanvasTextAlign;

    /**
     * The text baseline of the input field's text, which can be 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom'.
     *
     * @type {CanvasTextBaseline}
     * @memberof UIInput
     */
    textBaseline?: CanvasTextBaseline;

    /**
     * The corner radius of the input field, which determines how rounded the corners are.
     *
     * @type {number}
     * @memberof UIInput
     */
    radius?: number;

    /**
     * The padding inside the input field, which determines the space between the text and the edges of the input field.
     *
     * @type {Vector2}
     * @memberof UIInput
     */
    padding?: Vector2;

    /**
     * The color of the caret (text cursor) in the input field, which can be a color string, a CanvasGradient, or a CanvasPattern.
     *
     * @type {FillStyle}
     * @memberof UIInput
     */
    caretColor?: FillStyle;

    /**
     * Indicates whether the input field should clear its value when the user submits it.
     *
     * @type {boolean}
     * @memberof UIInput
     */
    clearOnSubmit?: boolean;

    /**
     * Indicates whether the input field should lose focus when the user submits it.
     *
     * @type {boolean}
     * @memberof UIInput
     */
    blurOnSubmit?: boolean;

    /**
     * Callback function that is called when the value of the input field changes.
     *
     * @memberof UIInput
     */
    onChange?: (value: string) => void;

    /**
     * Callback function that is called when the user submits the input field (e.g., by pressing Enter).
     *
     * @memberof UIInput
     */
    onSubmit?: (value: string) => void;

    /**
     * Callback function that is called when the user cancels the input field (e.g., by pressing Escape).
     *
     * @memberof UIInput
     */
    onCancel?: (value: string) => void;
}

/**
 * Interface defining the state of an input field in the `UI` system.
 *
 * @export
 * @interface UIInputState
 */
export interface UIInputState {
    /**
     * The value of the input field, which can be modified by user input or programmatically.
     *
     * @type {string}
     * @memberof UIInputState
     */
    value: string;
}
