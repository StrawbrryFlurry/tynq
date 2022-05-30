import { User } from './user';

export const makeEnumerableSource = () => {
  let idx = 0;
  return new Array(1_000_000)
    .select((_) => {
      const user = new User(idx);
      idx++;
      return user;
    })
    .toArray();
};

export const makeArraySource = () => {
  return new Array(1_000_000).map((_, idx) => {
    return new User(idx);
  });
};
