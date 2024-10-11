import type { LoggerEndpoint } from './LoggerEndpoint';

export type Methods<T> = {
  [K in keyof T as K extends string
    ? T[K] extends Function // eslint-disable-line @typescript-eslint/no-unsafe-function-type
      ? K
      : never
    : never]: T[K];
} & Record<string, LoggerEndpoint>;
