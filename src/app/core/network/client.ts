import { NetworkPayload } from './types/network-payload.type';
import { UUID } from '../uuid';

import { InvalidArgumentError } from '../../errors';

/**
 * Represents a network `Client` that can connect to a `Server`,
 * send and receive data, and track its connection state and statistics.
 *
 * @export
 * @class Client
 */
export class Client {
    /**
     * The unique identifier of the `Client`.
     *
     * @private
     * @type {UUID}
     * @memberof Client
     */
    private readonly id: UUID;

    /**
     * The endpoint (e.g., URL or address) to which the `Client` connects.
     *
     * @private
     * @type {string}
     * @memberof Client
     */
    private endpoint: string;

    /**
     * Indicates whether the `Client` is currently connected to a `Server`.
     *
     * @private
     * @type {boolean}
     * @memberof Client
     */
    private connected: boolean = false;

    /**
     * The total number of bytes sent by the `Client`.
     *
     * @private
     * @type {number}
     * @memberof Client
     */
    private sentBytes: number = 0;

    /**
     * The total number of bytes received by the `Client`.
     *
     * @private
     * @type {number}
     * @memberof Client
     */
    private receivedBytes: number = 0;

    /**
     * The timestamp of the last time data was sent by the `Client`.
     *
     * @private
     * @type {number}
     * @memberof Client
     */
    private lastSentAt: number = 0;

    /**
     * The timestamp of the last time data was received by the `Client`.
     *
     * @private
     * @type {number}
     * @memberof Client
     */
    private lastReceivedAt: number = 0;

    /**
     * Creates an instance of `Client`.
     *
     * @param {UUID} id - The unique identifier for the `Client`.
     * @param {string} endpoint - The endpoint (e.g., URL or address) to which the `Client` will connect.
     * @throws {InvalidArgumentError} If the `id` or `endpoint` is not provided or is invalid.
     * @memberof Client
     */
    constructor(id: UUID, endpoint: string) {
        if (!id || id.trim() === '' || typeof id !== 'string') {
            throw new InvalidArgumentError(
                'Client id must be provided and must be a valid UUID string.',
            );
        }

        if (!endpoint || endpoint.trim() === '' || typeof endpoint !== 'string') {
            throw new InvalidArgumentError(
                'Client endpoint must be provided and must be a string.',
            );
        }

        this.id = id;
        this.endpoint = endpoint;
    }

    /**
     * Gets the unique identifier of the `Client`.
     *
     * @readonly
     * @type {UUID}
     * @memberof Client
     */
    public get ID(): UUID {
        return this.id;
    }

    /**
     * Gets the endpoint (e.g., URL or address) to which the `Client` connects.
     *
     * @readonly
     * @type {string}
     * @memberof Client
     */
    public get Endpoint(): string {
        return this.endpoint;
    }

    /**
     * Gets a value indicating whether the `Client` is currently connected to a `Server`.
     *
     * @readonly
     * @type {boolean}
     * @memberof Client
     */
    public get Connected(): boolean {
        return this.connected;
    }

    /**
     * Gets the total number of bytes sent by the `Client`.
     *
     * @readonly
     * @type {number}
     * @memberof Client
     */
    public get SentBytes(): number {
        return this.sentBytes;
    }

    /**
     * Gets the total number of bytes received by the `Client`.
     *
     * @readonly
     * @type {number}
     * @memberof Client
     */
    public get ReceivedBytes(): number {
        return this.receivedBytes;
    }

    /**
     * Gets the timestamp of the last time data was sent by the `Client`.
     *
     * @readonly
     * @type {number}
     * @memberof Client
     */
    public get LastSentAt(): number {
        return this.lastSentAt;
    }

    /**
     * Gets the timestamp of the last time data was received by the `Client`.
     *
     * @readonly
     * @type {number}
     * @memberof Client
     */
    public get LastReceivedAt(): number {
        return this.lastReceivedAt;
    }

    /**
     * Configures the `Client` with a new endpoint (e.g., URL or address) to which it will connect.
     *
     * @param {string} endpoint - The new endpoint to which the `Client` will connect.
     * @throws {InvalidArgumentError} If the `endpoint` is not provided or is invalid.
     * @memberof Client
     */
    public Configure(endpoint: string): void {
        if (!endpoint || endpoint.trim() === '' || typeof endpoint !== 'string') {
            throw new InvalidArgumentError(
                'Client endpoint must be provided and must be a string.',
            );
        }

        this.endpoint = endpoint;
    }

    /**
     * Connects the `Client` to the configured endpoint.
     *
     * @memberof Client
     */
    public Connect(): void {
        this.connected = true;
    }

    /**
     * Disconnects the `Client` from the connected endpoint.
     *
     * @memberof Client
     */
    public Disconnect(): void {
        this.connected = false;
    }

    /**
     * Sends data to the connected endpoint and updates the sent bytes count.
     *
     * @param {NetworkPayload} payload - The data to be sent, which can be a string, ArrayBufferView, or ArrayBuffer.
     * @returns {number} The number of bytes sent.
     * @memberof Client
     */
    public Send(payload: NetworkPayload): number {
        const bytes = this.MeasureBytes(payload);
        this.sentBytes += bytes;
        this.lastSentAt = performance.now();

        return bytes;
    }

    /**
     * Receives data from the connected endpoint and updates the received bytes count.
     *
     * @param {NetworkPayload} payload - The data received, which can be a string, ArrayBufferView, or ArrayBuffer.
     * @returns {number} The number of bytes received.
     * @memberof Client
     */
    public Receive(payload: NetworkPayload): number {
        const bytes = this.MeasureBytes(payload);
        this.receivedBytes += bytes;
        this.lastReceivedAt = performance.now();

        return bytes;
    }

    /**
     * Measures the number of bytes in the provided `payload`.
     *
     * @private
     * @param {NetworkPayload} payload - The data whose byte size is to be measured.
     * @returns {number} The number of bytes in the `payload`.
     * @memberof Client
     */
    private MeasureBytes(payload: NetworkPayload): number {
        if (typeof payload === 'string') {
            return new TextEncoder().encode(payload).byteLength;
        }

        if (payload instanceof ArrayBuffer) {
            return payload.byteLength;
        }

        return payload.byteLength;
    }
}