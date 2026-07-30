/**
 * Network specification options for initializing the network.
 *
 * @export
 * @interface NetworkSpecification
 */
export interface NetworkSpecification {
    /**
     * The endpoint URL for the client to connect to the server.
     *
     * @type {string}
     * @memberof NetworkSpecification
     */
    clientEndpoint?: string;

    /**
     * Indicates whether to create a default server during initialization.
     *
     * @type {boolean}
     * @memberof NetworkSpecification
     */
    createDefaultServer?: boolean;

    /**
     * Indicates whether to create a default client during initialization.
     *
     * @type {boolean}
     * @memberof NetworkSpecification
     */
    createDefaultClient?: boolean;
}