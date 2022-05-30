import { IEnumerator } from '../enumerator.interface';

export class StringEnumerator implements IEnumerator<string> {
  public current: string | null = null;

  private _source: string;

  constructor(source: string) {
    this._source = source;
  }

  moveNext(): boolean {
    throw new Error('Method not implemented.');
  }

  reset(): void {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): Iterator<string> {
    return this._source[Symbol.iterator]();
  }
}
