import { IEnumerator } from './enumerator';

export type Predicate<T, A extends any[] = any> = (
  source: T,
  ...args: A
) => boolean;
export type ResultSelector<TSource, TResult> = (source: TSource) => TResult;
export type Action<T> = (source: T) => void;

export interface Comparer<TSource, TCompareTo> {
  (element: TSource, compareTo: TCompareTo): number;
}

export class Comparer<TSource, TCompareTo> {
  public static default<TSource, TCompareTo>(
    a: TSource,
    b: TCompareTo
  ): number {
    if (EqualityComparer.default(a, <TSource>(<unknown>b))) {
      return 0;
    }

    return <any>a > <any>b ? 1 : -1;
  }
}

export interface EqualityComparer<T> {
  (x: T, y: T): boolean;
}

export class EqualityComparer<T> {
  /**
   * Compares two values using Object.is
   */
  public static default<T>(x: T, y: T): boolean {
    return Object.is(x, y);
  }
}

export type IteratorType<T extends Iterator<T>> = {
  prototype: { [Symbol.iterator](): T };
} & Function;

export type IteratorFunction<T, R extends Iterator<T> = Iterator<T>> = () => R;

export type EnumerableSource<T> =
  | IEnumerator<T>
  | Iterable<T>
  | IteratorFunction<T>;

export type Nil = null | undefined;
