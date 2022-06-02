import { IEnumerable } from '@core/enumerable';

import { User } from './user';

export const arrayEnumerable = (source: IEnumerable<User>) => {
  const isAll = source
    .where((x) => x.age > 10)
    .where((x) => x.id.startsWith('5'))
    .where((x) => x.lastName !== 'Albert')
    .select((x) => x.firstName + x.lastName)
    .all((x) => x === 'IanChad');
};
