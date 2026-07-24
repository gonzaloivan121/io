import { InvalidArgumentError } from '../../../errors';
import { UUID } from '../uuid';
import { NetworkPayload } from './types/network-payload.type';

/**
 * Represents a network `Server` that can accept connections from `Client` instances,
 * manage connected sessions, and handle data transmission.
 *
 * @export
 * @class Server
 */
export class Server {
    /**
     * The unique identifier of the `Server`.
     *
     * @private
     * @type {UUID}
     * @memberof Server
     */
    private readonly id: UUID;

    /**
     * A set of connected session identifiers, representing the clients currently connected to the `Server`.
     *
     * @private
     * @type {Set<UUID>}
     * @memberof Server
     */
    private readonly sessions: Set<UUID> = new Set<UUID>();

    /**
     * Indicates whether the `Server` is currently running and accepting connections.
     *
     * @private
     * @type {boolean}
     * @memberof Server
     */
    private running: boolean = false;

    /**
     * The total number of bytes sent by the `Server`.
     *
     * @private
     * @type {number}
     * @memberof Server
     */
    private sentBytes: number = 0;

    /**
     * The total number of bytes received by the `Server`.
     *
     * @private
     * @type {number}
     * @memberof Server
     */
    private receivedBytes: number = 0;

    /**
     * The timestamp of when the `Server` was started, in milliseconds since the UNIX epoch.
     *
     * @private
     * @type {number}
     * @memberof Server
     */
    private startedAt: number = 0;

    /**
     * Creates an instance of `Server`.
     *
     * @param {UUID} id - The unique identifier for the `Server`.
     * @throws {InvalidArgumentError} If the `id` is not provided or is invalid.
     * @memberof Server
     */
    constructor(id: UUID) {
        if (!id || id.trim() === '' || typeof id !== 'string') {
            throw new InvalidArgumentError(
                'Server id must be provided and must be a valid UUID string.',
            );
        }

        this.id = id;
    }

    /**
     * Gets the unique identifier of the `Server`.
     *
     * @readonly
     * @type {UUID}
     * @memberof Server
     */
    public get ID(): UUID {
        return this.id;
    }

    /**
     * Gets a value indicating whether the `Server` is currently running and accepting connections.
     *
     * @readonly
     * @type {boolean}
     * @memberof Server
     */
    public get Running(): boolean {
        return this.running;
    }

    /**
     * Gets the number of currently connected sessions to the `Server`.
     *
     * @readonly
     * @type {number}
     * @memberof Server
     */
    public get ConnectedSessions(): number {
        return this.sessions.size;
    }

    /**
     * Gets the total number of bytes sent by the `Server`.
     *
     * @readonly
     * @type {number}
     * @memberof Server
     */
    public get SentBytes(): number {
        return this.sentBytes;
    }

    /**
     * Gets the total number of bytes received by the `Server`.
     *
     * @readonly
     * @type {number}
     * @memberof Server
     */
    public get ReceivedBytes(): number {
        return this.receivedBytes;
    }

    /**
     * Gets the timestamp of when the `Server` was started, in milliseconds since the UNIX epoch.
     *
     * @readonly
     * @type {number}
     * @memberof Server
     */
    public get StartedAt(): number {
        return this.startedAt;
    }

    /**
     * Starts the `Server`, allowing it to accept connections and handle data transmission.
     *
     * @memberof Server
     */
    public Start(): void {
        this.running = true;
        this.startedAt = performance.now();
    }

    /**
     * Stops the `Server`, preventing it from accepting new connections and clearing all connected sessions.
     *
     * @memberof Server
     */
    public Stop(): void {
        this.running = false;
        this.sessions.clear();
    }

    /**
     * Connects a session to the `Server`, allowing it to send and receive data.
     *
     * @param {UUID} sessionId - The unique identifier of the session to connect.
     * @throws {InvalidArgumentError} If the `sessionId` is not provided or is invalid.
     * @memberof Server
     */
    public ConnectSession(sessionId: UUID): void {
        if (!sessionId || sessionId.trim() === '' || typeof sessionId !== 'string') {
            throw new InvalidArgumentError(
                'Session id must be provided and must be a valid UUID string.',
            );
        }

        this.sessions.add(sessionId);
    }

    /**
     * Disconnects a session from the `Server`, preventing it from sending or receiving data.
     *
     * @param {UUID} sessionId - The unique identifier of the session to disconnect.
     * @throws {InvalidArgumentError} If the `sessionId` is not provided or is invalid.
     * @memberof Server
     */
    public DisconnectSession(sessionId: UUID): void {
        if (!sessionId || sessionId.trim() === '' || typeof sessionId !== 'string') {
            throw new InvalidArgumentError('Session id must be provided and must be a valid UUID string.');
        }

        this.sessions.delete(sessionId);
    }

    /**
     * Sends data to a specific session connected to the `Server` and updates the sent bytes count.
     *
     * @param {UUID} sessionId - The unique identifier of the session to which the data will be sent.
     * @param {NetworkPayload} payload - The data to be sent, which can be a string, ArrayBufferView, or ArrayBuffer.
     * @returns {number} The number of bytes sent to the specified session.
     * @memberof Server
     */
    public SendToSession(
        sessionId: UUID,
        payload: NetworkPayload,
    ): number {
        if (!this.sessions.has(sessionId)) {
            return 0;
        }

        const bytes = this.MeasureBytes(payload);
        this.sentBytes += bytes;

        return bytes;
    }

    /**
     * Broadcasts data to all connected sessions of the `Server` and updates the sent bytes count.
     *
     * @param {NetworkPayload} payload - The data to be broadcasted, which can be a string, ArrayBufferView, or ArrayBuffer.
     * @returns {number} The total number of bytes sent to all connected sessions.
     * @memberof Server
     */
    public Broadcast(payload: NetworkPayload): number {
        if (this.sessions.size === 0) {
            return 0;
        }

        const bytes = this.MeasureBytes(payload) * this.sessions.size;
        this.sentBytes += bytes;

        return bytes;
    }

    /**
     * Receives data from a specific session connected to the `Server` and updates the received bytes count.
     *
     * @param {UUID} sessionId - The unique identifier of the session from which the data is received.
     * @param {NetworkPayload} payload - The data received, which can be a string, ArrayBufferView, or ArrayBuffer.
     * @returns {number} The number of bytes received from the specified session.
     * @memberof Server
     */
    public ReceiveFromSession(
        sessionId: UUID,
        payload: NetworkPayload,
    ): number {
        if (!this.sessions.has(sessionId)) {
            return 0;
        }

        const bytes = this.MeasureBytes(payload);
        this.receivedBytes += bytes;

        return bytes;
    }

    /**
     * Measures the number of bytes in the provided `payload`.
     *
     * @private
     * @param {NetworkPayload} payload - The data whose byte size is to be measured.
     * @returns {number} The number of bytes in the `payload`.
     * @memberof Server
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