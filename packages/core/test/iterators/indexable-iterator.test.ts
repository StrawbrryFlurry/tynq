import { IndexableIterator } from '@core/iterators';

describe('IndexableIterator.constructor', () => {
  it('throws an error when source is null', () => {
    expect(() => new IndexableIterator(null!)).toThrowError();
  });

  it('throws an error when source does not have a length property', () => {
    expect(() => new IndexableIterator(<any>{})).toThrowError();
  });

  it('can be constructed with an indexable type', () => {
    const source = 'Hii!';
    expect(() => new IndexableIterator(source)).not.toThrowError();
  });
});

describe('IndexableIterator.moveNext', () => {
  it('returns true if the sequence contains a next element', () => {
    const enumerator = new IndexableIterator([1, 2, 3]);
    expect(enumerator.moveNext()).toStrictEqual(true);
  });

  it('returns false if the sequence contains no next element', () => {
    const enumerator = new IndexableIterator([1]);
    enumerator.moveNext();
    expect(enumerator.moveNext()).toStrictEqual(false);
  });
});

describe('IndexableIterator.reset', () => {
  it('resets the enumeration to the start', () => {
    const enumerator = new IndexableIterator([1, 2, 3]);
    enumerator.moveNext();
    enumerator.reset();
    enumerator.moveNext();
    expect(enumerator.current).toStrictEqual(1);
  });
});
