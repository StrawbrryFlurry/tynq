import { IEnumerator } from '../enumerator.interface';

export class ArrayEnumerator<T> implements IEnumerator<T> {
  public current: T | null = null;
  private _source: T[];
  private _idx = 0;

  constructor(source: T[]) {
    this._source = source;
  }

  moveNext(): boolean {
    this._idx++;
    if (this._idx >= this._source.length) {
      return false;
    }

    this.current = this._source[this._idx];
    return true;
  }

  reset(): void {
    this._idx = 0;
  }

  [Symbol.iterator](): Iterator<T> {
    return this._source[Symbol.iterator]();
  }
}
