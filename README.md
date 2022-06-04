# TYNQ - TypeScript-Integrated Query

TYNQ is a port of C# LINQ to compose enumerable sequences using the existing iterator pattern.

TYNQ defines a standard way to interact with any sequence of elements that implements an iterator. Native types that are iterable are patched by importing from the index file `@tync/core`. Custom types can be patched by using the `patchAsEnumerable`.

# Install TYNQ from npm

```
npm install @tynq/core
```

# `IEnumerator<T>`

Defines a standardized way of iterating over a sequence of elements. An Enumerator also implements `Iterable<T>`, meaning that it can be used by existing elements of the language like `for of` or the spread `...` operator.

## Create an enumerator from an existing iterator

```ts
import { IterableEnumerator } from '@tynq/core';

const source = [1, 2, 3];
const enumerator = new IterableEnumerator(source);

while (enumerator.moveNext()) {
  console.log(enumerator.current);
  // 1
  // 2
  // 3
}
```

## Implement a custom `IEnumerator<T>`

```ts
import { IEnumerator } from '@tynq/core';

export class BoxEnumerator implements IEnumerator<Box> {
  private _collection: BoxCollection;
  private _index: number;

  public get current(): Box {
    return this._collection[this._index];
  }

  public constructor(collection: BoxCollection) {
    this._collection = collection;
    this._index = -1;
  }

  public moveNext(): boolean {
    if (++this._index >= this._collection.count) {
      return false;
    }

    return true;
  }

  public reset(): void {
    this._index = -1;
  }

  public [Symbol.iterator](): Iterator<Box> {
    throw 'Implement iterator';
  }
}
```

# `IEnumerable<T>`

Exposes a generic set of methods that can be used to enumerate a sequence of elements. An `IEnumerable<T>` only needs to implement a single method, `getEnumerator` that returns the enumerator for the sequence. Because of language limitations, `IEnumerable<T>` is an abstract class that needs to be extended when creating a custom type that implements `IEnumerable<T>`. All native elements are already patched to implement the interface when the package is imported.

```ts
import "@tynq/core";

// Using arrays
const source = [1, 2, 3];
const first = source.first(); // 1
const where = source
  .where((e) => e > 1)
  .where((e) => e < 3)
  .single(); // 2

// Using map
const source = [
  { username: "Michael", id: 1 }
  { username: "Matt", id: 2 },
  { username: "Ian", id: 3 }
]

const users = source
      .where((e) => e.id > 1)
      .toMap((e) => e.id, (e) => e.username)
      .skip(1)
      .count(); // 1
```

## Implementing `IEnumerable<T>`

In order to implement `IEnumerable<T>`, the type needs to extend the base `IEnumerable<T>` class, and implement the `getEnumerator` method.

```ts
import { Enumerator, IEnumerable } from '@tynq/core';

export interface IList<T> extends IEnumerable<[TKey, TValue]> {
  add(item: T): void;
  clear(): void;
}

export class List<T> extends IEnumerable<T> implements IList<T> {
  private _list: T[] = [];

  public getEnumerator(): IEnumerator<T> {
    const listIterator = function* () {
      for (const element of this._list) {
        yield element;
      }
    };

    return new Enumerator(listIterator);
  }

  public add(item: T): void {
    this._list.push(item);
  }

  public clear(): void {
    this._list.length = 0;
  }
}
```

## Patching an existing type to support `IEnumerable<T>`

If you have existing types that should also support `IEnumerable<T>`'s functionality without having the ability to make it extend the class, you can use the `patchAsEnumerable` method
to change the inherited prototype to be IEnumerable. Additionally, if the type does not implement `IEnumerator<T>`, you can define the Enumerator implementation that will be used when `getEnumerator` is called on an instance of that type.

```ts
import { patchAsEnumerable, ArrayEnumerator } from '@tynq/core';

patchAsEnumerable(Array, ArrayEnumerator);

[].getEnumerator(); // ArrayEnumerator
```

## Using custom `IEnumerable<T>`

```ts
import { List } from './list';

const list = new List<number>();
list.add(1);
list.add(2);
list.add(3);

list.count(); // 3
list.sum(); // 6

list.clear();
list.count(); // 0
list.any(); // false
```
