import { Vector2 } from "@xloxlolex/vector-math";

import { UITheme } from "../interfaces/ui-theme.interface";

export const OxideTheme: UITheme = {
    backdropBackground: 'rgba(12, 14, 18, 0.54)',
    panelBackground: 'rgba(23, 23, 23, 0.96)',
    panelBorder: 'rgba(96, 165, 250, 0.34)',
    panelTitleColor: '#f3f4f6',
    panelTextColor: '#d1d5db',
    buttonBackgroundColor: '#202327',
    buttonHoverBackgroundColor: '#2a2f35',
    buttonPressedBackgroundColor: '#16181b',
    buttonDisabledBackgroundColor: '#111214',
    buttonBorderColor: '#2a2f35',
    buttonHoverBorderColor: '#374151',
    buttonPressedBorderColor: '#202327',
    buttonDisabledBorderColor: '#1f2937',
    buttonTextColor: '#f9fafb',
    buttonDisabledTextColor: '#6b7280',
    accentColor: '#f97316',
    shadowColor: 'rgba(0, 0, 0, 0.32)',
    panelRadius: 2,
    buttonRadius: 2,
    borderWidth: 1,
    padding: new Vector2(16, 16),
    titleFont: '600 18px Segoe UI',
    bodyFont: '14px Segoe UI',
    buttonFont: '600 14px Segoe UI',
    shadowBlur: 10,
    shadowOffset: new Vector2(0, 3),
    textAlign: 'left',
    textBaseline: 'top',
};