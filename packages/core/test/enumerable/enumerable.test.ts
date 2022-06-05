import { Enumerable, IEnumerable } from '@core';

describe('Enumerable.count', () => {
  const makeMockIterator = <T>(source: IEnumerable<T>) => {
    const enumerator = source.getEnumerator();
    const mockFn = jest.fn(() => enumerator);
    source.getEnumerator = mockFn;
    return mockFn;
  };

  test('Does not enumerate over all items if source is array', () => {
    const source = [1, 2, 3];
    const mockFn = makeMockIterator(source);
    const count = Enumerable.count(source);

    expect(mockFn).not.toBeCalled();
  });

  test('Does not enumerate over all items if source is set', () => {
    const source = new Set([1, 2, 3]);
    const mockFn = makeMockIterator(source);
    const count = Enumerable.count(source);
    expect(mockFn).not.toBeCalled();
  });

  test('Does not enumerate over all items if source is string', () => {
    const source = 'Foo';
    const enumerator = source.getEnumerator();
    const mockFn = jest.fn(() => enumerator);
    String.prototype.getEnumerator = mockFn;

    const count = Enumerable.count(source);

    expect(mockFn).not.toBeCalled();
  });

  test('Returns the correct count of elements in the sequence', () => {
    const source = [1, 2, 3];

    const count = Enumerable.count(source);

    expect(count).toBe(3);
  });
});

describe('Enumerable.Empty', () => {
  test('Returns an empty enumerator', () => {
    const empty = Enumerable.empty();
    const enumerator = empty.getEnumerator();
    expect(enumerator.moveNext()).toBe(false);
  });
});

describe('Enumerable.from', () => {
  test('Creates an Enumerable from a generic iterable', () => {
    const enumerable = Enumerable.from([1, 2, 3]);

    const enumerator = enumerable.getEnumerator();
    enumerator.moveNext();

    expect(enumerator.current).toBe(1);
  });

  test('Throws if source is null', () => {
    const action = () => Enumerable.from(null!);

    expect(action).toThrowError();
  });
});

describe('Enumerable.repeat', () => {
  test('Throws when the count is less than 0', () => {
    const action = () => Enumerable.repeat('Hi', -1);

    expect(action).toThrowError();
  });

  test('Returns the repeated element x amount of times', () => {
    const enumerable = Enumerable.repeat('Hi', 3);

    const enumerator = enumerable.getEnumerator();
    enumerator.moveNext();
    expect(enumerator.current).toBe('Hi');
    enumerator.moveNext();
    expect(enumerator.current).toBe('Hi');
    enumerator.moveNext();
    expect(enumerator.current).toBe('Hi');
    expect(enumerator.moveNext()).toBe(false);
  });
});

describe('Enumerable.select', () => {
  test('Alters the source through the selector function', () => {
    const source = [1, 2, 3];

    const updated = Enumerable.select(source, (item) => item + 1);

    const enumerator = updated.getEnumerator();
    enumerator.moveNext();
    expect(enumerator.current).toBe(2);

    enumerator.moveNext();
    expect(enumerator.current).toBe(3);

    enumerator.moveNext();
    expect(enumerator.current).toBe(4);
  });

  test('Calls the selector function for every enumerated item', () => {
    const source = [1, 2, 3];
    const mockSelectFn = jest.fn((item) => item + 1);

    const enumerable = Enumerable.select(source, mockSelectFn);
    const enumerator = enumerable.getEnumerator();
    enumerator.moveNext();
    enumerator.moveNext();
    enumerator.moveNext();

    expect(mockSelectFn).toHaveBeenCalledTimes(3);
  });
});

describe('Enumerable.single', () => {
  test('Returns a single item, if the sequence contains only one item', () => {
    const source = [1];

    const single = Enumerable.single(source);

    expect(single).toBe(1);
  });

  test('Throws if the sequence contains more than one element', () => {
    const source = [1, 2];

    const action = () => Enumerable.single(source);

    expect(action).toThrowError();
  });

  test('Throws if the enumerator yields no element', () => {
    const source: number[] = [];

    const action = () => Enumerable.single(source);

    expect(action).toThrowError();
  });

  test('Returns the single element that matches the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.single(source, (element) => element === 2);

    expect(single).toBe(2);
  });

  test('Throws if the sequence contains no elements that match the predicate', () => {
    const source: number[] = [1, 2, 3];

    const action = () => Enumerable.single(source, () => false);

    expect(action).toThrowError();
  });

  test('Throws if the contains more than one element that match the predicate', () => {
    const source: number[] = [1, 2, 3];

    const action = () => Enumerable.single(source, () => true);

    expect(action).toThrowError();
  });
});

describe('Enumerable.singleOrDefault', () => {
  test('Returns single item, if the sequence contains only one element', () => {
    const source = [1];

    const single = Enumerable.singleOrDefault(source);

    expect(single).toBe(1);
  });

  test('Returns null if the sequence contains more than one element', () => {
    const source = [1, 2];

    const single = Enumerable.singleOrDefault(source);

    expect(single).toBeNull();
  });

  test('Returns null if the sequence is empty', () => {
    const source: number[] = [];

    const single = Enumerable.singleOrDefault(source);

    expect(single).toBeNull();
  });

  test('Returns the single element that matches the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrDefault(source, (item) => item === 2);

    expect(single).toBe(2);
  });

  test('Returns null if the sequence contains no element that match the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrDefault(source, () => false);

    expect(single).toBeNull();
  });

  test('Returns null if the sequence contains more than one element that match the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrDefault(source, () => true);

    expect(single).toBeNull();
  });

  test('Returns the specified default value if sequence is empty', () => {
    const source: number[] = [];

    const single = Enumerable.singleOrDefault(source, 1);

    expect(single).toBe(1);
  });

  test('Returns the specified default value if the sequence contains more than one match', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrDefault(source, () => true, 1);

    expect(single).toBe(1);
  });

  test('Returns the specified default value if the sequence contains no match', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrDefault(source, () => false, 1);

    expect(single).toBe(1);
  });
});

