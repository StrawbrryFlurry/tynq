import { IEnumerator } from '@core/enumerator';

export class MapEnumerator<T extends [TKey, TValue], TKey, TValue>
  implements IEnumerator<T>
{
  public current?: T;
  private _source: Map<TKey, TValue>;
  private keys!: TKey[];
  private _idx: number = -1;

  constructor(source: Map<TKey, TValue>) {
    this._source = source;
  }

  moveNext(): boolean {
    throw new Error('Method not implemented.');
  }

  reset(): void {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): Iterator<T> {
    return <Iterator<T>>this._source[Symbol.iterator]();
  }
}
