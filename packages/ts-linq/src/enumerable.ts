import { EnumerableImpl, IEnumerable } from './enumerable.interface';
import { Predicate } from './types';
import { isNil, isString } from './utils';

/**
 *  Provides a set of static methods for querying objects
 *  that implement IEnumerable<T>.
 */
export abstract class Enumerable {
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

    return new EnumerableImpl<TResult>(repeatIterator);
  }

  public static empty<TResult>(): IEnumerable<TResult> {
    const emptyIterator = function* (): Iterator<TResult> {};

    return new EnumerableImpl<TResult>(emptyIterator);
  }

  public static from<TSource>(source: Iterable<TSource>): IEnumerable<TSource> {
    if (isNil(source)) {
      throw ThrowHelper.argumentNull('source');
    }

    const iterator = source[Symbol.iterator].bind(source);
    return new EnumerableImpl<TSource>(iterator);
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
      const e = source.getEnumerator();

      while (e.moveNext()) {
        const value = e.current!;

        if (predicate(value)) {
          yield value;
        }
      }
    };

    return new EnumerableImpl<TSource>(whereIterator);
  }

  public static select<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector: (item: TSource) => TResult
  ): IEnumerable<TResult> {
    const selectIterator = function* (): Iterator<TResult> {
      const e = source.getEnumerator();

      while (e.moveNext()) {
        yield selector(e.current!);
      }
    };

    return new EnumerableImpl<TResult>(selectIterator);
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
        throw new Error('No elements in source');
      }

      result = e.current;

      if (!e.moveNext()) {
        return result!;
      }

      throw new Error('More than one matching element in source');
    }

    for (const element of source) {
      if (predicate(element)) {
        result = element;
        count++;
      }
    }

    switch (count) {
      case 0:
        throw new Error('No element found');
      case 1:
        return result!;
    }

    throw ThrowHelper.moreThanOneMach();
  }

  public static singleOrNull<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource | null {
    const e = source.getEnumerator();
    let result: TSource | null = null;
    let count = 0;

    if (predicate == null) {
      if (!e.moveNext()) {
        return null;
      }

      result = e.current;

      if (!e.moveNext()) {
        return result!;
      }

      return null;
    }

    for (const element of source) {
      if (predicate(element)) {
        result = element;
        count++;
      }
    }

    switch (count) {
      case 0:
        return null;
      case 1:
        return result!;
    }

    return null;
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

  static firstOrNull<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource | null {
    const e = source.getEnumerator();
    const hasPredicate = !isNil(predicate);
    while (e.moveNext()) {
      const value = e.current!;

      if (!hasPredicate || predicate(value)) {
        return value;
      }
    }

    if (hasPredicate) {
      return null;
    }

    return null;
  }

  static last<TSource>(
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
      if (!hasPredicate || predicate(element)) {
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

  static lastOrNull<TSource>(
    source: IEnumerable<TSource>,
    predicate?: Predicate<TSource>
  ): TSource | null {
    const hasPredicate = !isNil(predicate);
    let result: TSource | null = null;

    if (Array.isArray(source) && !hasPredicate) {
      const length = source.length;
      if (length > 0) {
        return source[length - 1] ?? null;
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

    if (hasPredicate) {
      return null;
    }

    return null;
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
}

export class MethodInvocationException extends Error {
  public constructor(message: string) {
    super(message);
  }
}
