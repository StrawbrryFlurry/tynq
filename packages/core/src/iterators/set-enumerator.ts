import { IEnumerator } from '../enumerator.interface';

export class SetEnumerator<T> implements IEnumerator<T> {
  public current: T | null = null;
  private _source: Set<T>;

  constructor(source: Set<T>) {
    this._source = source;
  }

  moveNext(): boolean {
    throw new Error('Method not implemented.');
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): Iterator<T, any, undefined> {
    return this._source[Symbol.iterator]();
  }
}