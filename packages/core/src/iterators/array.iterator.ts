import { ArgumentException } from '../exceptions';
import { IndexableIterator } from './indexable.iterator';

export class ArrayEnumerator<T> extends IndexableIterator<T> {
  constructor(source: T[]) {
    if (!Array.isArray(source)) {
      throw new ArgumentException('source must be an array');
    }

    super(source);
  }
}
