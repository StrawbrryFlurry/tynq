import { IterableEnumerator } from '@core';

describe('IterableEnumerator.constructor', () => {
  test('throws error when source is null', () => {
    expect(() => new IterableEnumerator(null!)).toThrowError();
  });

  test('Constructor throws error when source does not have a Symbol.iterator property', () => {
    expect(() => new IterableEnumerator(<any>{})).toThrowError();
  });

  test('Constructor throws error when the iterable does not return an iterator', () => {
    const source = { [Symbol.iterator]: () => <any>{} };
    expect(() => new IterableEnumerator(source)).toThrowError();
  });

  test('Can be constructed with an iterable', () => {
    const source = [1];
    expect(() => new IterableEnumerator(source)).not.toThrowError();
  });

  test('Can be constructed with a iterator function', () => {
    const source = [1];
    expect(
      () => new IterableEnumerator(source[Symbol.iterator].bind(source))
    ).not.toThrowError();
  });

  test('Can be constructed with a generator function', () => {
    const source = function* () {
      yield 1;
    };

    expect(() => new IterableEnumerator(source)).not.toThrowError();
  });
});
