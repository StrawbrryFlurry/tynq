import { IEnumerable, IEnumerator, Predicate } from '@tynq/core';

import { Expr } from './expression';

export abstract class IQueryable<TSource> implements IEnumerable<TSource> {
  public count(): number {
    throw new Error('Method not implemented.');
  }
  public single(predicate?: Expr<Predicate<TSource> | undefined>): TSource {
    throw new Error('Method not implemented.');
  }
  public singleOrNull(
    predicate?: Predicate<TSource> | undefined
  ): TSource | null {
    throw new Error('Method not implemented.');
  }
  public where(predicate: Predicate<TSource>): IEnumerable<TSource> {
    throw new Error('Method not implemented.');
  }
  public select<TResult>(
    selector: (item: TSource) => TResult
  ): IEnumerable<TResult> {
    throw new Error('Method not implemented.');
  }
  public first(predicate?: Predicate<TSource> | undefined): TSource {
    throw new Error('Method not implemented.');
  }
  public firstOrNull(
    predicate?: Predicate<TSource> | undefined
  ): TSource | null {
    throw new Error('Method not implemented.');
  }
  public last(predicate?: Predicate<TSource> | undefined): TSource {
    throw new Error('Method not implemented.');
  }
  public lastOrNull(
    predicate?: Predicate<TSource> | undefined
  ): TSource | null {
    throw new Error('Method not implemented.');
  }
  public getEnumerator(): IEnumerator<TSource> {
    throw new Error('Method not implemented.');
  }
  public [Symbol.iterator](): Iterator<TSource, any, undefined> {
    throw new Error('Method not implemented.');
  }
}
