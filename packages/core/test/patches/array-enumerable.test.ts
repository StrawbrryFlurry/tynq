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
    const source = [1, 2, 3];
    const enumerator = source.getEnumerator();

    enumerator.moveNext();
    enumerator.moveNext();
    enumerator.moveNext();

    expect(enumerator.moveNext()).toBe(false);
  });

  test('.single returns the first element of the array', () => {
    const source = [1];
    expect(source.single()).toBe(1);
  });
});