describe('Enumerable.where', () => {
  test('Where returns all elements of the sequence that match the predicate', () => {
    const source = [1, 2, 3];

    const filtered = Enumerable.where(source, (element) => element > 1);

    const enumerator = filtered.getEnumerator();
    enumerator.moveNext();
    expect(enumerator.current).toBe(2);

    enumerator.moveNext();
    expect(enumerator.current).toBe(3);
  });

  test('Where calls the predicate function for every element in the sequence', () => {
    const source = [1, 2, 3];
    const mockPredicate = jest.fn((element) => element > 1);

    const enumerable = Enumerable.where(source, mockPredicate);
    const enumerator = enumerable.getEnumerator();
    enumerator.moveNext();
    enumerator.moveNext();
    enumerator.moveNext();

    expect(mockPredicate).toHaveBeenCalledTimes(3);
  });
});

describe('Enumerable.first', () => {
  test('Returns the first element of the sequence', () => {
    const source = [1, 2, 3];

    const first = Enumerable.first(source);

    expect(first).toBe(1);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.first(source);

    expect(action).toThrowError();
  });

  test('Returns the first element that matches the predicate', () => {
    const source = [1, 2, 3];

    const first = Enumerable.first(source, (element) => element === 2);

    expect(first).toBe(2);
  });

  test('Throws if the sequence is not empty and no match for the predicate is found', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.first(source, () => false);

    expect(action).toThrowError();
  });
});

describe('Enumerable.firstOrDefault', () => {
  test('Returns the first element in the sequence', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrDefault(source);

    expect(first).toBe(1);
  });

  test('Returns null if the sequence is empty', () => {
    const source: number[] = [];

    const first = Enumerable.firstOrDefault(source);

    expect(first).toBeNull();
  });

  test('Returns the first element that matches the predicate', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrDefault(source, (item) => item === 2);

    expect(first).toBe(2);
  });

  test('Returns null if the sequence is not empty and no element matching the predicate is found', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrDefault(source, () => false);

    expect(first).toBeNull();
  });

  test('Returns specified default value if the sequence is empty', () => {
    const source: number[] = [];

    const first = Enumerable.firstOrDefault(source, 1);

    expect(first).toBe(1);
  });

  test('Returns specified default value if the sequence is not empty and no element matching the predicate is found', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrDefault(source, () => false, 1);

    expect(first).toBe(1);
  });
});

describe('Enumerable.last', () => {
  test('Returns the last element in the sequence', () => {
    const source = [1, 2, 3];

    const last = Enumerable.last(source);

    expect(last).toBe(3);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.last(source);

    expect(action).toThrowError();
  });

  test('Returns the last element that matches the predicate', () => {
    const source = [1, 2, 3];

    const last = Enumerable.last(source, (item) => item === 2);

    expect(last).toBe(2);
  });

  test('Throws if the sequence is not empty and the predicate is not met', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.last(source, () => false);

    expect(action).toThrowError();
  });

  test("Doesn't enumerate over the enumerable if the source is a non empty array", () => {
    const source = [1, 2, 3];
    const mockIterator = jest.fn();
    source[Symbol.iterator] = mockIterator;

    Enumerable.last(source);

    expect(mockIterator).not.toHaveBeenCalled();
  });
});
describe('Enumerable.lastOrDefault', () => {
  test('Returns the last element in the sequence', () => {
    const source = [1, 2, 3];

    const last = Enumerable.lastOrDefault(source);

    expect(last).toBe(3);
  });

  test('Returns null if the sequence is empty', () => {
    const source: number[] = [];

    const last = Enumerable.lastOrDefault(source);

    expect(last).toBeNull();
  });

  test('Returns the last element that matches the predicate', () => {
    const source = [1, 2, 3];

    const last = Enumerable.lastOrDefault(source, (item) => item === 2);

    expect(last).toBe(2);
  });

  test('Returns null if the sequence is not empty and no element matching the predicate is found', () => {
    const source = [1, 2, 3];

    const last = Enumerable.lastOrDefault(source, () => false);

    expect(last).toBeNull();
  });

  test("Doesn't enumerate over the enumerable if the source is a non empty array", () => {
    const source = [1, 2, 3];
    const mockIterator = jest.fn();
    source[Symbol.iterator] = mockIterator;

    Enumerable.lastOrDefault(source);

    expect(mockIterator).not.toHaveBeenCalled();
  });

  test('Returns the default value if the sequence is empty', () => {
    const source = new Set<number>();
    const last = Enumerable.lastOrDefault(source, 1);

    expect(last).toBe(1);
  });

  test('Returns the default value if the sequence does not contain any element that matches the predicate', () => {
    const source = [1, 2, 3];
    const last = Enumerable.lastOrDefault(source, () => false, 1);

    expect(last).toBe(1);
  });

  test('Returns the default value if the sequence is an empty array', () => {
    const source: number[] = [];
    const last = Enumerable.lastOrDefault(source, 1);

    expect(last).toBe(1);
  });
});

describe('Enumerable.Any', () => {
  test('Returns true if the sequence contains any items', () => {
    const source = [1, 2, 3];

    const any = Enumerable.any(source);

    expect(any).toBe(true);
  });

  test('Returns false if the sequence is empty', () => {
    const source: number[] = [];

    const any = Enumerable.any(source);

    expect(any).toBe(false);
  });

  test('Returns true if the sequence contains any items that match the predicate', () => {
    const source = [1, 2, 3];

    const any = Enumerable.any(source, (item) => item === 2);

    expect(any).toBe(true);
  });

  test('Returns false if the sequence is not empty and no item matching the predicate is found', () => {
    const source = [1, 2, 3];

    const any = Enumerable.any(source, () => false);

    expect(any).toBe(false);
  });
});

