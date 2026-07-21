/**
 * An enumeration representing different log levels for logging messages.
 *
 * @export
 * @enum {number}
 */
export enum LogLevel {
    /**
     * The `TRACE` log level.
     */
    Trace = 'TRACE',

    /**
     * The `DEBUG` log level.
     */
    Debug = 'DEBUG',

    /**
     * The `INFO` log level.
     */
    Info = 'INFO',

    /**
     * The `WARN` log level.
     */
    Warn = 'WARN',

    /**
     * The `ERROR` log level.
     */
    Error = 'ERROR',

    /**
     * The `FATAL` log level.
     */
    Fatal = 'FATAL',
}
