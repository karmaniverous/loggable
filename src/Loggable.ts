import { isFunction, mapValues } from 'radash';

import { conditionalize } from './conditionalize';
import { Constructor } from './Constructor';
import { LoggableOptions } from './LoggableOptions';

type LoggerEndpoint = (...args: unknown[]) => void;

const conditionalizeLogger = <Logger>({
  internal,
  logger,
  logInternals,
}: LoggableOptions<Logger>): Logger =>
  mapValues(logger as Record<string, unknown>, (value, key) => {
    if (!internal?.includes(key)) return value;

    if (!isFunction(value))
      throw new Error(`logger must support ${key} method`);

    return conditionalize(value as LoggerEndpoint, logInternals);
  }) as Logger;

const defaultLoggableOptions = {
  internal: ['debug'],
  logger: console,
  logInternals: false,
};

/**
 * Loggable mixin.
 *
 * @param Base - Base class.
 * @param options - Loggable options.
 *
 * @returns
 */
export function Loggable<T extends Constructor<object>, Logger = Console>(
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  Base: T = class {} as T,
  options: Partial<LoggableOptions<Logger>> = defaultLoggableOptions as Partial<
    LoggableOptions<Logger>
  >,
) {
  return class extends Base {
    #loggable = {
      ...defaultLoggableOptions,
      ...options,
    } as LoggableOptions<Logger>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      super(...args);
      this.#loggable.logger = conditionalizeLogger(this.#loggable);
    }

    get loggable() {
      return this.#loggable;
    }

    setLoggable(options: Partial<LoggableOptions<Logger>>) {
      this.#loggable = { ...this.#loggable, ...options };

      if (options.logger) {
        this.#loggable.logger = conditionalizeLogger(this.#loggable);
      }
    }
  };
}
