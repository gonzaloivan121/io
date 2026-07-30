import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const ForgeTheme: UITheme = {
    backdropBackground: 'rgba(13, 17, 23, 0.54)',
    panelBackground: 'rgba(22, 27, 34, 0.97)',
    panelBorder: 'rgba(99, 110, 123, 0.38)',
    panelTitleColor: '#f0f6fc',
    panelTextColor: '#c9d1d9',
    buttonBackgroundColor: '#238636',
    buttonHoverBackgroundColor: '#2ea043',
    buttonPressedBackgroundColor: '#1a7f37',
    buttonDisabledBackgroundColor: '#30363d',
    buttonBorderColor: '#238636',
    buttonHoverBorderColor: '#2ea043',
    buttonPressedBorderColor: '#1a7f37',
    buttonDisabledBorderColor: '#21262d',
    buttonTextColor: '#f0f6fc',
    buttonDisabledTextColor: '#8b949e',
    accentColor: '#58a6ff',
    shadowColor: 'rgba(1, 4, 9, 0.42)',
    panelRadius: 12,
    buttonRadius: 8,
    borderWidth: 1,
    padding: new Vector2(16, 16),
    titleFont: '600 18px Segoe UI',
    bodyFont: '14px Segoe UI',
    buttonFont: '600 14px Segoe UI',
    shadowBlur: 16,
    shadowOffset: new Vector2(0, 6),
    textAlign: 'left',
    textBaseline: 'top',
};