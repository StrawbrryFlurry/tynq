import { IEnumerator } from '@core/enumerator';

export type Predicate<T> = (source: T) => boolean;
export type ResultSelector<TSource, TResult> = (source: TSource) => TResult;
export type Compare<TSource, TCompareTo> = (
  element: TSource,
  compareTo: TCompareTo
) => boolean;

export type IteratorType<T extends Iterator<T>> = {
  prototype: { [Symbol.iterator](): T };
} & Function;

export type IteratorFunction<T, R extends Iterator<T> = Iterator<T>> = () => R;

export type EnumerableSource<T> =
  | IEnumerator<T>
  | Iterable<T>
  | IteratorFunction<T>;

export type Nil = null | undefined;
