import { isFunction, mapValues, shake } from 'radash';

import type { Constructor } from './Constructor';
import type { LoggableOptions } from './LoggableOptions';
import type { LoggerEndpoint } from './LoggerEndpoint';
import type { Methods } from './Methods';

/**
 * Loggable mixin. Adds external logger to base class or serves as base class to add external logger to derived class.
 *
 * @param Base - Base class (defaults to empty class).
 * @param logger - Logger object (defaults to `console`).
 * @param options - LoggableOptions object (defaults to `{ disabled: ['debug'] }`).
 *
 * @returns Loggable class.
 */
export function Loggable<T extends Constructor<object>, Logger = Console>(
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  Base: T = class {} as T,
  logger: Logger = console as Logger,
  options: LoggableOptions = {
    disabled: ['debug'],
    enableAll: false,
  },
) {
  return class extends Base {
    loggableOptions = options;

    logger = mapValues(
      shake(logger, (p) => !isFunction(p)) as Record<string, LoggerEndpoint>,
      (value, key) =>
        (...args: unknown[]): unknown =>
          this.loggableOptions.disabled?.includes(key) &&
          !this.loggableOptions.enableAll
            ? undefined
            : value(...args),
    ) as Methods<Logger>;
  };
}
