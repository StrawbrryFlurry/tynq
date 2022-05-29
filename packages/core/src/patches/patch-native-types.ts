import { IEnumerable } from '../enumerable.interface';
import { patchAsEnumerable } from './patch-prototype-enumerable';

/**
 * Patches all native types to implement
 * the IEnumerable interface.
 */
export function patchNativeTypes() {
  patchAsEnumerable(Map);
  patchAsEnumerable(Set);
  patchAsEnumerable(Array);
  patchAsEnumerable(String);
}

declare global {
  interface Array<T> extends IEnumerable<T> {}
  interface Map<K, V> extends IEnumerable<[K, V]> {}
  interface Set<T> extends IEnumerable<T> {}
  interface String extends IEnumerable<string> {}
}
