import { Enumerator } from '@tynq/core';

describe('Set enumerable tests', () => {
  test('Set.getEnumerator returns a new enumerator', () => {
    const source = new Map();
    expect(source.getEnumerator()).toBeInstanceOf(Enumerator);
  });

  test('Set enumerator moveNext returns first element in the set', () => {
    const source = new Map();
    source.set('key', 'value');

    const enumerator = source.getEnumerator();
    enumerator.moveNext();

    expect(enumerator.current).toEqual(['key', 'value']);
  });
});