describe('Enumerable.all', () => {
  test('Returns true if the sequence is empty', () => {
    const source: number[] = [];

    const all = Enumerable.all(source, (item) => item > 0);

    expect(all).toBe(true);
  });

  test('Returns true if the sequence contains all items that match the predicate', () => {
    const source = [1, 2, 3];

    const all = Enumerable.all(source, (item) => item > 0);

    expect(all).toBe(true);
  });

  test('Returns false if the sequence is not empty and no item matching the predicate is found', () => {
    const source = [1, 2, 3];

    const all = Enumerable.all(source, (item) => item > 1);

    expect(all).toBe(false);
  });
});
describe('Enumerable.contains', () => {
  test('Returns true if the sequence contains the item', () => {
    const source = [1, 2, 3];

    const contains = Enumerable.contains(source, 2);

    expect(contains).toBe(true);
  });

  test('Returns false if the sequence is empty', () => {
    const source: number[] = [];

    const contains = Enumerable.contains(source, 2);

    expect(contains).toBe(false);
  });

  test('Returns false if the sequence is not empty and the item is not found', () => {
    const source = [1, 2, 3];

    const contains = Enumerable.contains(source, 4);

    expect(contains).toBe(false);
  });
});

describe('Enumerable.aggregate', () => {
  test('Returns the result of the aggregation', () => {
    const source = [1, 2, 3];

    const aggregate = Enumerable.aggregate(source, (acc, item) => acc + item);

    expect(aggregate).toBe(6);
  });

  test('First item in the accumulatorFn is the first item in the source, if seed is nil', () => {
    const source = [1];

    const aggregate = Enumerable.aggregate(source, (acc, item) => acc);

    expect(aggregate).toBe(1);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.aggregate(source, () => 0);

    expect(action).toThrowError();
  });

  test('Throws if the accumulator is not provided', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.aggregate(source, null!);

    expect(action).toThrowError();
  });

  test('First item in the accumulatorFn is the seed, if seed is provided', () => {
    const source = [1];

    const aggregate = Enumerable.aggregate(source, (acc, item) => acc, 0);

    expect(aggregate).toBe(0);
  });

  test('Accumulates value using the seed provided', () => {
    const source = [1, 2, 3];

    const aggregate = Enumerable.aggregate(
      source,
      (acc, item) => acc + item,
      0
    );

    expect(aggregate).toBe(6);
  });

  test('Returns the selected result, if resultSelector is provided', () => {
    const source = [1, 2, 3];

    const aggregate = Enumerable.aggregate(
      source,
      (acc, item) => acc + item,
      0,
      (acc) => acc + 1
    );

    expect(aggregate).toBe(7);
  });
});

describe('Enumerable.max', () => {
  test('Returns the maximum value in the sequence using > if the compareFn is null', () => {
    const source = [1, 2, 3];

    const max = Enumerable.max(source);

    expect(max).toBe(3);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.max(source);

    expect(action).toThrowError();
  });

  test('Throws if the compareFn is null', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.max(source, null!);

    expect(action).toThrowError();
  });

  test('Returns the maximum value in the sequence using the compareFn', () => {
    const source = [1, 2, 3];

    const max = Enumerable.max(source, (a, b) => -1);

    expect(max).toBe(1);
  });
});

describe('Enumerable.maxBy', () => {
  it('returns the maximum element', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const max = Enumerable.maxBy(source, (e) => e.id);

    expect(max).toEqual(3);
  });

  it('throws if the source is null', () => {
    const action = () => Enumerable.maxBy(null!, (e) => {});

    expect(action).toThrowError();
  });

  it('throws if the selector is null', () => {
    const action = () => Enumerable.maxBy([{ id: 1 }], null!);

    expect(action).toThrowError();
  });

  it('throws sequence is empty', () => {
    const action = () => Enumerable.maxBy([], (e) => {});

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];

    const max = Enumerable.maxBy(
      source,
      (e) => e.id,
      (a, b) => a.value - b.value
    );

    expect(max).toEqual({ value: 3 });
  });
});

describe('Enumerable.min', () => {
  test('Returns the minimum value in the sequence using > if the compareFn is null', () => {
    const source = [1, 2, 3];

    const min = Enumerable.min(source);

    expect(min).toBe(1);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.min(source);

    expect(action).toThrowError();
  });

  test('Throws if the compareFn is null', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.min(source, null!);

    expect(action).toThrowError();
  });

  test('Returns the minimum value in the sequence using the compareFn', () => {
    const source = [1, 2, 3];

    const min = Enumerable.min(source, (a, b) => -1);

    expect(min).toBe(3);
  });
});

describe('Enumerable.minBy', () => {
  it('returns the minimum element', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const max = Enumerable.minBy(source, (e) => e.id);

    expect(max).toEqual(1);
  });

  it('throws if the source is null', () => {
    const action = () => Enumerable.minBy(null!, (e) => {});

    expect(action).toThrowError();
  });

  it('throws if the selector is null', () => {
    const action = () => Enumerable.minBy([{ id: 1 }], null!);

    expect(action).toThrowError();
  });

  it('throws sequence is empty', () => {
    const action = () => Enumerable.minBy([], (e) => {});

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];

    const max = Enumerable.minBy(
      source,
      (e) => e.id,
      (a, b) => -1
    );

    expect(max).toEqual({ value: 3 });
  });
});

describe('Enumerable.sum', () => {
  test('Returns the sum of the sequence', () => {
    const source = [1, 2, 3];

    const sum = Enumerable.sum(source);

    expect(sum).toBe(6);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.sum(source);

    expect(action).toThrowError();
  });

  test('Returns the sum of the sequence using the provided selector', () => {
    const source = [{ foo: 1 }, { foo: 2 }, { foo: 3 }];

    const sum = Enumerable.sum(source, (item) => item.foo);

    expect(sum).toBe(6);
  });
});

describe('Enumerable.append', () => {
  test('Returns the sequence with the item appended', () => {
    const source = [1, 2, 3];

    const append = Enumerable.append(source, 4).toArray();

    expect(append).toEqual([1, 2, 3, 4]);
  });

  test('Returns a sequence with the single element, if the sequence is empty', () => {
    const source = Enumerable.empty<number>();

    const append = Enumerable.append(source, 1);
    const first = Enumerable.first(append);

    expect(first).toBe(1);
  });
});

