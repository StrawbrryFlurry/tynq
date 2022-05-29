import { Enumerable, IEnumerable } from '@ts-linq/core';

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

  test('Returns the correct count of all items in the enumerator', () => {
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
  test('Returns a single item, if the enumerator yields only one item', () => {
    const source = [1];

    const single = Enumerable.single(source);

    expect(single).toBe(1);
  });

  test('Throws if the enumerator yields more than one item', () => {
    const source = [1, 2];

    const action = () => Enumerable.single(source);

    expect(action).toThrowError();
  });

  test('Throws if the enumerator yields no items', () => {
    const source: number[] = [];

    const action = () => Enumerable.single(source);

    expect(action).toThrowError();
  });

  test('Returns the single item that matches the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.single(source, (item) => item === 2);

    expect(single).toBe(2);
  });

  test('Throws if the enumerator yields no items that match the predicate', () => {
    const source: number[] = [1, 2, 3];

    const action = () => Enumerable.single(source, () => false);

    expect(action).toThrowError();
  });

  test('Throws if the enumerator yields more than one item that matches the predicate', () => {
    const source: number[] = [1, 2, 3];

    const action = () => Enumerable.single(source, () => true);

    expect(action).toThrowError();
  });
});

describe('Enumerable.singleOrNull', () => {
  test('Returns single item, if the enumerator yields only one item', () => {
    const source = [1];

    const single = Enumerable.singleOrNull(source);

    expect(single).toBe(1);
  });

  test('Returns null if the enumerator yields more than one item', () => {
    const source = [1, 2];

    const single = Enumerable.singleOrNull(source);

    expect(single).toBeNull();
  });

  test('Returns null if the enumerator yields no items', () => {
    const source: number[] = [];

    const single = Enumerable.singleOrNull(source);

    expect(single).toBeNull();
  });

  test('Returns the single item that matches the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrNull(source, (item) => item === 2);

    expect(single).toBe(2);
  });

  test('Returns null if the enumerator yields no items that match the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrNull(source, () => false);

    expect(single).toBeNull();
  });

  test('Returns null if the enumerator yields more than one item that matches the predicate', () => {
    const source: number[] = [1, 2, 3];

    const single = Enumerable.singleOrNull(source, () => true);

    expect(single).toBeNull();
  });
});

describe('Enumerable.where', () => {
  test("Where filters out items that don't match the predicate", () => {
    const source = [1, 2, 3];

    const filtered = Enumerable.where(source, (item) => item > 1);

    const enumerator = filtered.getEnumerator();
    enumerator.moveNext();
    expect(enumerator.current).toBe(2);

    enumerator.moveNext();
    expect(enumerator.current).toBe(3);
  });

  test('Where calls the predicate function for every enumerated item', () => {
    const source = [1, 2, 3];
    const mockPredicate = jest.fn((item) => item > 1);

    const enumerable = Enumerable.where(source, mockPredicate);
    const enumerator = enumerable.getEnumerator();
    enumerator.moveNext();
    enumerator.moveNext();
    enumerator.moveNext();

    expect(mockPredicate).toHaveBeenCalledTimes(3);
  });
});

describe('Enumerable.first', () => {
  test('Returns the first item in the sequence', () => {
    const source = [1, 2, 3];

    const first = Enumerable.first(source);

    expect(first).toBe(1);
  });

  test('Throws if the sequence is empty', () => {
    const source: number[] = [];

    const action = () => Enumerable.first(source);

    expect(action).toThrowError();
  });

  test('Returns the first item that matches the predicate', () => {
    const source = [1, 2, 3];

    const first = Enumerable.first(source, (item) => item === 2);

    expect(first).toBe(2);
  });

  test('Throws if the sequence is not empty and the predicate is not met', () => {
    const source = [1, 2, 3];

    const action = () => Enumerable.first(source, () => false);

    expect(action).toThrowError();
  });
});

describe('Enumerable.firstOrNull', () => {
  test('Returns the first element in the sequence', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrNull(source);

    expect(first).toBe(1);
  });

  test('Returns null if the sequence is empty', () => {
    const source: number[] = [];

    const first = Enumerable.firstOrNull(source);

    expect(first).toBeNull();
  });

  test('Returns the first element that matches the predicate', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrNull(source, (item) => item === 2);

    expect(first).toBe(2);
  });

  test('Returns null if the sequence is not empty and no element matching the predicate is found', () => {
    const source = [1, 2, 3];

    const first = Enumerable.firstOrNull(source, () => false);

    expect(first).toBeNull();
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
describe('Enumerable.lastOrNull', () => {
  test('Returns the last element in the sequence', () => {
    const source = [1, 2, 3];

    const last = Enumerable.lastOrNull(source);

    expect(last).toBe(3);
  });

  test('Returns null if the sequence is empty', () => {
    const source: number[] = [];

    const last = Enumerable.lastOrNull(source);

    expect(last).toBeNull();
  });

  test('Returns the last element that matches the predicate', () => {
    const source = [1, 2, 3];

    const last = Enumerable.lastOrNull(source, (item) => item === 2);

    expect(last).toBe(2);
  });

  test('Returns null if the sequence is not empty and no element matching the predicate is found', () => {
    const source = [1, 2, 3];

    const last = Enumerable.lastOrNull(source, () => false);

    expect(last).toBeNull();
  });

  test("Doesn't enumerate over the enumerable if the source is a non empty array", () => {
    const source = [1, 2, 3];
    const mockIterator = jest.fn();
    source[Symbol.iterator] = mockIterator;

    Enumerable.lastOrNull(source);

    expect(mockIterator).not.toHaveBeenCalled();
  });
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
describe('Enumerable.', () => {
  test('', () => {});
});
