import { EqualityComparer, ResultSelector } from '../types';
import { Enumerable } from './enumerable';

import type { IEnumerable } from './enumerable.interface';

export interface ILookup<TKey, TElement> {}

export class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {
  private _comparer: EqualityComparer<TKey>;
  private _groupings: Grouping<TKey, TElement>[] = [];

  constructor(comparer: EqualityComparer<TKey> = EqualityComparer.default) {
    this._comparer = comparer;
  }

  public static create<TKey, TSource, TElement = TSource>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    elementSelector?: ResultSelector<TSource, TElement> | null,
    comparer?: EqualityComparer<TKey>
  ): Lookup<TKey, TElement> {
    const l = new Lookup<TKey, TElement>(comparer);
    const e = source.getEnumerator();
    elementSelector ??= ResultSelector.default;

    while (e.moveNext()) {
      const c = e.current!;
      const key = keySelector(c);
      const grouping = l.getGrouping(key, true)!;
      const element = elementSelector(c);

      grouping.add(element);
    }

    return l;
  }

  public getGroups(): IGrouping<TKey, TElement>[] {
    return this._groupings;
  }

  public getGroupElements(key: TKey): IEnumerable<TElement> {
    const grouping = this.getGrouping(key);

    if (grouping === null) {
      return Enumerable.empty();
    }

    return grouping.elements;
  }

  public getGrouping(
    key: TKey,
    create: boolean = false
  ): Grouping<TKey, TElement> | null {
    for (let i = 0; i < this._groupings.length; i++) {
      const grouping = this._groupings[i];

      if (this._comparer(grouping.key, key)) {
        return grouping;
      }
    }

    if (!create) {
      return null;
    }

    const grouping = new Grouping<TKey, TElement>(key);

    this._groupings.push(grouping);

    return grouping;
  }
}

export interface IGrouping<TKey, TElement> {
  key: TKey;
  elements: IEnumerable<TElement>;
}

export class Grouping<TKey, TElement> implements IGrouping<TKey, TElement> {
  public readonly key!: TKey;
  public readonly elements: TElement[];
  public get count(): number {
    return this.elements.length;
  }

  constructor(key: TKey, elements: TElement[] = []) {
    this.key = key;
    this.elements = elements;
  }

  public atIndex(idx: number): TElement {
    return this.elements[idx];
  }

  public add(element: TElement): void {
    this.elements.push(element);
  }
}
