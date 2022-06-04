import { IEnumerable } from '@core/enumerable';
import { EnumeratorStateMachine, IterableEnumerator, Next } from '@core/iterators';
import { patchAsEnumerable } from '@core/patches';

describe('patch-as-enumerable', () => {
  it('should change the prototype of the input type to be IEnumerable', () => {
    const type = class Test extends EnumeratorStateMachine<number> {
      public next(): Next<number> {
        return 1;
      }

      public setup(): void {
        throw new Error('Method not implemented.');
      }
    };

    patchAsEnumerable(type, null);

    expect(Object.getPrototypeOf(type.prototype)).toBe(IEnumerable.prototype);
  });

  it('should add a getEnumerator method to the type that returns the specified enumerator implementation', () => {
    const type = class Test implements Iterable<number> {
      [Symbol.iterator](): Iterator<number> {
        return { next: () => ({ value: 1 }) };
      }
    };

    queueMicrotask;

    patchAsEnumerable(type, <any>IterableEnumerator);

    expect((<any>type.prototype).getEnumerator()).toBeInstanceOf(
      IterableEnumerator
    );
  });
});
