import { IEnumerable } from '../enumerable';
import { IEnumerator } from '../enumerator';

export const enum IteratorState {
  Stopped = 0,
  Running = 1,
  Done,
}

export abstract class Iterator<TSource> implements IEnumerator<TSource> {
  public current?: TSource;
  protected state: IteratorState = IteratorState.Stopped;

  public abstract moveNext(): boolean;

  public reset(): void {
    throw new Error('Method not implemented.');
  }

  public getEnumerator(): IEnumerator<TSource> {
    return this;
  }

  public [Symbol.iterator](): globalThis.Iterator<TSource> {
    return this.getEnumerator()[Symbol.iterator]();
  }
}

// Importing the value of the IEnumerable class here
// would result in a circular dependency:
// Enumerable => Iterator => IEnumerable => Enumerable
// The prototype of `Iterator` is overwritten to be `IEnumerable` at startup
export interface Iterator<TSource> extends IEnumerable<TSource> {}
