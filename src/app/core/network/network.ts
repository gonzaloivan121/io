import { NetworkSpecification } from './interfaces/network-specification.interface';
import { Client } from './client';
import { Server } from './server';
import { UUID } from '../uuid';
import { Log } from '../log/log';

import {
    AlreadyInitializedError,
    InvalidArgumentError,
    NotFoundError,
    NotInitializedError,
} from '../../errors';

/**
 * Represents the network management system, responsible for handling clients and servers within the application.
 *
 * @export
 * @class Network
 */
export class Network {
    /**
     * Indicates whether the network system has been initialized.
     *
     * This is a private static property that is set to true when the Network.Initialize() method is called.
     *
     * @private
     * @static
     * @type {boolean}
     * @memberof Network
     */
    private static initialized: boolean = false;

    /**
     * A map of registered clients, where the key is the client's UUID and the value is the Client instance.
     *
     * @private
     * @static
     * @type {Map<UUID, Client>}
     * @memberof Network
     */
    private static readonly clients: Map<UUID, Client> = new Map<UUID, Client>();

    /**
     * A map of registered servers, where the key is the server's UUID and the value is the Server instance.
     *
     * @private
     * @static
     * @type {Map<UUID, Server>}
     * @memberof Network
     */
    private static readonly servers: Map<UUID, Server> = new Map<UUID, Server>();

    /**
     * The default endpoint URL for the client to connect to the server.
     *
     * @private
     * @static
     * @type {string}
     * @memberof Network
     */
    private static readonly defaultClientEndpoint: string = 'local://default';

    /**
     * Indicates whether the network system has been initialized.
     *
     * @readonly
     * @static
     * @type {boolean}
     * @memberof Network
     */
    public static get Initialized(): boolean {
        return this.initialized;
    }

    /**
     * Returns a read-only map of registered clients, where the key is the client's UUID and the value is the Client instance.
     *
     * @readonly
     * @static
     * @type {ReadonlyMap<UUID, Client>}
     * @memberof Network
     */
    public static get Clients(): ReadonlyMap<UUID, Client> {
        return this.clients;
    }

    /**
     * Returns a read-only map of registered servers, where the key is the server's UUID and the value is the Server instance.
     *
     * @readonly
     * @static
     * @type {ReadonlyMap<UUID, Server>}
     * @memberof Network
     */
    public static get Servers(): ReadonlyMap<UUID, Server> {
        return this.servers;
    }

    /**
     * Initializes the network system with the specified options.
     *
     * @static
     * @param {NetworkSpecification} [options={}] - The options for initializing the network system, including whether to create default clients and servers.
     * @throws {AlreadyInitializedError} If the network system has already been initialized.
     * @throws {InvalidArgumentError} If any of the provided options are invalid.
     * @memberof Network
     */
    public static Initialize(options: NetworkSpecification = {}): void {
        Log.Info('Network.Initialize() - Initializing Network...');
        Log.Trace('Network.Initialize() - Checking if Network is already initialized...');

        if (this.initialized) {
            throw new AlreadyInitializedError(
                'Network is already initialized. Call Network.Shutdown() before re-initializing.',
            );
        }

        Log.Trace(
            'Network.Initialize() - Network is not initialized. Proceeding with initialization...',
        );

        Log.Trace(
            'Network.Initialize() - Checking options for default client and server creation...',
        );

        if (options.createDefaultServer) {
            Log.Trace('Network.Initialize() - Creating default server...');
            this.CreateServer();
        }

        if (options.createDefaultClient) {
            Log.Trace('Network.Initialize() - Creating default client...');
            this.CreateClient(options.clientEndpoint ?? this.defaultClientEndpoint);
        }

        this.initialized = true;

        Log.Debug('Network.Initialize() - Network initialized successfully.');
    }

    /**
     * Shuts down the network system, clearing all registered clients and servers.
     *
     * @static
     * @memberof Network
     */
    public static Shutdown(): void {
        Log.Info('Network.Shutdown() - Shutting down Network...');
        Log.Trace('Network.Shutdown() - Checking if Network has been initialized...');

        if (!this.initialized) {
            throw new NotInitializedError(
                'Network is not initialized. Call Network.Initialize() before shutting down.',
            );
        }

        Log.Trace('Network.Shutdown() - Clearing registered clients and servers...');

        this.clients.clear();
        this.servers.clear();
        this.initialized = false;

        Log.Trace('Network.Shutdown() - Network shut down successfully.');
    }

    /**
     * Registers a new `Client` with the specified id and endpoint.
     *
     * @static
     * @param {UUID} id - The unique identifier for the `Client`.
     * @param {string} endpoint - The endpoint URL for the `Client`.
     * @throws {InvalidArgumentError} If the id or endpoint is invalid.
     * @returns {Client} The newly registered `Client` instance.
     * @memberof Network
     */
    public static RegisterClient(id: UUID, endpoint: string): Client {
        this.EnsureId(id, 'Client');

        if (this.clients.has(id)) {
            return this.clients.get(id) as Client;
        }

        const client = new Client(id, endpoint);
        this.clients.set(id, client);

        return client;
    }

