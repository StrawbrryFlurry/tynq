import { ThrowHelper } from '@core/exceptions';
import { DONE, EnumeratorStateMachine } from '@core/iterators';
import { Compare, Predicate, ResultSelector } from '@core/types';
import { isFunction, isNil, isString } from '@core/utils';

import { IEnumerable } from './enumerable.interface';

/**
 *  Provides a set of static methods for querying objects
 *  that implement IEnumerable<T>.
 */
export abstract class Enumerable {
  public static toArray<TSource>(source: IEnumerable<TSource>): TSource[] {
    const array: TSource[] = [];
    const e = source.getEnumerator();

    while (e.moveNext()) {
      array.push(e.current!);
    }

    return array;
  }

  public static toMap<TSource, TKey, TValue>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    valueSelector?: ResultSelector<TSource, TValue>
  ): Map<TKey, TValue> {
    if (isNil(keySelector)) {
      throw ThrowHelper.argumentNull('keySelector');
    }

    valueSelector ??= (element: TSource) => <TValue>(<any>element);
    const map = new Map<TKey, TValue>();

    for (const element of source) {
      const key = keySelector(element);

      if (isNil(key)) {
        throw ThrowHelper.invalidOperation('keySelector returned a null key');
      }

      map.set(keySelector(element), valueSelector(element));
    }

    return map;
  }

  public static toSet<TSource>(source: IEnumerable<TSource>): Set<TSource> {
    return new Set<TSource>(source);
  }

  public static chain<TSource>(
    first: IEnumerable<TSource>,
    second: IEnumerable<TSource>
  ): IEnumerable<TSource> {
    if (isNil(first)) {
      throw ThrowHelper.argumentNull('first');
    }

    if (isNil(second)) {
      throw ThrowHelper.argumentNull('second');
    }

    return EnumeratorStateMachine.create(() => {
      const e1 = first.getEnumerator();
      const e2 = second.getEnumerator();

      return () => {
        if (e1.moveNext()) {
          return e1.current;
        }

        if (e2.moveNext()) {
          return e2.current;
        }

        return DONE;
      };
    });
  }

  public static chunk<TSource>(
    source: IEnumerable<TSource>,
    size: number
  ): IEnumerable<TSource[]> {
    if (size <= 0) {
      throw ThrowHelper.argumentOutOfRange('size');
    }

    return EnumeratorStateMachine.create(() => {
      let buffer: TSource[] = [];
      const e = source.getEnumerator();
      const r = () => {
        // We don't want to return the array reference
        // because clearing it after would clear the chunk
        // returned by the iterator.
        const v = buffer;
        buffer = [];
        return v;
      };

      return () => {
        while (e.moveNext()) {
          buffer.push(e.current!);

          if (buffer.length === size) {
            return r();
          }
        }

        if (buffer.length > 0) {
          return r();
        }

        return DONE;
      };
    });
  }

  public static chunkOrDefault<TSource>(
    source: IEnumerable<TSource>,
    size: number,
    defaultValue?: TSource[]
  ): IEnumerable<TSource[] | null> {
    if (size <= 0) {
      throw ThrowHelper.argumentOutOfRange('count');
    }

    return EnumeratorStateMachine.create(() => {
      let buffer: TSource[] = [];
      const e = source.getEnumerator();

      return () => {
        while (e.moveNext()) {
          buffer.push(e.current!);

          if (buffer.length === size) {
            // We don't want to return the array reference
            // because clearing it after would clear the chunk
            // returned by the iterator.
            const v = buffer;
            buffer = [];
            return v;
          }
        }

        if (buffer.length > 0) {
          buffer = [];
          return defaultValue ?? null;
        }

        return DONE;
      };
    });
  }

  public static append<TSource>(
    source: IEnumerable<TSource>,
    element: TSource
  ): IEnumerable<TSource> {
    return EnumeratorStateMachine.create(() => {
      const e = source.getEnumerator();
      let hasReturned = false;

      return () => {
        if (e.moveNext()) {
          return e.current;
        }

        if (hasReturned === false) {
          hasReturned = true;
          return element;
        }

        return DONE;
      };
    });
  }

  public static sum<TSource>(source: IEnumerable<TSource>): TSource;
  public static sum<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector?: ResultSelector<TSource, TResult>
  ): TResult;
  public static sum<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector?: ResultSelector<TSource, TResult>
  ): TResult {
    selector ??= (element: TSource) => <TResult>(<any>element);

    let sum: TResult;
    const e = source.getEnumerator();

    if (!e.moveNext()) {
      throw ThrowHelper.empty();
    }

    sum = selector(e.current!);

    while (e.moveNext()) {
      sum += <any>selector(e.current!);
    }

    return sum;
  }

  public static min<TSource>(
    source: IEnumerable<TSource>,
    compareFn: Compare<TSource, TSource> = (
      element: TSource,
      isSmallerThan: TSource
    ) => element < isSmallerThan
  ): TSource {
    if (isNil(compareFn)) {
      throw ThrowHelper.argumentNull('compareFn');
    }

    let min: TSource | undefined;
    for (const element of source) {
      if (isNil(min)) {
        min = element;
        continue;
      }

      if (compareFn(element, min)) {
        min = element;
      }
    }

    if (isNil(min)) {
      throw ThrowHelper.empty();
    }

    return min;
  }

  public static max<TSource>(
    source: IEnumerable<TSource>,
    /**
     * A function to specify the comparison of elements.
     * Checks whether `element` is greater than `isGreaterThan`.
     */
    compareFn: Compare<TSource, TSource> = (
      element: TSource,
      isGreaterThan: TSource
    ) => element > isGreaterThan
  ): TSource {
    if (isNil(compareFn)) {
      throw ThrowHelper.argumentNull('compareFn');
    }

    let max: TSource | undefined;
    for (const element of source) {
      if (isNil(max)) {
        max = element;
        continue;
      }

      if (compareFn(element, max)) {
        max = element;
      }
    }

    if (isNil(max)) {
      throw ThrowHelper.empty();
    }

    return max;
  }

  public static aggregate<TSource, TAccumulate>(
    source: IEnumerable<TSource>,
    accumulator: (acc: TSource, element: TSource) => TSource
  ): TSource;
  public static aggregate<TSource, TAccumulate>(
    source: IEnumerable<TSource>,
    accumulator: (acc: TAccumulate, element: TSource) => TAccumulate,
    seed: TAccumulate
  ): TAccumulate;
  public static aggregate<TSource, TAccumulate, TResult>(
    source: IEnumerable<TSource>,
    accumulator: (acc: TAccumulate, element: TSource) => TAccumulate,
    seed: TAccumulate,
    resultSelector: ResultSelector<TAccumulate, TResult>
  ): TResult;
  public static aggregate<TSource, TAccumulate, TResult>(
    source: IEnumerable<TSource>,
    accumulator: (acc: TAccumulate, element: TSource) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: ResultSelector<TAccumulate, TResult>
  ): TResult {
    if (isNil(accumulator)) {
      throw ThrowHelper.argumentNull('accumulator');
    }

    const e = source.getEnumerator();

    if (!e.moveNext()) {
      throw ThrowHelper.empty();
    }

    let result: TAccumulate;

    if (isNil(seed)) {
      result = <TAccumulate>(<any>e.current);
    } else {
      result = <TAccumulate>seed;
      e.reset();
    }

    while (e.moveNext()) {
      result = accumulator(result, e.current!);
    }

    if (isNil(resultSelector)) {
      return <TResult>(<any>result);
    }

    return <TResult>resultSelector(result);
  }

  public static contains<TSource>(
    source: IEnumerable<TSource>,
    value: TSource
  ): boolean {
    for (const element of source) {
      if (Object.is(element, value)) {
        return true;
      }
    }

    return false;
  }

  public static any<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): boolean {
    const hasPredicate = !isNil(predicate);

    for (const element of source) {
      if (!hasPredicate || predicate(element!)) {
        return true;
      }
    }

    return false;
  }

  public static all<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>
  ): boolean {
    for (const element of source) {
      if (!predicate(element)) {
        return false;
      }
    }

    return true;
  }

  public static repeat<TResult>(
    value: TResult,
    count: number
  ): IEnumerable<TResult> {
    if (count < 0) {
      throw ThrowHelper.argumentOutOfRange('count');
    }

    return EnumeratorStateMachine.create(() => {
      let i = 0;

      return () => {
        if (i < count) {
          i++;
          return value;
        }

        return DONE;
      };
    });
  }

  public static empty<TResult>(): IEnumerable<TResult> {
    return EnumeratorStateMachine.create<TResult>(() => () => DONE);
  }

  public static from<TSource>(source: Iterable<TSource>): IEnumerable<TSource> {
    if (isNil(source)) {
      throw ThrowHelper.argumentNull('source');
    }

    const iteratorSource = () => source[Symbol.iterator].call(source);

    return EnumeratorStateMachine.create(() => {
      const iterator = iteratorSource();

      return () => {
        const result = iterator.next();
        if (result.done) {
          return DONE;
        }

        return result.value;
      };
    });
  }

  public static count<TSource>(source: IEnumerable<TSource>): number {
    if (Array.isArray(source)) {
      return source.length;
    }

    if (source instanceof Set || source instanceof Map) {
      return source.size;
    }

    if (isString(source)) {
      return source.length;
    }

    if (
      source instanceof Uint32Array ||
      source instanceof Int8Array ||
      source instanceof Uint8Array ||
      source instanceof Uint8ClampedArray ||
      source instanceof Int16Array ||
      source instanceof Uint16Array ||
      source instanceof Int32Array ||
      source instanceof Uint32Array ||
      source instanceof Float32Array ||
      source instanceof Float64Array ||
      source instanceof BigInt64Array ||
      source instanceof BigUint64Array
    ) {
      return source.length;
    }

    let count = 0;
    const enumerator = source.getEnumerator();
    while (enumerator.moveNext()) {
      count++;
    }

    return count;
  }

  public static where<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>
  ): IEnumerable<TSource> {
    return EnumeratorStateMachine.create(() => {
      const e = source.getEnumerator();

      return () => {
        while (e.moveNext()) {
          const c = e.current!;

          if (predicate(c)) {
            return c;
          }
        }

        return DONE;
      };
    });
  }

  public static select<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector: ResultSelector<TSource, TResult>
  ): IEnumerable<TResult> {
    if (isNil(selector)) {
      throw ThrowHelper.argumentNull('selector');
    }

    return EnumeratorStateMachine.create(() => {
      const e = source.getEnumerator();

      return () => {
        while (e.moveNext()) {
          return selector(e.current!);
        }

        return DONE;
      };
    });
  }

  public static single<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource {
    const e = source.getEnumerator();
    let result: TSource;
    let count = 0;

    if (isNil(predicate)) {
      if (!e.moveNext()) {
        throw ThrowHelper.empty();
      }

      result = e.current!;

      if (!e.moveNext()) {
        return result!;
      }

      throw ThrowHelper.moreThanOneMach();
    }

    for (const element of source) {
      if (predicate(element)) {
        result = element;
        count++;
      }
    }

    switch (count) {
      case 0:
        throw ThrowHelper.noMatch();
      case 1:
        return result!;
    }

    throw ThrowHelper.moreThanOneMach();
  }

  public static singleOrDefault<TSource>(
    source: IEnumerable<TSource>
  ): TSource | null;
  public static singleOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>
  ): TSource | null;
  public static singleOrDefault<TSource>(
    source: IEnumerable<TSource>,
    defaultValue?: TSource
  ): TSource;
  public static singleOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>,
    defaultValue: TSource
  ): TSource;
  public static singleOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    const e = source.getEnumerator();
    const hasPredicate = isFunction(predicate);
    const notFoundValue = this._getOrDefaultValue(predicate, defaultValue);
    let result: TSource | undefined;
    let count = 0;

    if (!hasPredicate) {
      if (!e.moveNext()) {
        return notFoundValue;
      }

      result = e.current;

      if (!e.moveNext()) {
        return result!;
      }

      return notFoundValue;
    }

    for (const element of source) {
      if (predicate(element)) {
        result = element;
        count++;
      }
    }

    switch (count) {
      case 0:
        return notFoundValue;
      case 1:
        return result!;
    }

    return notFoundValue;
  }

  public static first<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource {
    const e = source.getEnumerator();
    const hasPredicate = !isNil(predicate);
    while (e.moveNext()) {
      const value = e.current!;

      if (!hasPredicate || predicate(value)) {
        return value;
      }
    }

    if (hasPredicate) {
      throw ThrowHelper.noMatch();
    }

    throw ThrowHelper.empty();
  }

  public static firstOrDefault<TSource>(
    source: IEnumerable<TSource>
  ): TSource | null;
  public static firstOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>
  ): TSource | null;
  public static firstOrDefault<TSource>(
    source: IEnumerable<TSource>,
    defaultValue?: TSource
  ): TSource;
  public static firstOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>,
    defaultValue: TSource
  ): TSource;
  public static firstOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    const hasPredicate = isFunction(predicate);
    const notFoundValue = this._getOrDefaultValue(predicate, defaultValue);

    for (const element of source) {
      if (!hasPredicate || predicate(element)) {
        return element;
      }
    }

    return notFoundValue;
  }

  public static last<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource {
    const hasPredicate = !isNil(predicate);
    let result: TSource | null = null;

    if (Array.isArray(source) && !hasPredicate) {
      const length = source.length;
      if (length > 0) {
        return source[length - 1];
      }
    }

    let found = false;
    for (const element of source) {
      if (!hasPredicate || predicate(element!)) {
        result = element;
        found = true;
      }
    }

    if (found) {
      return result!;
    }

    if (hasPredicate) {
      throw ThrowHelper.noMatch();
    }

    throw ThrowHelper.empty();
  }

  public static lastOrDefault<TSource>(
    source: IEnumerable<TSource>
  ): TSource | null;
  public static lastOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>
  ): TSource | null;
  public static lastOrDefault<TSource>(
    source: IEnumerable<TSource>,
    defaultValue?: TSource
  ): TSource;
  public static lastOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate: Predicate<TSource>,
    defaultValue: TSource
  ): TSource;
  public static lastOrDefault<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    const hasPredicate = isFunction(predicate);
    const notFoundValue = this._getOrDefaultValue(predicate, defaultValue);
    let result: TSource | null = null;

    if (Array.isArray(source) && !hasPredicate) {
      const length = source.length;
      if (length > 0) {
        return source[length - 1] ?? notFoundValue;
      }
    }

    let found = false;
    for (const element of source) {
      if (!hasPredicate || predicate(element)) {
        result = element;
        found = true;
      }
    }

    if (found) {
      return result!;
    }

    return notFoundValue;
  }

  /**
   * Returns the default value for xOrDefault
   * methods where the first argument is either
   * a predicate or the default value and the second
   * argument is an optional default value.
   */
  private static _getOrDefaultValue<TSource>(
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    if (isFunction(predicate)) {
      return defaultValue ?? null;
    }

    return predicate ?? null;
  }
}
