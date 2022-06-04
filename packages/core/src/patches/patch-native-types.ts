import { IEnumerable } from '../enumerable';
import { ArrayEnumerator, Iterator, MapEnumerator, SetEnumerator, StringEnumerator } from '../iterators';
import { patchAsEnumerable } from './patch-prototype-enumerable';

/**
 * Patches all native types to implement
 * the IEnumerable interface.
 */
export function patchNativeTypes() {
  patchAsEnumerable(Map, <any>MapEnumerator);
  patchAsEnumerable(Array, <any>ArrayEnumerator);
  patchAsEnumerable(Set, <any>SetEnumerator);
  patchAsEnumerable(String, <any>StringEnumerator);
  patchAsEnumerable(Iterator, null!);
}

declare global {
  interface Array<T> extends IEnumerable<T> {}
  interface Map<K, V> extends IEnumerable<[K, V]> {}
  interface Set<T> extends IEnumerable<T> {}
  interface String extends IEnumerable<string> {}
}
