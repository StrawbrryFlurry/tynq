import type { IEnumerable } from './enumerable';
import type { IEnumerator } from './enumerator';

export type Predicate<T, A extends any[] = any> = (
  source: T,
  ...args: A
) => boolean;

export type JoinResultSelector<TOuter, TInner, TResult> = (
  outer: TOuter,
  inner: TInner
) => TResult;

export type GroupByResultSelector<TKey, TElement, TResult> = (
  key: TKey,
  elements: IEnumerable<TElement>
) => TResult;

export type Action<T> = (source: T) => void;

export class ResultSelector<TSource, TResult> {
  // This by design returns a new function rather than
  // using the same function definition multiple times
  // as all operators that use this implementation will
  // call the function with drastically different arguments
  // making it a megamorphic function.
  public static get default(): ResultSelector<any, any> {
    return <TSource, TResult>(source: TSource): TResult => <any>source;
  }
}

export interface ResultSelector<TSource, TResult> {
  (source: TSource): TResult;
}

export interface ResultSelectorWithIndex<TSource, TResult> {
  (source: TSource, index?: number): TResult;
}

export interface Comparer<TSource, TCompareTo> {
  (element: TSource, compareTo: TCompareTo): number;
}

export class Comparer<TSource, TCompareTo> {
  // This by design returns a new function rather than
  // using the same function definition multiple times
  // as all operators that use this implementation will
  // call the function with drastically different arguments
  // making it a megamorphic function.
  public static get default(): Comparer<any, any> {
    return (a: any, b: any): number => {
      if (EqualityComparer.default(a, b)) {
        return 0;
      }

      return a > b ? 1 : -1;
    };
  }
}

export interface EqualityComparer<T> {
  (x: T, y: T): boolean;
}

export class EqualityComparer<T> {
  // This by design returns a new function rather than
  // using the same function definition multiple times
  // as all operators that use this implementation will
  // call the function with drastically different arguments
  // making it a megamorphic function.
  public static get default(): EqualityComparer<unknown> {
    return (x: unknown, y: unknown) => Object.is(x, y);
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
