/**
 * The base error class for all exceptions.
 *
 * @export
 * @class BaseError
 * @extends {Error}
 */
export class BaseError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;

        // Set the prototype explicitly to support `instanceof` checks.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Thrown when a `null`, `undefined`, or otherwise invalid argument is passed to a method.
 * 
 * @export
 * @class InvalidArgumentError
 * @extends {BaseError}
 */
export class InvalidArgumentError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when an attempt is made to create a resource that already exists.
 *
 * @export
 * @class AlreadyExistsError
 * @extends {BaseError}
 */
export class AlreadyExistsError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when a requested resource is not found.
 *
 * @export
 * @class NotFoundError
 * @extends {BaseError}
 */
export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when an attempt is made to invoke a method or access a property that has not been implemented.
 *
 * @export
 * @class NotImplementedError
 * @extends {BaseError}
 */
export class NotImplementedError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when a required resource or component is not initialized.
 *
 * @export
 * @class NotInitializedError
 * @extends {BaseError}
 */
export class NotInitializedError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when an attempt is made to initialize a resource that has already been initialized.
 *
 * @export
 * @class AlreadyInitializedError
 * @extends {BaseError}
 */
export class AlreadyInitializedError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

/**
 * Thrown when an operation is attempted that is not valid in the current state of the application or resource.
 *
 * @export
 * @class InvalidStateError
 * @extends {BaseError}
 */
export class InvalidStateError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}