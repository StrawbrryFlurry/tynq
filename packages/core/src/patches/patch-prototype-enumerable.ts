import { IEnumerable } from '../enumerable';
import { IEnumerator } from '../enumerator';
import { IteratorType } from '../types';
import { isNil } from '../utils';

/**
 * Patches the prototype of the input
 * type to include implementations for
 * all methods present on the IEnumerable interface.
 */
export function patchAsEnumerable<
  T extends IteratorType<I>,
  I extends Iterator<I>
>(
  /**
   * The type whose prototype will be patched
   * to be `IEnumerable`
   */
  type: T,
  /**
   * Provide the IEnumerator implementation that the type
   * should use here. If the type already implements
   * IEnumerable, provide null.
   */
  enumeratorImpl: null | { new (source: T): IEnumerator<I> }
) {
  const prototype = type.prototype;

  if (!isNil(enumeratorImpl)) {
    prototype.getEnumerator = function () {
      return new enumeratorImpl(this);
    };
  }

  Object.setPrototypeOf(prototype, IEnumerable.prototype);
}
