import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const TerminalTheme: UITheme = {
    backdropBackground: 'rgba(5, 18, 10, 0.45)',
    panelBackground: 'rgba(10, 28, 18, 0.95)',
    panelBorder: 'rgba(74, 222, 128, 0.34)',
    panelTitleColor: '#dcfce7',
    panelTextColor: '#86efac',
    buttonBackgroundColor: '#166534',
    buttonHoverBackgroundColor: '#15803d',
    buttonPressedBackgroundColor: '#14532d',
    buttonDisabledBackgroundColor: '#365314',
    buttonBorderColor: '#15803d',
    buttonHoverBorderColor: '#16a34a',
    buttonPressedBorderColor: '#166534',
    buttonDisabledBorderColor: '#3f6212',
    buttonTextColor: '#f0fdf4',
    buttonDisabledTextColor: '#bbf7d0',
    accentColor: '#4ade80',
    shadowColor: 'rgba(0, 0, 0, 0.42)',
    panelRadius: 10,
    buttonRadius: 8,
    borderWidth: 2,
    padding: new Vector2(16, 16),
    titleFont: '700 18px Lucida Console',
    bodyFont: '14px Consolas',
    buttonFont: '700 14px Consolas',
    shadowBlur: 14,
    shadowOffset: new Vector2(0, 5),
    textAlign: 'left',
    textBaseline: 'top',
};