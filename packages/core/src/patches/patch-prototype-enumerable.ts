import { Enumerable } from '../enumerable';
import { IEnumerable } from '../enumerable.interface';
import { IEnumerator } from '../enumerator.interface';
import { IteratorType } from '../types';
import { isFunction } from '../utils';

/**
 * Patches the prototype of the input
 * type to include implementations for
 * all methods present on the IEnumerable interface.
 */
export function patchAsEnumerable<T extends IteratorType<I>, I>(
  type: T,
  enumeratorImpl: new (source: T) => IEnumerator<I>
) {
  const prototype = type.prototype;

  prototype.getEnumerator = function () {
    return new enumeratorImpl(this);
  };

  const enumerableDescriptors = Object.getOwnPropertyDescriptors(Enumerable);
  const enumerableMethods = Object.entries(enumerableDescriptors)
    .filter(([key]) => key !== 'prototype')
    .filter(([_, descriptor]) => isFunction(descriptor.value))
    .map(([_, descriptor]) => <Function>descriptor.value);

  for (const method of enumerableMethods) {
    const methodName = method.name;
    // This needs to be a "function" to capture the `this`
    // scope of the prototype this property is added to.
    const enumerableMethodWithSelfAsSource = function (
      this: IEnumerable<any>,
      ...args: any[]
    ) {
      return method(this, ...args);
    };

    // Overwrite the name of the function to be
    // the same as it's source.
    // <function>.name is not wrtable, so x.name = y doesn't work
    Object.defineProperty(enumerableMethodWithSelfAsSource, 'name', {
      value: methodName,
      configurable: true,
      enumerable: false,
      writable: false,
    });

    Object.defineProperty(prototype, method.name, {
      value: enumerableMethodWithSelfAsSource,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
}
