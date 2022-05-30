import { IEnumerator } from './enumerator.interface';
import { isFunction, isNil } from './utils/is-nil';

export class Enumerator<T> implements IEnumerator<T> {
  public get current(): T | null {
    return this._current;
  }
  private _current: T | null = null;
  private _source: IEnumerator<T>;

  constructor(source: IEnumerator<T>) {
    if (isNil(source)) {
      throw new Error('Enumerator source is not defined');
    }

    if (!this._isEnumerator(source)) {
      throw new Error('source is not an enumerator');
    }

    this._source = source;
  }

  public moveNext(): boolean {
    return this._source.moveNext();
  }

  private _isEnumerator(source: any): source is IEnumerator<T> {
    return isFunction((<IEnumerator<T>>source).moveNext);
  }

  public reset(): void {}

  public [Symbol.iterator](): Iterator<T> {
    return {
      next: () => {
        while (this.moveNext()) {
          return <IteratorResult<T>>{ value: this._current };
        }

        return <IteratorResult<T>>{ value: this._current, done: true };
      },
    };
  }
}
