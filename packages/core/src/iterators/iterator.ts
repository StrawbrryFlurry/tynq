import { EnumerableImpl } from '../enumerable.interface';
import { IEnumerator } from '../enumerator.interface';

export abstract class EnumerableIterator<TSource>
  extends EnumerableImpl<TSource>
  implements IEnumerator<TSource>
{
  public current: TSource | null = null;

  public reset(): void {
    this.enumerator.reset();
  }

  public getIterator(): Iterator<TSource, any, undefined> {
    return this.enumerator.getIterator();
  }

  public [Symbol.iterator](): Iterator<TSource> {
    return this.getIterator();
  }

  public abstract moveNext(): boolean;
}
