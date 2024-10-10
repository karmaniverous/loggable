/**
 * Loggable options.
 */
export interface LoggableOptions<Logger> {
  /** Identifies logger endpoints disabled when `logInternals === false`. */
  internal?: string[];

  /** Logger to use for internal logging. Must support methods in `internal`. */
  logger: Logger;

  /** Enables internal logging when `true`. */
  logInternals?: boolean;
}
