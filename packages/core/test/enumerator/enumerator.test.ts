/*

describe('Enumerator.moveNext', () => {
  test('returns true when the iterator is not done', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    expect(enumerator.moveNext()).toBe(true);
  });

  test('current will be null when `moveNext` has never been called on the enumerator', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    expect(enumerator.current).toBe(null);
  });

  test('updates the `current` property of the instance with the next value', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    enumerator.moveNext();
    expect(enumerator.current).toBe(1);
  });

  test('does not overwrite the value of `current` even when the iterator is done', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    while (enumerator.moveNext());
    enumerator.moveNext();
    expect(enumerator.current).toBe(3);
  });

  test('returns false when the iterator is done', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    const iterator = enumerator.getIterator();
    while (iterator.next().done === false);
    expect(enumerator.moveNext()).toBe(false);
  });
});

describe('Enumerator.reset', () => {
  test('reset resets the enumerator to the beginning', () => {
    const enumerator = new Enumerator([1, 2, 3]);
    enumerator.moveNext();
    enumerator.moveNext();
    enumerator.reset();
    expect(enumerator.current).toBe(null);
  });
});
*/

test('', () => {});
