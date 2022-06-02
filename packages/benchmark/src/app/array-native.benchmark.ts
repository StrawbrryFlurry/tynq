import { User } from './user';

export const arrayNative = (source: User[]) => {
  const isEvery = source
    .filter((x) => x.age > 10)
    .filter((x) => x.id.startsWith('5'))
    .filter((x) => x.lastName !== 'Albert')
    .map((x) => x.firstName + x.lastName)
    .every((x) => x === 'IanChad');
};
