import { patchNativeTypes } from '@core/patches';

import { arrayEnumerable } from './app/array-enumerable.benchmark';
import { makeEnumerableSource } from './app/make-source';

patchNativeTypes();
const source = makeEnumerableSource();

const before = performance.now();

arrayEnumerable(source);

const after = performance.now();

console.log(`Time elapsed: ${(after - before) / 1000}s`);
