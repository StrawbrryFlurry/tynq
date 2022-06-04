import { ArrayEnumerator } from '@core';

describe('ArrayEnumerator.constructor', () => {
  it('throws an error when source is null', () => {
    expect(() => new ArrayEnumerator(null!)).toThrowError();
  });

  it('throws an error when source is not an Array', () => {
    expect(() => new ArrayEnumerator(<any>{})).toThrowError();
  });

  it('can be constructed with an array', () => {
    const source = [1];
    expect(() => new ArrayEnumerator(source)).not.toThrowError();
  });
});

describe('ArrayEnumerator.moveNext', () => {
  it('returns true if the sequence contains a next element', () => {
    const enumerator = new ArrayEnumerator([1, 2, 3]);
    expect(enumerator.moveNext()).toStrictEqual(true);
  });

  it('returns false if the sequence contains no next element', () => {
    const enumerator = new ArrayEnumerator([1]);
    enumerator.moveNext();
    expect(enumerator.moveNext()).toStrictEqual(false);
  });
});

describe('ArrayEnumerator.reset', () => {
  it('resets the enumeration to the start', () => {
    const enumerator = new ArrayEnumerator([1, 2, 3]);
    enumerator.moveNext();
    enumerator.reset();
    enumerator.moveNext();
    expect(enumerator.current).toStrictEqual(1);
  });
});
