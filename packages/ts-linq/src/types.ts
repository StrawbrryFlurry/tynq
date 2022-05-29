export type Predicate<T> = (source: T) => boolean;

export type IteratorType = {
  prototype: { [Symbol.iterator](): Iterator<any> };
} & Function;

export type IteratorFunction<T, R extends Iterator<T> = Iterator<T>> = () => R;

export type EnumerableSource<T> = Iterable<T> | IteratorFunction<T>;

export type Nil = null | undefined;
