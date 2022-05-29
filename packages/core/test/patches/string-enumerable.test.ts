import { Enumerator } from '@tynq/core';

describe('String enumerable tests', () => {
  test('String.getEnumerator returns a new enumerator', () => {
    const source = 'Foo';
    expect(source.getEnumerator()).toBeInstanceOf(Enumerator);
  });

  test('String enumerator moveNext returns first character in the string', () => {
    const source = 'Foo';

    const enumerator = source.getEnumerator();
    enumerator.moveNext();

    expect(enumerator.current).toEqual('F');
  });
});
