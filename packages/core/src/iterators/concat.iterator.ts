import { IEnumerable } from '@core/enumerable';

import { IEnumerator } from '..';
import { DONE, EnumeratorStateMachine } from './enumerator-state-machine';

export class ConcatIterator<T> extends EnumeratorStateMachine<T> {
  private _e1!: IEnumerator<T>;
  private _e2!: IEnumerator<T>;

  private source1!: IEnumerable<T>;
  private source2!: IEnumerable<T>;

  constructor(source1: IEnumerable<T>, source2: IEnumerable<T>) {
    super();
    this.source1 = source1;
    this.source2 = source2;
  }

  public next(): T | typeof DONE {
    if (this._e1.moveNext()) {
      return this._e1.current!;
    }

    if (this._e2.moveNext()) {
      return this._e2.current!;
    }

    return DONE;
  }

  public setup(): void {
    this._e1 = this.source1.getEnumerator();
    this._e2 = this.source2.getEnumerator();
  }
}