describe('Enumerable.prepend', () => {
  it('returns the sequence with the element prepended', () => {
    const source = [1, 2, 3, 4, 5];

    const prepend = Enumerable.prepend(source, 0).toArray();

    expect(prepend).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe('Enumerable.toArray', () => {
  test('Returns the sequence as an array', () => {
    const source = [1, 2, 3];

    const array = Enumerable.toArray(source);

    expect(array).toEqual([1, 2, 3]);
  });

  test('Returns an empty array, if the sequence is empty', () => {
    const source = Enumerable.empty<number>();

    const array = Enumerable.toArray(source);

    expect(array).toEqual([]);
  });

  test('Indexing the array, will return the first element of the sequence', () => {
    const source = [1, 2, 3];

    const array = Enumerable.toArray(source);

    expect(array[0]).toBe(1);
  });

  test('Array enumerator will return all elements of the sequence', () => {
    const source = [1, 2, 3];
    const array = Enumerable.toArray(source);

    const enumerator = array.getEnumerator();

    expect(enumerator.moveNext()).toBe(true);
    expect(enumerator.current).toBe(1);
    expect(enumerator.moveNext()).toBe(true);
    expect(enumerator.current).toBe(2);
    expect(enumerator.moveNext()).toBe(true);
    expect(enumerator.current).toBe(3);
    expect(enumerator.moveNext()).toBe(false);
  });
});

describe('Enumerable.toMap', () => {
  test('Returns the sequence as a map where the key is generated through the key selector', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const map = Enumerable.toMap(source, (element) => element.id);

    const expected = new Map();
    expected.set(1, { id: 1 });
    expected.set(2, { id: 2 });
    expected.set(3, { id: 3 });

    expect(map).toEqual(expected);
  });

  test('Returns the sequence as a map where the key and value are generated through the key selector', () => {
    const source = [
      { name: 'Frank', id: 1 },
      { name: 'Melissa', id: 2 },
      { name: 'John', id: 3 },
    ];

    const map = Enumerable.toMap(
      source,
      (element) => element.id,
      (element) => element.name
    );

    const expected = new Map();
    expected.set(1, 'Frank');
    expected.set(2, 'Melissa');
    expected.set(3, 'John');

    expect(map).toEqual(expected);
  });

  test('Throws if the keySelector is null', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const action = () => Enumerable.toMap(source, null!);

    expect(action).toThrowError();
  });

  test('Throws if the key selector produces a key that is null', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const action = () => Enumerable.toMap(source, (element) => null!);

    expect(action).toThrowError();
  });
});

describe('Enumerable.toSet', () => {
  test('Returns the sequence as a set', () => {
    const source = [1, 2, 3];

    const set = Enumerable.toSet(source);

    expect(set).toEqual(new Set([1, 2, 3]));
  });
});

describe('Enumerable.chunk', () => {
  test('Returns the sequence as a sequence of arrays of the specified size', () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const chunked = Enumerable.chunk(source, 3).toArray();

    expect(chunked).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  test('Returns the last chunk partially, if it has at least one element', () => {
    const source = [1];

    const chunked = Enumerable.chunk(source, 2).toArray().single();

    expect(chunked).toEqual([1]);
  });

  test('Throws if the size is less than 1', () => {
    const source = [1];

    const action = () => Enumerable.chunk(source, 0);

    expect(action).toThrowError();
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.chunk(source, 1).single();

    expect(action).toThrowError();
  });
});

describe('Enumerable.chunkOrDefault', () => {
  test('Returns a sequence of chunks of the specified size', () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const chunked = Enumerable.chunkOrDefault(source, 3).toArray();

    expect(chunked).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  test('Returns a sequence with a null value, if the chunk does not meet the size requirement', () => {
    const source = [1, 2, 3];

    const chunked = Enumerable.chunkOrDefault(source, 2).toArray();

    expect(chunked).toEqual([[1, 2], null]);
  });

  test('Returns a sequence with a default value, if the chunk does not meet the size requirement', () => {
    const source = [1, 2, 3];

    const chunked = Enumerable.chunkOrDefault(source, 2, [3, 4]).toArray();

    expect(chunked).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('Returns an empty sequence, if the sequence is empty', () => {
    const source: number[] = [];

    const chunked = Enumerable.chunkOrDefault(source, 1).toArray();

    expect(chunked).toEqual([]);
  });

  test('Throws if the count is less than 1', () => {
    const source = [1];

    const action = () => Enumerable.chunkOrDefault(source, 0);

    expect(action).toThrowError();
  });
});

describe('Enumerable.chain', () => {
  test('Returns the concatenation of the two sequences', () => {
    const source1 = [1, 2, 3];
    const source2 = [4, 5, 6];

    const concatenated = Enumerable.chain(source1, source2).toArray();

    expect(concatenated).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('Throws if the sequence is null', () => {
    const source1: number[] = null!;
    const source2: number[] = null!;

    const action = () => Enumerable.chain(source1, source2).toArray();

    expect(action).toThrowError();
  });
});

describe('Enumerable.forElement', () => {
  it('Enumerates through the sequence, calling the provided callback for each element', () => {
    const source = [1, 2, 3];

    const callback = jest.fn();

    Enumerable.forElement(source, callback);

    expect(callback.mock.calls).toEqual([[1], [2], [3]]);
  });

  it('Throws if the callback is null', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.forElement(source, null!);

    expect(action).toThrowError();
  });

  it('Throws if the callback throws', () => {
    const source = [1, 2, 3];

    const action = () =>
      Enumerable.forElement(source, () => {
        throw new Error();
      });

    expect(action).toThrowError();
  });
});

describe('Enumerable.distinct', () => {
  it('Returns the sequence with distinct elements', () => {
    const source = [1, 2, 3, 1, 2, 3];

    const distinct = Enumerable.distinct(source).toArray();

    expect(distinct).toEqual([1, 2, 3]);
  });

  it('Returns the sequence with distinct elements, using the specified equality comparer', () => {
    const source = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    const distinct = Enumerable.distinct(
      source,
      (a, b) => a.id === b.id
    ).toArray();

    expect(distinct).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});

describe('Enumerable.distinctBy', () => {
  it('Returns the sequence with distinct elements, using the specified key selector', () => {
    const source = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    const distinct = Enumerable.distinctBy(
      source,
      (element) => element.id
    ).toArray();

    expect(distinct).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('Returns the sequence with distinct elements, using the specified equality comparer', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];

    const distinct = Enumerable.distinctBy(
      source,
      (element) => element.id,
      (a, b) => a.value === b.value
    ).toArray();

    expect(distinct).toEqual([
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ]);
  });

  it('Throws if the key selector is null', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.distinctBy(source, null!);

    expect(action).toThrowError();
  });
});

describe('Enumerable.elementAt', () => {
  it('returns the element at the specified index', () => {
    const source = [1, 2, 3];

    const element = Enumerable.elementAt(source, 1);

    expect(element).toBe(2);
  });

  it('throws if the index is out of range', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.elementAt(source, 3);

    expect(action).toThrowError();
  });

  it('throws if the index is less than zero', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.elementAt(source, -1);

    expect(action).toThrowError();
  });
});

describe('Enumerable.elementAtOrDefault', () => {
  it('returns the element at the specified index', () => {
    const source = [1, 2, 3];

    const element = Enumerable.elementAtOrDefault(source, 1);

    expect(element).toBe(2);
  });

  it('returns the default value if the index is out of range', () => {
    const source = [1, 2, 3];

    const element = Enumerable.elementAtOrDefault(source, 3, 4);

    expect(element).toBe(4);
  });

  it('returns the default value if the index is less than zero', () => {
    const source = [1, 2, 3];

    const element = Enumerable.elementAtOrDefault(source, -1, 4);

    expect(element).toBe(4);
  });

  it('returns null if the default value is not specified and the element does not exist', () => {
    const source = [1, 2, 3];

    const element = Enumerable.elementAtOrDefault(source, 3);

    expect(element).toBe(null);
  });
});

describe('Enumerable.except', () => {
  it('returns the sequence without the specified elements', () => {
    const source = [1, 2, 3];

    const except = Enumerable.except(source, [2, 3]).toArray();

    expect(except).toEqual([1]);
  });

  it('throws if the specified elements are null', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.except(source, null!);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const except = Enumerable.except(
      source,
      [{ id: 2 }, { id: 3 }],
      (a, b) => a.id === b.id
    ).toArray();

    expect(except).toEqual([{ id: 1 }]);
  });
});

describe('Enumerable.exceptBy', () => {
  it('returns the sequence without the specified elements', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const except = Enumerable.exceptBy(
      source,
      [{ id: 2 }, { id: 3 }],
      (e) => e.id
    ).toArray();

    expect(except).toEqual([{ id: 1 }]);
  });

  it('throws if the specified elements are null', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const action = () => Enumerable.exceptBy(source, null!, (e) => e.id);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];

    const except = Enumerable.exceptBy(
      source,
      [{ id: { value: 2 } }, { id: { value: 3 } }],
      (e) => e.id,
      (a, b) => a.value === b.value
    ).toArray();

    expect(except).toEqual([{ id: { value: 1 } }]);
  });
});

describe('Enumerable.zip', () => {
  it('returns the sequence of tuples', () => {
    const source = [1, 2, 3];

    const zipped = Enumerable.zip(source, [4, 5, 6], (first, second) => [
      first,
      second,
    ]).toArray();

    expect(zipped).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it('throws if the second sequence is null', () => {
    const action = () => Enumerable.zip([1, 2, 3], null!, () => null);

    expect(action).toThrowError();
  });

  it('throws if the result selector is null', () => {
    const action = () => Enumerable.zip([1, 2, 3], null!, () => null);

    expect(action).toThrowError();
  });
});

describe('Enumerable.union', () => {
  it('returns the sequence of unique elements', () => {
    const source = [1, 2, 3];

    const union = Enumerable.union(source, [2, 3, 4]).toArray();

    expect(union).toEqual([1, 2, 3, 4]);
  });

  it('throws if the second sequence is null', () => {
    const action = () => Enumerable.union([1, 2, 3], null!);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const union = Enumerable.union(
      source,
      [{ id: 2 }, { id: 3 }],
      (a, b) => a.id === b.id
    ).toArray();

    expect(union).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});

describe('Enumerable.unionBy', () => {
  it('returns the sequence of unique elements', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const union = Enumerable.unionBy(
      source,
      [{ id: 2 }, { id: 3 }],
      (e) => e.id
    ).toArray();

    expect(union).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('throws if the second sequence is null', () => {
    const action = () => Enumerable.unionBy([1, 2, 3], null!, (e) => e);

    expect(action).toThrowError();
  });

  it('throws if the result selector is null', () => {
    const action = () => Enumerable.unionBy([1, 2, 3], [], null!);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];

    const union = Enumerable.unionBy(
      source,
      [{ id: { value: 2 } }, { id: { value: 3 } }],
      (e) => e.id,
      (a, b) => a.value === b.value
    ).toArray();

    expect(union).toEqual([
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ]);
  });
});

describe('Enumerable.range', () => {
  it('returns the sequence of numbers', () => {
    const range = Enumerable.range(1, 3).toArray();

    expect(range).toEqual([1, 2, 3]);
  });

  it('throws if the from is null', () => {
    const action = () => Enumerable.range(null!, 3);

    expect(action).toThrowError();
  });

  it('throws if the to is null', () => {
    const action = () => Enumerable.range(1, null!);

    expect(action).toThrowError();
  });

  it('throws if to is greater than from', () => {
    const action = () => Enumerable.range(1, -1);

    expect(action).toThrowError();
  });
});

describe('Enumerable.take', () => {
  it('returns the sequence of the first n elements', () => {
    const source = [1, 2, 3, 4, 5];

    const take = Enumerable.take(source, 3).toArray();

    expect(take).toEqual([1, 2, 3]);
  });

  it('returns an empty enumerable if count is null or less than or equal to 0', () => {
    const source = [1, 2, 3, 4, 5];

    const take = Enumerable.take(source, null!).toArray();

    expect(take).toEqual([]);

    const take2 = Enumerable.take(source, 0).toArray();

    expect(take2).toEqual([]);
  });
});

describe('Enumerable.takeWhile', () => {
  it('returns the sequence of the first n elements', () => {
    const source = [1, 2, 3, 4, 5];

    const take = Enumerable.takeWhile(source, (e) => e < 3).toArray();

    expect(take).toEqual([1, 2]);
  });

  it('throws an an exception if predicate is null', () => {
    const source = [1, 2, 3, 4, 5];

    const action = () => Enumerable.takeWhile(source, null!).toArray();

    expect(action).toThrowError();
  });

  it("calls the predicate with the current element and it's index", () => {
    const source = [1, 2];
    const cb = jest.fn(() => true);

    Enumerable.takeWhile(source, cb).toArray();

    expect(cb.mock.calls).toEqual([
      [1, 0],
      [2, 1],
    ]);
  });
});

describe('Enumerable.takeLast', () => {
  it('returns the sequence of the last n elements', () => {
    const source = [1, 2, 3, 4, 5];

    const take = Enumerable.takeLast(source, 3).toArray();

    expect(take).toEqual([3, 4, 5]);
  });

  it('returns an empty enumerable if count is null or less than or equal to 0', () => {
    const source = [1, 2, 3, 4, 5];

    const take = Enumerable.takeLast(source, null!).toArray();

    expect(take).toEqual([]);

    const take2 = Enumerable.takeLast(source, 0).toArray();

    expect(take2).toEqual([]);
  });
});

describe('Enumerable.skip', () => {
  it('returns the sequence of the elements after the first n elements', () => {
    const source = [1, 2, 3, 4, 5];

    const skip = Enumerable.skip(source, 3).toArray();

    expect(skip).toEqual([4, 5]);
  });

  it('returns an empty enumerable if count is null or less than or equal to 0', () => {
    const source = [1, 2, 3, 4, 5];

    const skip = Enumerable.skip(source, null!).toArray();

    expect(skip).toEqual([]);

    const skip2 = Enumerable.skip(source, 0).toArray();

    expect(skip2).toEqual([]);
  });
});

describe('Enumerable.skipWhile', () => {
  it('skips all elements until the predicate returns false', () => {
    const source = [1, 2, 3, 4, 5];

    const skipWhile = Enumerable.skipWhile(source, (e) => e < 3).toArray();

    expect(skipWhile).toEqual([3, 4, 5]);
  });

  it('throws an an exception if predicate is null', () => {
    const source: number[] = [];

    const action = () => Enumerable.skipWhile(source, null!).toArray();

    expect(action).toThrowError();
  });

  it("calls the predicate with the current element and it's index", () => {
    const source = [1, 2];
    const cb = jest.fn(() => true);

    Enumerable.skipWhile(source, cb).toArray();

    expect(cb.mock.calls).toEqual([
      [1, 0],
      [2, 1],
    ]);
  });
});

describe('Enumerable.skipLast', () => {
  it('returns a sequence that contains all elements of source with the last n elements omitted', () => {
    const source = [1, 2, 3, 4, 5];

    const skipLast = Enumerable.skipLast(source, 3).toArray();

    expect(skipLast).toEqual([1, 2]);
  });

  it('returns all elements of the sequence if the count is 0 or null', () => {
    const source = [1, 2, 3];

    const skipLast = Enumerable.skipLast(source, null!).toArray();

    expect(skipLast).toEqual([1, 2, 3]);

    const skipLast2 = Enumerable.skipLast(source, 0).toArray();

    expect(skipLast2).toEqual([1, 2, 3]);
  });

  it("returns an empty enumerable if the skip count is greater than the sequence's length", () => {
    const source = [1, 2, 3];

    const skipLast = Enumerable.skipLast(source, 4).toArray();

    expect(skipLast).toEqual([]);
  });
});

describe('Enumerable.sequenceEqual', () => {
  it('returns true if the sequences are equal', () => {
    const source = [1, 2, 3, 4, 5];
    const other = [1, 2, 3, 4, 5];

    const equal = Enumerable.sequenceEqual(source, other);

    expect(equal).toBe(true);
  });

  it('returns false if the sequences are not equal', () => {
    const source = [1, 2, 3, 4, 5];
    const other = [1, 2, 3, 4, 6];

    const equal = Enumerable.sequenceEqual(source, other);

    expect(equal).toBe(false);
  });

  it('throws if the second sequence is null', () => {
    const action = () => Enumerable.sequenceEqual([1, 2, 3], null!);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];
    const other = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];

    const equal = Enumerable.sequenceEqual(
      source,
      other,
      (a, b) => a.id.value === b.id.value
    );

    expect(equal).toBe(true);
  });
});

describe('Enumerable.ofType', () => {
  it('returns the sequence of elements that are of the primitive type', () => {
    const source = [1, 2, 'foo', 'bar', {}, [], true, false, null, undefined];

    const ofType = Enumerable.ofType(source, String).toArray();

    expect(ofType).toEqual(['foo', 'bar']);
  });

  it('returns the sequence of elements that inherit from the type', () => {
    class Super {
      super = true;
    }

    class Base {
      base = true;
    }
    class SuperWithBase extends Base {
      superBase = true;
    }

    const source = [new Base(), new Super(), new SuperWithBase()];

    const ofType = Enumerable.ofType(source, Base).toArray();

    expect(ofType).toEqual([new Base(), new SuperWithBase()]);
  });

  it('throws if the type is null', () => {
    const action = () =>
      Enumerable.ofType(
        [1, 2, 'foo', 'bar', {}, [], true, false, null, undefined],
        null!
      );

    expect(action).toThrowError();
  });
});

describe('Enumerable.intersect', () => {
  it('returns the sequence of elements that are in both sequences', () => {
    const source = [1, 2, 3, 4, 5];
    const other = [3, 4, 5, 6, 7];

    const intersect = Enumerable.intersect(source, other).toArray();

    expect(intersect).toEqual([3, 4, 5]);
  });

  it('throws if the second sequence is null', () => {
    const action = () => Enumerable.intersect([1, 2, 3], null!);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const other = [{ id: 1 }, { id: 3 }];

    const intersect = Enumerable.intersect(
      source,
      other,
      (a, b) => a.id === b.id
    ).toArray();

    expect(intersect).toEqual([{ id: 1 }, { id: 3 }]);
  });
});

describe('Enumerable.intersectBy', () => {
  it('returns the sequence of elements that are in both sequences', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const other = [{ id: 1 }, { id: 3 }];

    const intersect = Enumerable.intersectBy(
      source,
      other,
      (e) => e.id
    ).toArray();

    expect(intersect).toEqual([{ id: 1 }, { id: 3 }]);
  });

  it('throws if the second sequence is null', () => {
    const action = () => Enumerable.intersectBy([1, 2, 3], null!, (e) => e);

    expect(action).toThrowError();
  });

  it('throws if the key selector is null', () => {
    const action = () => Enumerable.intersectBy([1, 2, 3], null!, (e) => e);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const source = [
      { id: { value: 1 } },
      { id: { value: 2 } },
      { id: { value: 3 } },
    ];
    const other = [{ id: { value: 1 } }, { id: { value: 3 } }];

    const intersect = Enumerable.intersectBy(
      source,
      other,
      (e) => e.id,
      (a, b) => a.value === b.value
    ).toArray();

    expect(intersect).toEqual([{ id: { value: 1 } }, { id: { value: 3 } }]);
  });
});

describe('Enumerable.selectMany', () => {
  it('returns a flattened sequence from the selected property', () => {
    const source = [
      { name: 'Michael', friends: ['Matt', 'Jeff'] },
      { name: 'Ian', friends: ['Ben'] },
    ];

    const selectMany = Enumerable.selectMany(
      source,
      (e) => e.friends
    ).toArray();

    expect(selectMany).toEqual(['Matt', 'Jeff', 'Ben']);
  });

  it('throws if the collection selector is null', () => {
    const action = () => Enumerable.selectMany([1, 2, 3], null!, (e) => e);

    expect(action).toThrowError();
  });

  it('uses an optional key selector to select the key for the element', () => {
    const source = [
      { name: 'Michael', friends: [{ name: 'Matt' }, { name: 'Jeff' }] },
      { name: 'Ian', friends: [{ name: 'Ben' }] },
    ];

    const selectMany = Enumerable.selectMany(
      source,
      (e) => e.friends,
      (e) => e.name
    ).toArray();

    expect(selectMany).toEqual(['Matt', 'Jeff', 'Ben']);
  });

  it("flattens a sequence with an 'empty' collection selector", () => {
    const source = [[1, 2, 3], [4], [5, 6]];

    const selectMany = Enumerable.selectMany(source, (e) => e).toArray();

    expect(selectMany).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('Enumerable.reverse', () => {
  it('returns the sequence in reverse', () => {
    const source = [1, 2, 3, 4, 5];

    const reverse = Enumerable.reverse(source).toArray();

    expect(reverse).toEqual([5, 4, 3, 2, 1]);
  });
});

describe('Enumerable.join', () => {
  it('joins the elements of the sequence with the elements of the other sequence', () => {
    const magnus = { name: 'Hedlund, Magnus' };
    const terry = { name: 'Adams, Terry' };
    const charlotte = { name: 'Weiss, Charlotte' };

    const barley = { name: 'Barley', owner: terry };
    const boots = { name: 'Boots', owner: terry };
    const whiskers = { name: 'Whiskers', owner: charlotte };
    const daisy = { name: 'Daisy', owner: magnus };

    const people = [magnus, terry, charlotte];
    const pets = [barley, boots, whiskers, daisy];

    const joined = Enumerable.innerJoin(
      people,
      pets,
      (p) => p,
      (p) => p.owner,
      (person, pet) => ({ ownerName: person.name, pet: pet.name })
    ).toArray();

    expect(joined).toEqual([
      { ownerName: 'Hedlund, Magnus', pet: 'Daisy' },
      { ownerName: 'Adams, Terry', pet: 'Barley' },
      { ownerName: 'Adams, Terry', pet: 'Boots' },
      { ownerName: 'Weiss, Charlotte', pet: 'Whiskers' },
    ]);
  });

  it('returns an empty sequence if `inner` is empty', () => {
    const people = Enumerable.empty<{ name: string }>();
    const pets = [{ name: 'Barley', owner: '' }];

    const joined = Enumerable.innerJoin(
      people,
      pets,
      (p) => p,
      (p) => p,
      (person, pet) => ({ ownerName: person.name, pet: pet.name })
    ).toArray();

    expect(joined).toEqual([]);
  });

  it('returns an empty sequence if `outer` is empty', () => {
    const people = Enumerable.empty<{ name: string }>();
    const pets = Enumerable.empty<{ name: string }>();

    const joined = Enumerable.innerJoin(
      people,
      pets,
      (p) => p,
      (p) => p,
      (person, pet) => ({ ownerName: person.name, pet: pet.name })
    ).toArray();

    expect(joined).toEqual([]);
  });

  it('throws if `inner is null`', () => {
    const action = () =>
      Enumerable.innerJoin(null!, null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `outer is null`', () => {
    const action = () =>
      Enumerable.innerJoin(null!, null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `outerKeySelector is null`', () => {
    const action = () =>
      Enumerable.innerJoin(null!, null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `innerKeySelector is null`', () => {
    const action = () =>
      Enumerable.innerJoin(null!, null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `resultSelector is null`', () => {
    const action = () =>
      Enumerable.innerJoin(null!, null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const inner = [1];
    const outer = [2];

    const equalityComparer = jest.fn(() => true);

    Enumerable.innerJoin(
      inner,
      outer,
      (i) => i,
      (o) => o,
      (i, o) => `${i} + ${o}`,
      equalityComparer
    ).toArray();

    expect(equalityComparer).toBeCalledTimes(1);
  });
});

describe('Enumerable.groupJoin', () => {
  it('joins the elements of the sequence with the elements of the other sequence', () => {
    const magnus = { name: 'Hedlund, Magnus' };
    const terry = { name: 'Adams, Terry' };
    const charlotte = { name: 'Weiss, Charlotte' };

    const barley = { name: 'Barley', owner: terry };
    const boots = { name: 'Boots', owner: terry };
    const whiskers = { name: 'Whiskers', owner: charlotte };
    const daisy = { name: 'Daisy', owner: magnus };

    const people = [magnus, terry, charlotte];
    const pets = [barley, boots, whiskers, daisy];

    const joined = Enumerable.groupJoin(
      people,
      pets,
      (p) => p,
      (p) => p.owner,
      (person, pet) => ({
        ownerName: person.name,
        pet: pet.select((x) => x.name).toArray(),
      })
    ).toArray();

    expect(joined).toEqual([
      { ownerName: 'Hedlund, Magnus', pet: ['Daisy'] },
      { ownerName: 'Adams, Terry', pet: ['Barley', 'Boots'] },
      { ownerName: 'Weiss, Charlotte', pet: ['Whiskers'] },
    ]);
  });

  it('throws if `inner` is null', () => {
    const action = () =>
      Enumerable.groupJoin(null!, null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `outer` is null', () => {
    const action = () => Enumerable.groupJoin([], null!, null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `outerKeySelector is null`', () => {
    const action = () => Enumerable.groupJoin([], [], null!, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `innerKeySelector is null`', () => {
    const action = () =>
      Enumerable.groupJoin([], [], () => false, null!, null!);

    expect(action).toThrowError();
  });

  it('throws if `resultSelector is null`', () => {
    const action = () =>
      Enumerable.groupJoin(
        [],
        [],
        () => false,
        () => false,
        null!
      );

    expect(action).toThrowError();
  });

  it('uses the specified equality comparer if provided', () => {
    const inner = [1];
    const outer = [2];

    const equalityComparer = jest.fn(() => true);

    Enumerable.groupJoin(
      inner,
      outer,
      (i) => i,
      (o) => o,
      (i, o) => `${i} + ${o}`,
      equalityComparer
    ).toArray();

    expect(equalityComparer).toBeCalledTimes(1);
  });
});

describe('Enumerable.groupBy', () => {
  const pets = [
    { name: 'Barley', age: 8.3 },
    { name: 'Boots', age: 4.9 },
    { name: 'Whiskers', age: 1.5 },
    { name: 'Daisy', age: 4.3 },
  ];

  it('groups the elements of a sequence according to a specified key selector function', () => {
    const grouped = Enumerable.groupBy(pets, (pet) =>
      Math.floor(pet.age)
    ).toArray();

    expect(grouped).toEqual([
      { key: 8, elements: [{ name: 'Barley', age: 8.3 }] },
      {
        key: 4,
        elements: [
          { name: 'Boots', age: 4.9 },
          { name: 'Daisy', age: 4.3 },
        ],
      },
      { key: 1, elements: [{ name: 'Whiskers', age: 1.5 }] },
    ]);
  });

  it('groups the elements of a sequence according to a specified key selector function and projects the elements for each group by using a specified function', () => {
    const grouped = Enumerable.groupBy(
      pets,
      (pet) => Math.floor(pet.age),
      (age, pets) => ({ age, count: pets.count() })
    ).toArray();

    expect(grouped).toEqual([
      { age: 8, count: 1 },
      { age: 4, count: 2 },
      { age: 1, count: 1 },
    ]);
  });

  it("groups the elements of a sequence according to a key selector function. The keys are compared by using a comparer and each group's elements are projected by using a specified function.", () => {
    const grouped = Enumerable.groupBy(
      pets,
      (pet) => Math.floor(pet.age),
      (pet) => pet.name,
      (age, petNames) => ({
        age,
        names: Enumerable.joinBy(petNames, ', '),
      })
    ).toArray();

    expect(grouped).toEqual([
      { age: 8, names: 'Barley' },
      { age: 4, names: 'Boots, Daisy' },
      { age: 1, names: 'Whiskers' },
    ]);
  });

  it('throws if `keySelector is null`', () => {
    const action = () => Enumerable.groupBy(pets, null!);

    expect(action).toThrowError();
  });

  it('uses the specified key equality comparer if provided', () => {
    const equalityComparer = jest.fn(() => true);

    Enumerable.groupBy(pets, (pet) => pet.age, equalityComparer).toArray();

    expect(equalityComparer).toBeCalled();
  });
});

describe('Enumerable.toAwaitable', () => {
  it('returns a promise that resolves to an array of the sequence', () => {
    const promise = Enumerable.toAwaitable(Enumerable.range(1, 3));

    expect(promise).resolves.toEqual([1, 2, 3]);
  });

  it('returns a promise that resolves to an array of the awaited values of the sequence', () => {
    const promise = Enumerable.toAwaitable(
      Enumerable.range(1, 3).select((x) => Promise.resolve(x))
    );

    expect(promise).resolves.toEqual([1, 2, 3]);
  });

  it('resolves to an empty enumerable if the sequence is empty', () => {
    const promise = Enumerable.toAwaitable(Enumerable.empty<number>());

    expect(promise).resolves.toEqual([]);
  });

  it('throws if the sequence rejects', async () => {
    const element = () => new Promise((_, r) => r('Oh no'));
    try {
      const result = await Enumerable.toAwaitable([element()]);
      fail('Expected to throw');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});

describe('Enumerable.joinBy', () => {
  it('joins the elements of a sequence to a string by using a specified separator', () => {
    const result = Enumerable.joinBy([1, 2, 3], ', ');

    expect(result).toEqual('1, 2, 3');
  });

  it('uses " " as the default separator', () => {
    const result = Enumerable.joinBy([1, 2, 3]);

    expect(result).toEqual('123');
  });

  it('returns an empty string if the sequence is empty', () => {
    const result = Enumerable.joinBy([]);

    expect(result).toEqual('');
  });
});

describe('Enumerable.', () => {});

describe('Enumerable.', () => {});

describe('Enumerable.', () => {});

describe('Enumerable.', () => {});
