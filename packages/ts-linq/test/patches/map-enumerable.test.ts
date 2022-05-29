import { Enumerator } from '@ts-linq/core';

describe('Array enumerable tests', () => {
  test('Array.getEnumerator returns a new enumerator', () => {
    const source = new Map();
    expect(source.getEnumerator()).toBeInstanceOf(Enumerator);
  });

  test('Map enumerator moveNext returns first element of the map', () => {
    const source = new Map();
    source.set('key', 'value');

    const enumerator = source.getEnumerator();
    enumerator.moveNext();

    expect(enumerator.current).toEqual(['key', 'value']);
  });
});
