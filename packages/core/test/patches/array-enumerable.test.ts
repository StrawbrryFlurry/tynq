import { Enumerator } from '@tynq/core';

describe('Array enumerable tests', () => {
  test('Array.getEnumerator returns a new enumerator', () => {
    expect([].getEnumerator()).toBeInstanceOf(Enumerator);
  });

  test('Array enumerator moveNext returns first item in the array', () => {
    const source = [1, 2, 3];
    const enumerator = source.getEnumerator();

    enumerator.moveNext();

    expect(enumerator.current).toBe(1);
  });

  test('Array enumerator moveNext returns false when there are no more items', () => {
    const x = [1, 2, 3];
    x.where((x) => x == 1);
  });
});
