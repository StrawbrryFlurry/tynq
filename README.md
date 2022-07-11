# TYNQ - TypeScript-Integrated Query

Empower your collections with lots of generic query functions.

TYNQ defines a standard way to interact with any sequence of elements that implements an iterable interface. Native types, that are iterable, are patched to support this interface by importing from the index file `@tynq/core`. Custom types can be patched by using the `patchAsEnumerable`.

# Install TYNQ from npm

```
npm install @tynq/core
```

## Usage

```ts
// Import TYNQ in the entry point of your project
// main.ts
import '@tynq/core';

console.log([1, 2, 3].select((x) => x + 1)); // [2, 3, 4]
```

# Performance considerations

TYNQ allows users to define iterable queries that are only evaluated, when the result of the query is actually enumerated. If you were to define a where query on an array,
this query would not run until you call an enumerating method on the query result or iterate over it by means of using the iterator (`for .. of` / `...`). Additionally, query operators
don't allocate a new collection for the query result but instead only return an `IEnumerator` whose prototype is the `IEnumerable` class. Depending on the Enumerator implementation this may or may not allocate more memory than an array operator that returns a new array with updated elements.

## Implementation

When you import anything from TYNQ, it will automatically change the parent prototype of all native iterable types from `object` to `IEnumerable`:

```
Before: Array => ArrayPrototype => ObjectPrototype
After: Array => ArrayPrototype => IEnumerablePrototype => ObjectPrototype
```

Changing the prototype of objects tends to be suboptimal, especially when the runtime already cached some information about the location of certain methods on an object. If you import TYNQ before any other custom code is run, you should be on the safe side. However, even before your import statements are run there's a lot of bootstrap code from the runtime that is executed which might lead to some performance overhead. Native methods of iterables should not be impacted though. Please make sure that these changes are not a problem for your application.

## Generator functions are **SLOW**

JavaScript iterators are generally slower than iterating over an object directly. Generator functions, which help to build iterators, are _A LOT_ slower than just defining the iterator manually. If you're implementing your own iterable object for IEnumerable, be sure to take this into consideration when implementing the `getEnumerator` and `[Symbol.iterator]` methods.

To avoid falling into this pitfall, your type can either extend `EnumeratorStateMachine<T>` or use `EnumeratorStateMachine.create(setupFn)` to create an enumerator that does not use the generator pattern.

```ts
import { IEnumerable, EnumeratorStateMachine } from '@tynq/core';

class FastList<T> extends IEnumerable<T> {
  public _items: T[];

  public getEnumerator(): IEnumerator<T> {
    return EnumeratorStateMachine.create(() => /* Setup context */ {
      const length = _items.length;
      let index = -1;

      /* Value generator */
      return () => {
        index++;
        if (index < length) {
          return _items[index];
        }

        return DONE;
      };
    });
  }
}
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

Exposes a generic set of methods that can be used to enumerate a sequence of elements. An `IEnumerable<T>` only needs to implement a single method, `getEnumerator` that returns the enumerator for the sequence. Because of language limitations, `IEnumerable<T>` is an abstract class that needs to be extended when creating a custom type that should implement `IEnumerable<T>`. All native elements are already patched to implement the interface when the package is imported.

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
import { Enumerator, IEnumerable, IterableEnumerator } from '@tynq/core';

export interface IList<T> extends IEnumerable<[TKey, TValue]> {
  add(item: T): void;
  clear(): void;
}

export class List<T> extends IEnumerable<T> implements IList<T> {
  private _list: T[] = [];

  public getEnumerator(): IEnumerator<T> {
    // See performance section about generator functions
    const listIterator = function* () {
      for (const element of this._list) {
        yield element;
      }
    };

    return new IterableEnumerator(listIterator);
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
