import { Enumerable } from './enumerable';
import { Enumerator } from './enumerator';
import { IEnumerator } from './enumerator.interface';
import { EnumerableSource, Predicate } from './types';

/**
 * Represents a generic collection like an array, list or map
 * that can be enumerated.
 */
export interface IEnumerable<TSource> extends Iterable<TSource> {
  count(): number;
  single(predicate?: Predicate<TSource>): TSource;
  where(predicate: Predicate<TSource>): IEnumerable<TSource>;
  select<TResult>(selector: (item: TSource) => TResult): IEnumerable<TResult>;
  getEnumerator(): IEnumerator<TSource>;
}

/**
 * An internal implementation for IEnumerable. This class acts
 * as the entrypoint for a non-enumerable to be converted to
 * an IEnumerable.
 */
export class EnumerableImpl<TSource> implements IEnumerable<TSource> {
  protected enumerator: IEnumerator<TSource>;

  constructor(source: EnumerableSource<TSource>) {
    this.enumerator = new Enumerator<TSource>(source);
  }

  public single(predicate?: Predicate<TSource> | undefined): TSource {
    return Enumerable.single(this, predicate);
  }

  public where(predicate: Predicate<TSource>): IEnumerable<TSource> {
    return Enumerable.where(this, predicate);
  }

  public select<TResult>(
    selector: (item: TSource) => TResult
  ): IEnumerable<TResult> {
    return Enumerable.select(this, selector);
  }

  public getEnumerator(): IEnumerator<TSource> {
    return this.enumerator;
  }

  public count(): number {
    return Enumerable.count(this);
  }

  [Symbol.iterator](): Iterator<TSource> {
    return this.enumerator.getIterator();
  }
}
