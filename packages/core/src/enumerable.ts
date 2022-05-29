import { IEnumerable } from './enumerable.interface';
import { Compare, Predicate, ResultSelector } from './types';
import { isFunction, isNil, isString } from './utils';

/**
 *  Provides a set of static methods for querying objects
 *  that implement IEnumerable<T>.
 */
export abstract class Enumerable {
  public static toArray<TSource>(source: IEnumerable<TSource>): TSource[] {
    return Array<TSource>.from(source);
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

  public static chunk<TSource>(source: IEnumerable<TSource>, size: number): IEnumerable<TSource[]>{
    if (size <= 0) {
      throw ThrowHelper.argumentOutOfRange('size');
    }

    const chunkIterator = function* (): Iterator<TSource[]> {
      const buffer: TSource[] = [];

      const e = source.getEnumerator();

      if(!e.moveNext()) {
        throw ThrowHelper.empty();
      }

      for (const element of source) {
        buffer.push(element);

        if (buffer.length === size) {
          // We don't want to return the array reference
          // because clearing it after would clear the chunk
          // returned by the iterator.
          yield [...buffer];
          buffer.length = 0;
        }
      }

      if (buffer.length > 0) {
        yield buffer;
      }
    };

    return IEnumerable.create(chunkIterator);
  }

  public static append<TSource>(
    source: IEnumerable<TSource>,
    element: TSource
  ): IEnumerable<TSource> {
    const appendIterator = function* (): Iterator<TSource> {
      for (const element of source) {
        yield element;
      }

      yield element;
    };

    return IEnumerable.create(appendIterator);
  }

  public static sum<TSource>(source: IEnumerable<TSource>): TSource;
  public static sum<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector?: ResultSelector<TSource, TResult>
  ): TResult;
  public static sum<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector: ResultSelector<TSource, TResult> = (element: TSource) =>
      <TResult>(<any>element)
  ): TResult {
    if (isNil(selector)) {
      throw ThrowHelper.argumentNull('selector');
    }

    let sum: TResult;

    const e = source.getEnumerator();

    if (!e.moveNext()) {
      throw ThrowHelper.empty();
    }

    sum = selector(e.current!);

    for (const element of e) {
      sum = sum + <any>selector(element);
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

    for (const element of e) {
      result = accumulator(result, element);
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

    const repeatIterator = function* (): Iterator<TResult> {
      for (let i = 0; i < count; i++) {
        yield value;
      }
    };

    return IEnumerable.create(repeatIterator);
  }

  public static empty<TResult>(): IEnumerable<TResult> {
    const emptyIterator = function* (): Iterator<TResult> {};

    return IEnumerable.create(emptyIterator);
  }

  public static from<TSource>(source: Iterable<TSource>): IEnumerable<TSource> {
    if (isNil(source)) {
      throw ThrowHelper.argumentNull('source');
    }

    const iterator = source[Symbol.iterator].bind(source);
    return IEnumerable.create(iterator);
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
      source.length;
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
    const whereIterator = function* (): Iterator<TSource> {
      for (const element of source) {
        if (predicate(element)) {
          yield element;
        }
      }
    };

    return IEnumerable.create(whereIterator);
  }

  public static select<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector: ResultSelector<TSource, TResult>
  ): IEnumerable<TResult> {
    if (isNil(selector)) {
      throw ThrowHelper.argumentNull('selector');
    }

    const selectIterator = function* (): Iterator<TResult> {
      for (const element of source) {
        yield selector(element);
      }
    };

    return IEnumerable.create(selectIterator);
  }

  public static single<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource {
    const e = source.getEnumerator();
    let result: TSource | null = null;
    let count = 0;

    if (predicate == null) {
      if (!e.moveNext()) {
        throw ThrowHelper.empty();
      }

      result = e.current;

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
    let result: TSource | null = null;
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

class ThrowHelper {
  public static argumentNull(argumentName: string): MethodInvocationException {
    return new MethodInvocationException(
      `Argument '${argumentName}' is null or undefined`
    );
  }
  public static argumentOutOfRange(
    argumentName: string
  ): MethodInvocationException {
    return new MethodInvocationException(
      `Argument '${argumentName}' is out of range`
    );
  }
  public static empty(): MethodInvocationException {
    return new MethodInvocationException('Sequence is empty');
  }
  public static noMatch(): MethodInvocationException {
    return new MethodInvocationException(
      'Sequence contains no matching element'
    );
  }
  public static moreThanOneMach(): MethodInvocationException {
    return new MethodInvocationException(
      'Sequence contains more than one matching element'
    );
  }

  public static invalidOperation(message: string): MethodInvocationException {
    return new MethodInvocationException(message);
  }
}

export class MethodInvocationException extends Error {
  public constructor(message: string) {
    super(message);
  }
}
