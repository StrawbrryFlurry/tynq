import { Enumerator } from '../src/enumerator';

describe('Enumerator.constructor', () => {
  test('Constructor throws error when source is null', () => {
    expect(() => new Enumerator(null!)).toThrowError();
  });

  test('Constructor throws error when source does not have a Symbol.iterator property', () => {
    expect(() => new Enumerator(<any>{})).toThrowError();
  });

  test('Constructor throws error when the iterable does not return an iterator', () => {
    const source = { [Symbol.iterator]: () => <any>{} };
    expect(() => new Enumerator(source)).toThrowError();
  });

  test('Can be constructed with an iterable', () => {
    const source = [1];
    expect(() => new Enumerator(source)).not.toThrowError();
  });

  test('Can be constructed with a iterator function', () => {
    const source = [1];
    expect(
      () => new Enumerator(source[Symbol.iterator].bind(source))
    ).not.toThrowError();
  });

  test('Can be constructed with a generator function', () => {
    const source = function* () {
      yield 1;
    };

    expect(() => new Enumerator(source)).not.toThrowError();
  });
});

describe('Enumerator generic methods', () => {
  test('getIterator returns inner source iterator when source is iterable', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    expect(enumerator.getIterator().next().value).toStrictEqual(1);
  });

  test('getIterator returns inner source iterator when source is generator function', () => {
    const source = function* () {
      yield 1;
    };
    const enumerator = new Enumerator(source);
    expect(enumerator.getIterator().next().value).toStrictEqual(1);
  });

  test('reset resets the current iterator to a new iterator from the source', () => {
    const enumerator = new Enumerator([1, 2, 3]);

    const iterator = enumerator.getIterator();
    iterator.next();
    enumerator.reset();

    const resetIterator = enumerator.getIterator();
    const { value } = resetIterator.next();

    expect(value).toBe(1);
  });
});

describe('Enumerator.moveNext', () => {
  test('moveNext returns true when the iterator is not done', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    expect(enumerator.moveNext()).toBe(true);
  });

  test('current will be null when `moveNext` has never been called on the enumerator', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    expect(enumerator.current).toBe(null);
  });

  test('moveNext updates the `current` property of the instance with the next value', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    enumerator.moveNext();
    expect(enumerator.current).toBe(1);
  });

  test('moveNext does not overwrite the value of `current` even when the iterator is done', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    while (enumerator.moveNext());
    enumerator.moveNext();
    expect(enumerator.current).toBe(3);
  });

  test('moveNext returns false when the iterator is done', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    const iterator = enumerator.getIterator();
    while (iterator.next().done === false);
    expect(enumerator.moveNext()).toBe(false);
  });
});
