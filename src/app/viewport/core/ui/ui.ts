import { Vector2 } from '@xloxlolex/vector-math';
import { Input, KeyCode, MouseButton } from '../input/input';
import { Renderer } from '../renderer';

import { UITheme } from './interfaces/ui-theme.interface';
import { UIInput } from './interfaces/ui-input.interface';
import { UIBackdrop } from './interfaces/ui-backdrop.interface';
import { UILabel } from './interfaces/ui-label.interface';
import { UIButton } from './interfaces/ui-button.interface';
import { UIPanel } from './interfaces/ui-panel.interface';
import { UIUtilities } from './ui-utilities';

/**
 * Class representing the User Interface (UI) system.
 * 
 * @export
 * @class UI
 */
export class UI {
    /**
     * The default UI theme.
     *
     * @private
     * @static
     * @type {UITheme}
     * @memberof UI
     */
    private static readonly defaultTheme: UITheme = {
        backdropBackground: 'rgba(15, 23, 42, 0.5)',
        panelBackground: 'rgba(15, 23, 42, 0.9)',
        panelBorder: 'rgba(148, 163, 184, 0.35)',
        panelTitleColor: '#f8fafc',
        panelTextColor: '#cbd5e1',
        buttonBackground: '#2563eb',
        buttonHoverBackground: '#3b82f6',
        buttonPressedBackground: '#1d4ed8',
        buttonDisabledBackground: '#475569',
        buttonTextColor: '#eff6ff',
        buttonDisabledTextColor: '#cbd5e1',
        accentColor: '#7dd3fc',
        shadowColor: 'rgba(15, 23, 42, 0.45)',
        panelRadius: 16,
        buttonRadius: 12,
        borderWidth: 2,
        padding: new Vector2(16, 16),
        titleFont: '600 18px monospace',
        bodyFont: '14px monospace',
        buttonFont: '600 14px monospace',
        shadowBlur: 16,
        textAlign: 'left',
        textBaseline: 'top',
    };

    /**
     * The current UI theme.
     *
     * @private
     * @static
     * @type {UITheme}
     * @memberof UI
     */
    private static theme: UITheme = { ...UI.defaultTheme };

    /**
     * The ID of the currently active input field.
     *
     * @private
     * @static
     * @type {(string | null)}
     * @memberof UI
     */
    private static activeInputId: string | null = null;

    /**
     * Initializes the UI system with an optional custom theme.
     *
     * @static
     * @param {Partial<UITheme>} [theme] - An optional partial theme to customize the UI appearance.
     * @memberof UI
     */
    public static Initialize(theme?: Partial<UITheme>): void {
        this.theme = {
            ...this.defaultTheme,
            ...theme,
        };
    }

    /**
     * Sets the current UI theme.
     *
     * @static
     * @param {Partial<UITheme>} theme - The partial theme to set.
     * @memberof UI
     */
    public static SetTheme(theme: Partial<UITheme>): void {
        this.theme = {
            ...this.theme,
            ...theme,
        };
    }

    /**
     * Gets the current UI theme.
     *
     * @static
     * @returns {Readonly<UITheme>} The current UI theme.
     * @memberof UI
     */
    public static GetTheme(): Readonly<UITheme> {
        return this.theme;
    }

    /**
     * Renders a backdrop on the screen with the specified options.
     *
     * @static
     * @param {UIBackdrop} [options] - An optional object containing the backdrop rendering options.
     * @memberof UI
     */
    public static Backdrop(options?: UIBackdrop): void {
        UIUtilities.DrawScreenSpace(() => {
            Renderer.FillRect(
                options?.position ?? Vector2.zero,
                options?.size ?? Renderer.ViewportSize,
                options?.fillStyle ?? this.theme.backdropBackground,
            );
        });
    }

    /**
     * Renders a label on the screen with the specified text and options.
     *
     * @static
     * @param {string} text - The text to be displayed in the label.
     * @param {UILabel} options - An object containing the label rendering options.
     * @memberof UI
     */
    public static Label(text: string, options: UILabel): void {
        UIUtilities.DrawScreenSpace(() => {
            Renderer.DrawText(text, UIUtilities.ResolvePosition(options.position, options.anchor), {
                fillStyle: options.color ?? this.theme.panelTextColor,
                font: options.font ?? this.theme.bodyFont,
                textAlign: options.textAlign ?? this.theme.textAlign,
                textBaseline: options.textBaseline ?? this.theme.textBaseline,
            });
        });
    }

