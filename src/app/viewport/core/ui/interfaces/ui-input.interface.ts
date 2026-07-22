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
    id?: string;
    position: Vector2;
    size: Vector2;
    value?: string;
    enabled?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    placeholder?: string;
    anchor?: UIAnchor;
    fillStyle?: FillStyle;
    hoverFillStyle?: FillStyle;
    focusedFillStyle?: FillStyle;
    strokeStyle?: StrokeStyle;
    focusedStrokeStyle?: StrokeStyle;
    textColor?: string;
    placeholderColor?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    radius?: number;
    padding?: Vector2;
    caretColor?: string;
    clearOnSubmit?: boolean;
    blurOnSubmit?: boolean;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    onCancel?: (value: string) => void;
}

/**
 * Interface defining the state of an input field in the `UI` system.
 *
 * @export
 * @interface UIInputState
 */
export interface UIInputState {
    value: string;
}
