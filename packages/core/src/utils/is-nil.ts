export const isNil = (obj: any): obj is null | undefined =>
  typeof obj === 'undefined' || obj === null;

export const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

export const isString = (obj: any): obj is string => typeof obj === 'string';
