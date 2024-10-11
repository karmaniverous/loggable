/**
 * Loggable options.
 */
export interface LoggableOptions {
  /** Identifies logger endpoints disabled when `enableAll !== true`. */
  disabled?: string[];

  /** Enables all logger endpoints when `true`. */
  enableAll?: boolean;
}
