import { Enumerable } from '../enumerable';
import { IEnumerable } from '../enumerable.interface';
import { Enumerator } from '../enumerator';
import { IteratorType } from '../types';
import { isFunction } from '../utils';

/**
 * Patches the prototype of the input
 * type to include implementations for
 * all methods present on the IEnumerable interface.
 */
export function patchAsEnumerable(type: IteratorType) {
  const prototype = type.prototype;

  prototype.getEnumerator = function () {
    return new Enumerator(this);
  };

  const enumerableDescriptors = Object.getOwnPropertyDescriptors(Enumerable);
  const enumerableMethods = Object.entries(enumerableDescriptors)
    .filter(([key]) => key !== 'prototype')
    .filter(([_, descriptor]) => isFunction(descriptor.value))
    .map(([_, descriptor]) => <Function>descriptor.value);

  for (const method of enumerableMethods) {
    // This needs to be a "function" to capture the `this`
    // scope of the prototype this property is added to.
    const enumerableMethodWithSelfAsSource = function (
      this: IEnumerable<any>,
      ...args: any[]
    ) {
      return method(this, ...args);
    };
    Object.defineProperty(prototype, method.name, {
      value: enumerableMethodWithSelfAsSource,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
}
