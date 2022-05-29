import { Enumerator } from '@ts-linq/core';

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
});
