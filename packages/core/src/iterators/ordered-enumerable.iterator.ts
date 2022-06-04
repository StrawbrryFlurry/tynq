import { IEnumerable } from '../enumerable';
import { Comparer, ResultSelector } from '../types';
import { Iterator } from './iterator';

export class OrderedEnumerable<TSource, TKey> extends Iterator<TSource> {
  source: IEnumerable<TSource>;
  keySelector: ResultSelector<TSource, TKey>;
  comparer: Comparer<TKey, TKey>;

  constructor(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey> = (x) => <TKey>(<unknown>x),
    comparer: Comparer<TKey, TKey>,
    descending: boolean
  ) {
    super();
    this.source = source;
    this.keySelector = keySelector;
    this.comparer = comparer;
  }

  public moveNext(): boolean {
    throw new Error('Method not implemented.');
  }
}

function swap(items: any, leftIndex: any, rightIndex: any): any {
  var temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}
function partition(items: any, left: any, right: any): any {
  var pivot = items[Math.floor((right + left) / 2)], //middle element
    i = left, //left pointer
    j = right; //right pointer
  while (i <= j) {
    while (items[i] < pivot) {
      i++;
    }
    while (items[j] > pivot) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j); //sawpping two elements
      i++;
      j--;
    }
  }
  return i;
}

function quickSort(items: any, left: any, right: any): any {
  var index;
  if (items.length > 1) {
    index = partition(items, left, right); //index returned from partition
    if (left < index - 1) {
      //more elements on the left side of the pivot
      quickSort(items, left, index - 1);
    }
    if (index < right) {
      //more elements on the right side of the pivot
      quickSort(items, index, right);
    }
  }
  return items;
}
