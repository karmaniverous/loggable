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
 * @param loggableOptions - Partial {@link LoggableOptions | `LoggableOptions`} object.
 *
 * @returns Loggable class.
 *
 * @remarks
 * The `loggableOptions` parameter is merged with the following default options and exposed at `this.loggableOptions`:
 * - `disabled`: []
 * - `enableAll`: false
 */
export function Loggable<T extends Constructor<object>, Logger = Console>(
  Base: T = class {} as T,
  logger: Logger = console as Logger,
  loggableOptions: Partial<LoggableOptions> = {},
) {
  return class extends Base {
    loggableOptions: LoggableOptions = Object.assign(
      { disabled: [], enableAll: false },
      loggableOptions,
    );

    /**
     * External logger interface. Methods are disabled and return `undefined` when method included in `disabled` array and `enableAll !== true`.
     */
    logger = mapValues(
      shake(logger, (p) => !isFunction(p)) as Record<string, LoggerEndpoint>,
      (value, key) =>
        (...args: unknown[]): unknown =>
          this.loggableOptions.disabled.includes(key) &&
          !this.loggableOptions.enableAll
            ? undefined
            : value(...args),
    ) as Methods<Logger>;
  };
}
