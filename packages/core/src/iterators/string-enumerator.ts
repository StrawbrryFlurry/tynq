import { ArgumentException } from '@core/exceptions';

import { IndexableIterator } from './indexable.iterator';

export class StringEnumerator extends IndexableIterator<string> {
  constructor(source: string) {
    if (typeof source !== 'string') {
      throw new ArgumentException('Source is not a string');
    }

    super(source);
  }
}
