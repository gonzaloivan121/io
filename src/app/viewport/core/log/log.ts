import { InvalidArgumentError } from '../../../errors';
import { Color } from '../color';
import { LogLevel } from './log-level';

/**
 * A logging utility class that provides methods for logging messages at different log levels.
 *
 * @export
 * @class Log
 */
export class Log {
    /**
     * The current log level for the logging system.
     *
     * @private
     * @static
     * @type {LogLevel}
     * @memberof Log
     */
    private static currentLevel: LogLevel = LogLevel.Trace;

    /**
     * The styles associated with each log level for console output.
     *
     * @private
     * @static
     * @type {Record<LogLevel, string>}
     * @memberof Log
     */
    private static readonly LEVEL_STYLES: Record<LogLevel, string> = {
        [LogLevel.Trace]: `color: ${Color.Trace.String}; font-weight: normal;`,
        [LogLevel.Debug]: `color: ${Color.Debug.String}; font-weight: normal;`,
        [LogLevel.Info]: `color: ${Color.Info.String}; font-weight: normal;`,
        [LogLevel.Warn]: `color: ${Color.Warn.String}; font-weight: bold;`,
        [LogLevel.Error]: `color: ${Color.Error.String}; font-weight: bold;`,
        [LogLevel.Fatal]: `color: ${Color.Fatal.String}; font-weight: bold;`,
    };

    /**
     * Initializes the logging system.
     *
     * @static
     * @memberof Log
     */
    public static Initialize(): void {
        // Initialize the logging system, if needed.
    }

    /**
     * Sets the current log level for the logging system.
     *
     * @static
     * @param {LogLevel} level - The log level to set for the logging system.
     * @throws {InvalidArgumentError} If the provided log level is not a valid LogLevel.
     * @memberof Log
     */
    public static SetLogLevel(level: LogLevel): void {
        this.EnsureLevel(level);
        this.currentLevel = level;
    }

    /**
     * Logs a message at the `TRACE` level.
     *
     * @static
     * @param {string} message - The message to log at the `TRACE` level.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    public static Trace(message: string): void {
        this.EnsureMessage(message);
        this.Log(LogLevel.Trace, message);
    }

    /**
     * Logs a message at the `DEBUG` level.
     *
     * @static
     * @param {string} message - The message to log at the `DEBUG` level.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    public static Debug(message: string): void {
        this.EnsureMessage(message);
        this.Log(LogLevel.Debug, message);
    }

    /**
     * Logs a message at the `INFO` level.
     *
     * @static
     * @param {string} message - The message to log at the `INFO` level.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    public static Info(message: string): void {
        this.EnsureMessage(message);
        this.Log(LogLevel.Info, message);
    }

    /**
     * Logs a message at the `WARN` level.
     *
     * @static
     * @param {string} message - The message to log at the `WARN` level.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    public static Warn(message: string): void {
        this.EnsureMessage(message);
        this.Log(LogLevel.Warn, message);
    }

    /**
     * Logs a message at the `ERROR` level.
     *
     * @static
     * @param {string} message - The message to log at the `ERROR` level.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    public static Error(message: string): void {
        this.EnsureMessage(message);
        this.Log(LogLevel.Error, message);
    }

    /**
     * Logs a message at the `FATAL` level.
     *
     * @static
     * @param {string} message - The message to log at the `FATAL` level.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    public static Fatal(message: string): void {
        this.EnsureMessage(message);
        this.Log(LogLevel.Fatal, message);
    }

    /**
     * Logs a message at the specified log level.
     *
     * @private
     * @static
     * @param {LogLevel} level - The log level at which to log the message.
     * @param {string} message - The message to log.
     * @throws {InvalidArgumentError} If the log level is not a valid LogLevel.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    private static Log(level: LogLevel, message: string): void {
        this.EnsureLevel(level);
        this.EnsureMessage(message);

        const timestamp: string = new Date().toISOString();
        if (this.ShouldLog(level)) {
            console.log(`%c[${timestamp}] [${level}]%c ${message}`, this.GetLevelStyles(level), '');
        }
    }

    /**
     * Ensures that the provided log level is valid.
     *
     * @private
     * @static
     * @param {LogLevel} level - The log level to validate.
     * @throws {InvalidArgumentError} If the log level is not a valid LogLevel.
     * @memberof Log
     */
    private static EnsureLevel(level: LogLevel): void {
        if (!Object.values(LogLevel).includes(level)) {
            throw new InvalidArgumentError(
                `Invalid LogLevel: ${level}. Must be one of: ${Object.values(LogLevel).join(', ')}`,
            );
        }
    }

    /**
     * Ensures that the provided message is valid (non-empty string).
     *
     * @private
     * @static
     * @param {string} message - The message to validate.
     * @throws {InvalidArgumentError} If the message is not provided or is not a string.
     * @memberof Log
     */
    private static EnsureMessage(message: string): void {
        if (!message || typeof message !== 'string') {
            throw new InvalidArgumentError('Message must be provided and must be a string.');
        }
    }

    /**
     * Determines whether a message at the specified log level should be logged based on the current log level.
     *
     * @private
     * @static
     * @param {LogLevel} level - The log level of the message to check.
     * @returns {boolean} `true` if the message should be logged, `false` otherwise.
     * @throws {InvalidArgumentError} If the log level is not a valid `LogLevel`.
     * @memberof Log
     */
    private static ShouldLog(level: LogLevel): boolean {
        this.EnsureLevel(level);
        return Object.values(LogLevel).indexOf(level) >= Object.values(LogLevel).indexOf(this.currentLevel);
    }

    /**
     * Retrieves the CSS styles associated with the specified log level for console output.
     *
     * @private
     * @static
     * @param {LogLevel} level - The log level for which to retrieve the styles.
     * @returns {string} The CSS styles associated with the specified log level.
     * @throws {InvalidArgumentError} If the log level is not a valid `LogLevel`.
     * @memberof Log
     */
    private static GetLevelStyles(level: LogLevel): string {
        this.EnsureLevel(level);
        return this.LEVEL_STYLES[level];
    }
}

export { LogLevel };