    /**
     * Renders a button on the screen with the specified text, click handler, and options.
     *
     * @static
     * @param {string} text - The text to be displayed on the button.
     * @param {() => void} onClick - The function to be called when the button is clicked.
     * @param {UIButton} options - An object containing the button rendering options.
     * @returns {boolean} `true` if the button was clicked, `false` otherwise.
     * @memberof UI
     */
    public static Button(text: string, onClick: () => void, options: UIButton): boolean {
        const enabled = options.enabled ?? true;
        const font = options.font ?? this.theme.buttonFont;
        const padding = options.padding ?? this.theme.padding;
        const size = options.size ?? UIUtilities.MeasureButtonSize(text, font, padding);
        const position = UIUtilities.ResolvePosition(options.position, options.anchor, size);
        const hovered =
            enabled && UIUtilities.IsPointInsideRect(Input.MousePosition, position, size);
        const pressed = hovered && Input.GetMouseButton(MouseButton.Left);
        const clicked = hovered && enabled && Input.GetMouseButtonDown(MouseButton.Left);

        const fillStyle = !enabled
            ? this.theme.buttonDisabledBackground
            : pressed
              ? (options.pressedFillStyle ?? this.theme.buttonPressedBackground)
              : hovered
                ? (options.hoverFillStyle ?? this.theme.buttonHoverBackground)
                : (options.fillStyle ?? this.theme.buttonBackground);

        UIUtilities.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, 0, 6);
            Renderer.DrawRoundedRect(
                position,
                size,
                options.radius ?? this.theme.buttonRadius,
                fillStyle,
                options.strokeStyle ?? this.theme.accentColor,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            Renderer.DrawText(
                text,
                new Vector2(position.x + size.x * 0.5, position.y + size.y * 0.5),
                {
                    fillStyle: enabled
                        ? (options.textColor ?? this.theme.buttonTextColor)
                        : this.theme.buttonDisabledTextColor,
                    font,
                    textAlign: options.textAlign ?? 'center',
                    textBaseline: 'middle',
                },
            );
        });

        if (clicked) {
            onClick();
        }

        return clicked;
    }

    /**
     * Renders a panel on the screen with the specified title, content, and options.
     *
     * @static
     * @param {string} title - The title of the panel.
     * @param {string} content - The content of the panel.
     * @param {UIPanel} options - An object containing the panel rendering options.
     * @memberof UI
     */
    public static Panel(title: string, content: string, options: UIPanel): void {
        const padding = options.padding ?? this.theme.padding;
        const radius = options.radius ?? this.theme.panelRadius;
        const lineGap = options.lineGap ?? 6;
        const position = UIUtilities.ResolvePosition(
            options.position,
            options.anchor,
            options.size,
        );

        UIUtilities.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, 0, 8);
            Renderer.DrawRoundedRect(
                position,
                options.size,
                radius,
                options.fillStyle ?? this.theme.panelBackground,
                options.strokeStyle ?? this.theme.panelBorder,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            const titleAlign = options.titleAlign ?? 'left';
            const titleX =
                titleAlign === 'center'
                    ? position.x + options.size.x * 0.5
                    : titleAlign === 'right' || titleAlign === 'end'
                      ? position.x + options.size.x - padding.x
                      : position.x + padding.x;
            const titlePosition = new Vector2(titleX, position.y + padding.y);
            Renderer.DrawText(title, titlePosition, {
                fillStyle: options.titleColor ?? this.theme.panelTitleColor,
                font: options.titleFont ?? this.theme.titleFont,
                textAlign: titleAlign,
                textBaseline: 'top',
            });

            const separatorY =
                position.y +
                padding.y +
                UIUtilities.MeasureLineHeight(options.titleFont ?? this.theme.titleFont) +
                8;
            Renderer.DrawLine(
                new Vector2(position.x + padding.x, separatorY),
                new Vector2(position.x + options.size.x - padding.x, separatorY),
                this.theme.accentColor,
                1,
            );

            let cursorY = separatorY + 10;

            for (const line of content.split('\n')) {
                Renderer.DrawText(line, new Vector2(position.x + padding.x, cursorY), {
                    fillStyle: options.textColor ?? this.theme.panelTextColor,
                    font: options.contentFont ?? this.theme.bodyFont,
                    textAlign: 'left',
                    textBaseline: 'top',
                });

                cursorY +=
                    UIUtilities.MeasureLineHeight(options.contentFont ?? this.theme.bodyFont) +
                    lineGap;
            }
        });
    }

    /**
     * Renders an input field on the screen with the specified options and returns the current value of the input.
     *
     * @static
     * @param {UIInput} options - An object containing the input field rendering options.
     * @returns {string} The current value of the input field.
     * @memberof UI
     */
    public static Input(options: UIInput): string {
        const enabled = options.enabled ?? true;
        const readOnly = options.readOnly ?? false;
        const padding = options.padding ?? this.theme.padding;
        const radius = options.radius ?? this.theme.buttonRadius;
        const font = options.font ?? this.theme.bodyFont;
        const textAlign = options.textAlign ?? 'left';
        const id = options.id ?? UIUtilities.BuildInputId(options);
        const position = UIUtilities.ResolvePosition(
            options.position,
            options.anchor,
            options.size,
        );
        const hovered =
            enabled && UIUtilities.IsPointInsideRect(Input.MousePosition, position, options.size);
        const leftMouseDown = Input.GetMouseButtonDown(MouseButton.Left);

        if (leftMouseDown) {
            if (hovered && enabled) {
                this.activeInputId = id;
            } else if (this.activeInputId === id) {
                this.activeInputId = null;
            }
        }

        const focused = enabled && this.activeInputId === id;
        const state = UIUtilities.GetOrCreateInputState(id, options.value ?? '');

        if (!focused && options.value !== undefined && state.value !== options.value) {
            state.value = options.value;
        }

        if (focused && !readOnly) {
            const previousValue = state.value;

            if (Input.GetKeyDown(KeyCode.Backspace) && state.value.length > 0) {
                state.value = state.value.slice(0, -1);
            }

            if (Input.GetKeyDown(KeyCode.Delete)) {
                state.value = '';
            }

            if (Input.GetKeyDown(KeyCode.Escape)) {
                this.activeInputId = null;
                options.onCancel?.(state.value);
            }

            if (Input.GetKeyDown(KeyCode.Enter)) {
                options.onSubmit?.(state.value);

                if (options.clearOnSubmit) {
                    state.value = '';
                }

                if (options.blurOnSubmit ?? true) {
                    this.activeInputId = null;
                }
            }

            const maxLength = options.maxLength;
            const typedCharacters = UIUtilities.GetTypedCharacters();

            if (typedCharacters.length > 0) {
                const allowedText =
                    maxLength === undefined
                        ? typedCharacters
                        : typedCharacters.slice(0, Math.max(0, maxLength - state.value.length));

                state.value += allowedText;
            }

            if (previousValue !== state.value) {
                options.onChange?.(state.value);
            }
        }

        const hasValue = state.value.length > 0;
        const displayValue = hasValue ? state.value : (options.placeholder ?? '');
        const displayColor = hasValue
            ? (options.textColor ?? this.theme.buttonTextColor)
            : (options.placeholderColor ?? 'rgba(203, 213, 225, 0.7)');
        const drawText = UIUtilities.FitInputTextToWidth(
            displayValue,
            font,
            options.size.x - padding.x * 2,
            hasValue,
        );

        const fillStyle = focused
            ? (options.focusedFillStyle ?? options.fillStyle ?? 'rgba(15, 23, 42, 0.95)')
            : hovered
              ? (options.hoverFillStyle ?? options.fillStyle ?? 'rgba(15, 23, 42, 0.9)')
              : (options.fillStyle ?? 'rgba(15, 23, 42, 0.8)');
        const strokeStyle = focused
            ? (options.focusedStrokeStyle ?? this.theme.accentColor)
            : (options.strokeStyle ?? this.theme.panelBorder);

        UIUtilities.DrawScreenSpace(() => {
            Renderer.SetShadow(this.theme.shadowColor, this.theme.shadowBlur, 0, 4);
            Renderer.DrawRoundedRect(
                position,
                options.size,
                radius,
                fillStyle,
                strokeStyle,
                this.theme.borderWidth,
            );
            Renderer.ClearShadow();

            const textX =
                textAlign === 'center'
                    ? position.x + options.size.x * 0.5
                    : textAlign === 'right' || textAlign === 'end'
                      ? position.x + options.size.x - padding.x
                      : position.x + padding.x;

            Renderer.DrawText(drawText, new Vector2(textX, position.y + options.size.y * 0.5), {
                fillStyle: displayColor,
                font,
                textAlign,
                textBaseline: 'middle',
            });

            if (focused && UIUtilities.ShouldDrawCaret()) {
                Renderer.SetFont(font);
                const textWidth = Renderer.MeasureText(drawText).width;
                let caretX = textX;

                if (textAlign === 'center') {
                    caretX += textWidth * 0.5 + 2;
                } else if (textAlign !== 'right' && textAlign !== 'end') {
                    caretX += textWidth + 2;
                }

                caretX = Math.min(
                    position.x + options.size.x - padding.x,
                    Math.max(position.x + padding.x, caretX),
                );

                Renderer.DrawLine(
                    new Vector2(caretX, position.y + padding.y * 0.5),
                    new Vector2(caretX, position.y + options.size.y - padding.y * 0.5),
                    options.caretColor ?? this.theme.accentColor,
                    1.5,
                );
            }
        });

        return state.value;
    }
}