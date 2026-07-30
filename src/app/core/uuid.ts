/**
 * A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems.
 * This type definition represents a UUID as a string in the standard format, which consists of five groups of hexadecimal digits separated by hyphens.
 *
 * The format of a UUID is as follows:
 * ```
 * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * ```
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
