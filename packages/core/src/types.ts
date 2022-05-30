export type Predicate<T> = (source: T) => boolean;
export type ResultSelector<TSource, TResult> = (source: TSource) => TResult;
export type Compare<TSource, TCompareTo> = (
  element: TSource,
  compareTo: TCompareTo
) => boolean;

export type IteratorType<T> = {
  prototype: { [Symbol.iterator](): Iterator<T> };
} & Function;

export type IteratorFunction<T, R extends Iterator<T> = Iterator<T>> = () => R;

export type EnumerableSource<T> = Iterable<T> | IteratorFunction<T>;

export type Nil = null | undefined;
