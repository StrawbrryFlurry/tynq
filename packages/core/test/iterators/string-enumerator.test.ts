import { StringEnumerator } from '@core';

describe('StringEnumerator.constructor', () => {
  it('throws an error when source is null', () => {
    expect(() => new StringEnumerator(null!)).toThrowError();
  });

  it('throws an error when source is not an Array', () => {
    expect(() => new StringEnumerator(<any>{})).toThrowError();
  });

  it('can be constructed with an array', () => {
    const source = 'Hii!';
    expect(() => new StringEnumerator(source)).not.toThrowError();
  });
});

describe('StringEnumerator.moveNext', () => {
  it('returns true if the sequence contains a next element', () => {
    const enumerator = new StringEnumerator('Test');
    expect(enumerator.moveNext()).toStrictEqual(true);
  });

  it('returns false if the sequence contains no next element', () => {
    const enumerator = new StringEnumerator('T');
    enumerator.moveNext();
    expect(enumerator.moveNext()).toStrictEqual(false);
  });
});

describe('StringEnumerator.reset', () => {
  it('resets the enumeration to the start', () => {
    const enumerator = new StringEnumerator('Hi');
    enumerator.moveNext();
    enumerator.reset();
    enumerator.moveNext();
    expect(enumerator.current).toStrictEqual('H');
  });
});
