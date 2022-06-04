import { patchAsEnumerable, patchNativeTypes } from './patches';

export * from './async';
export * from './enumerable';
export * from './enumerator';
export * from './exceptions';
export * from './iterators';
export * from './utils';
export * from './types';

patchNativeTypes();

export { patchAsEnumerable };
