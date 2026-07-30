import { LogLevel } from "./log-level";

/**
 * The styles associated with each log level for console output.
 *
 * @type {Record<LogLevel, string>}
 */
export const LEVEL_STYLES: Record<LogLevel, string> = {
    [LogLevel.Trace]:   'color: #999999; font-weight: bold;',
    [LogLevel.Debug]:   'color: #40BF59; font-weight: bold;',
    [LogLevel.Info]:    'color: #3399E6; font-weight: bold;',
    [LogLevel.Warn]:    'color: #F2A626; font-weight: bold;',
    [LogLevel.Error]:   'color: #D94040; font-weight: bold;',
    [LogLevel.Fatal]:   'color: #A62626; font-weight: bold;',
};