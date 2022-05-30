import { IEnumerator } from '../enumerator.interface';

export class MapEnumerator<TKey, TValue>
  implements IEnumerator<[TKey, TValue]>
{
  public current: [TKey, TValue] | null = null;
  private _source: Map<TKey, TValue>;

  constructor(source: Map<TKey, TValue>) {
    this._source = source;
  }

  moveNext(): boolean {
    throw new Error('Method not implemented.');
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): Iterator<[TKey, TValue], any, undefined> {
    return this._source[Symbol.iterator]();
  }
}
