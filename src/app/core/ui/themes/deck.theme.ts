import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const DeckTheme: UITheme = {
    backdropBackground: 'rgba(8, 15, 22, 0.58)',
    panelBackground: 'rgba(18, 30, 45, 0.96)',
    panelBorder: 'rgba(56, 189, 248, 0.34)',
    panelTitleColor: '#f8fafc',
    panelTextColor: '#dbeafe',
    buttonBackgroundColor: '#0f766e',
    buttonHoverBackgroundColor: '#0d9488',
    buttonPressedBackgroundColor: '#115e59',
    buttonDisabledBackgroundColor: '#334155',
    buttonBorderColor: '#0f766e',
    buttonHoverBorderColor: '#0d9488',
    buttonPressedBorderColor: '#115e59',
    buttonDisabledBorderColor: '#1e293b',
    buttonTextColor: '#ecfeff',
    buttonDisabledTextColor: '#94a3b8',
    accentColor: '#22d3ee',
    shadowColor: 'rgba(2, 8, 23, 0.46)',
    panelRadius: 18,
    buttonRadius: 14,
    borderWidth: 2,
    padding: new Vector2(18, 18),
    titleFont: '700 18px Tahoma',
    bodyFont: '14px Tahoma',
    buttonFont: '700 14px Tahoma',
    shadowBlur: 22,
    shadowOffset: new Vector2(0, 9),
    textAlign: 'left',
    textBaseline: 'top',
};