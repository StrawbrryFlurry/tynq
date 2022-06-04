import { IEnumerator } from '../enumerator';

export class SetEnumerator<T> implements IEnumerator<T> {
  public current?: T;
  private _source: Set<T>;

  private _keys: IterableIterator<T>;

  constructor(source: Set<T>) {
    this._source = source;
    this._keys = source.keys();
  }

  public moveNext(): boolean {
    const result = this._keys.next();

    if (result.done) {
      return false;
    }

    this.current = result.value;
    return true;
  }

  public reset(): void {
    this._keys = this._source.keys();
  }

  public [Symbol.iterator](): Iterator<T, any, undefined> {
    return this._source[Symbol.iterator]();
  }
}
