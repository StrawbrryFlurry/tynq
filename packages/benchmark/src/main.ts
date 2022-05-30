import { arrayEnumerable } from './app/array-enumerable.benchmark';
import { makeEnumerableSource } from './app/make-source';

const source = makeEnumerableSource();

const before = performance.now();

arrayEnumerable(source);

const after = performance.now();

console.log(`Time elapsed: ${after - before}`);