    /**
     * Creates and registers a new `Client` with an auto-generated UUID.
     *
     * @static
     * @param {string} endpoint - The endpoint URL for the `Client`.
     * @returns {Client} The newly created `Client`.
     * @memberof Network
     */
    public static CreateClient(endpoint: string): Client {
        Log.Trace('Network.CreateClient() - Creating a new Client with auto-generated UUID...');

        const id: UUID = crypto.randomUUID();
        return this.RegisterClient(id, endpoint);
    }

    /**
     * Registers a new `Server` with the specified id.
     *
     * @static
     * @param {UUID} id - The unique identifier for the `Server`.
     * @throws {InvalidArgumentError} If the id is invalid.
     * @returns {Server} The newly registered `Server` instance.
     * @memberof Network
     */
    public static RegisterServer(id: UUID): Server {
        this.EnsureId(id, 'Server');

        if (this.servers.has(id)) {
            return this.servers.get(id) as Server;
        }

        const server = new Server(id);
        this.servers.set(id, server);

        return server;
    }

    /**
     * Creates and registers a new `Server` with an auto-generated UUID.
     *
     * @static
     * @returns {Server} The newly created `Server`.
     * @memberof Network
     */
    public static CreateServer(): Server {
        Log.Trace('Network.CreateServer() - Creating a new Server with auto-generated UUID...');

        const id: UUID = crypto.randomUUID();
        return this.RegisterServer(id);
    }

    /**
     * Connects a registered `Client` to a registered `Server` session.
     *
     * @static
     * @param {UUID} clientId - The id of the `Client` to connect.
     * @param {UUID} serverId - The id of the `Server` to connect to.
     * @returns {boolean} `true` if both entities were found and connected; otherwise `false`.
     * @memberof Network
     */
    public static ConnectClientToServer(clientId: UUID, serverId: UUID): boolean {
        const client = this.clients.get(clientId);
        const server = this.servers.get(serverId);

        if (!client || !server) {
            return false;
        }

        client.Connect();
        server.ConnectSession(clientId);

        return true;
    }

    /**
     * Disconnects a registered `Client` from a registered `Server` session.
     *
     * @static
     * @param {UUID} clientId - The id of the `Client` to disconnect.
     * @param {UUID} serverId - The id of the `Server` to disconnect from.
     * @returns {boolean} `true` if both entities were found and disconnected; otherwise `false`.
     * @memberof Network
     */
    public static DisconnectClientFromServer(clientId: UUID, serverId: UUID): boolean {
        const client = this.clients.get(clientId);
        const server = this.servers.get(serverId);

        if (!client || !server) {
            return false;
        }

        client.Disconnect();
        server.DisconnectSession(clientId);

        return true;
    }

    /**
     * Removes a registered `Client` by its `id`.
     *
     * @static
     * @param {UUID} id - The unique identifier of the `Client` to be removed.
     * @throws {InvalidArgumentError} If the `id` is invalid.
     * @returns {boolean} `true` if the `Client` was successfully removed, `false` otherwise.
     * @memberof Network
     */
    public static RemoveClient(id: UUID): boolean {
        this.EnsureId(id, 'Client');
        return this.clients.delete(id);
    }

    /**
     * Removes a registered `Server` by its `id`.
     *
     * @static
     * @param {UUID} id - The unique identifier of the `Server` to be removed.
     * @throws {InvalidArgumentError} If the `id` is invalid.
     * @returns {boolean} `true` if the `Server` was successfully removed, `false` otherwise.
     * @memberof Network
     */
    public static RemoveServer(id: UUID): boolean {
        this.EnsureId(id, 'Server');
        return this.servers.delete(id);
    }

    /**
     * Retrieves a registered `Client` by its `id`.
     *
     * @static
     * @param {UUID} id - The unique identifier of the `Client` to be retrieved.
     * @throws {InvalidArgumentError} If the `id` is invalid.
     * @throws {NotFoundError} If no `Client` with the specified `id` exists.
     * @returns {Client} The `Client` instance associated with the specified `id`.
     * @memberof Network
     */
    public static GetClient(id: UUID): Client {
        this.EnsureId(id, 'Client');

        const client = this.clients.get(id);
        if (!client) {
            throw new NotFoundError(`Client with id '${id}' was not found.`);
        }

        return client;
    }

    /**
     * Retrieves a registered `Server` by its `id`.
     *
     * @static
     * @param {UUID} id - The unique identifier of the `Server` to be retrieved.
     * @throws {InvalidArgumentError} If the `id` is invalid.
     * @throws {NotFoundError} If no `Server` with the specified `id` exists.
     * @returns {Server} The `Server` instance associated with the specified `id`.
     * @memberof Network
     */
    public static GetServer(id: UUID): Server {
        this.EnsureId(id, 'Server');

        const server = this.servers.get(id);
        if (!server) {
            throw new NotFoundError(`Server with id '${id}' was not found.`);
        }

        return server;
    }

    /**
     * Ensures that the provided `id` is a valid `UUID` string for the specified type (`Client` or `Server`).
     *
     * @private
     * @static
     * @param {UUID} id - The unique identifier to be validated.
     * @param {('Client' | 'Server')} type - The type of entity being validated, either `Client` or `Server`.
     * @throws {InvalidArgumentError} If the `id` is not a valid `UUID` string.
     * @memberof Network
     */
    private static EnsureId(id: UUID, type: 'Client' | 'Server'): void {
        if (!id || typeof id !== 'string') {
            throw new InvalidArgumentError(
                `${type} id must be provided and must be a valid UUID string.`,
            );
        }
    }
}
