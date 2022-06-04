import { IEnumerator } from './enumerator';

export type Predicate<T, A extends any[] = any> = (
  source: T,
  ...args: A
) => boolean;
export type ResultSelector<TSource, TResult> = (source: TSource) => TResult;
export type Action<T> = (source: T) => void;

export interface Comparer<TSource, TCompareTo> {
  (element: TSource, compareTo: TCompareTo): boolean;
}

export class Comparer<TSource, TCompareTo> {
  public static greaterThan<TSource, TCompareTo>(
    a: TSource,
    b: TCompareTo
  ): boolean {
    return <any>a > <any>b;
  }

  public static lessThan<TSource, TCompareTo>(
    a: TSource,
    b: TCompareTo
  ): boolean {
    return <any>a < <any>b;
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
