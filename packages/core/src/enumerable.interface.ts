import { Enumerable, MethodInvocationException } from './enumerable';
import { Enumerator } from './enumerator';
import { IEnumerator } from './enumerator.interface';
import { Compare, EnumerableSource, Predicate, ResultSelector } from './types';

/**
 * Represents a generic collection like an array, list or map
 * that can be enumerated.
 */
// This would ideally be an interface that only exposes getEnumerator
// because we cannot attach methods to interfaces this needs to
// be a class that derivates from Enumerable can extend in order to
// implement its functionality.
export abstract class IEnumerable<TSource> implements Iterable<TSource> {
  /**
   * Returns the sequence as an array.
   */
  public toArray(): TSource[] {
    return Enumerable.toArray(this);
  }

  /**
   * Returns the sequence as a map, using the
   * keySelector function to generate the key
   * for each entry.
   */
  public toMap<TKey, TValue>(
    keySelector: ResultSelector<TSource, TKey>
  ): Map<TKey, TValue>;
  /**
   * Returns the sequence as a map, using the
   * keySelector function to generate the key
   * for each entry; and the valueSelector function
   * to generate the value for each entry.
   */
  public toMap<TKey, TValue>(
    keySelector: ResultSelector<TSource, TKey>,
    valueSelector: ResultSelector<TSource, TValue>
  ): Map<TKey, TValue>;
  public toMap<TKey, TValue>(
    keySelector: ResultSelector<TSource, TKey>,
    valueSelector?: ResultSelector<TSource, TValue>
  ): Map<TKey, TValue> {
    return Enumerable.toMap(this, keySelector, valueSelector);
  }

  /**
   * Returns the sequence as a set.
   */
  public toSet(): Set<TSource> {
    return Enumerable.toSet(this);
  }

  /**
   * Splits the elements of a sequence into chunks of size at most size.
   */
  public chunk(size: number): IEnumerable<TSource[]> {
    return Enumerable.chunk(this, size);
  }

  /**
   * Splits the elements of a sequence into chunks of specified size.
   * If the sequence is shorter than the size, the last chunk will be
   * null.
   */
  public chunkOrDefault(size: number): IEnumerable<TSource[] | null>;
  /**
   * Splits the elements of a sequence into chunks of specified size.
   * If the sequence is shorter than the size, the last chunk will be
   * a default value.
   */
  public chunkOrDefault(
    size: number,
    defaultValue: TSource[]
  ): IEnumerable<TSource[] | null>;
  public chunkOrDefault(
    size: number,
    defaultValue?: TSource[]
  ): IEnumerable<TSource[] | null> {
    return Enumerable.chunkOrDefault(this, size, defaultValue);
  }

  /**
   * Concatenates two sequences.
   * This represents the concat LINQ method
   * and is named this way as to not interfer with
   * the JS Array.concat method.
   */
  public chain(second: IEnumerable<TSource>): IEnumerable<TSource> {
    return Enumerable.chain(this, second);
  }

  /**
   * Appends an element to the end of the sequence.
   */
  public append(element: TSource): IEnumerable<TSource> {
    return Enumerable.append(this, element);
  }

  /**
   * Returns the count of elements in the sequence.
   */
  public count(): number {
    return Enumerable.count(this);
  }

  /**
   * Returns a single element of a sequence.
   *
   * @throws {@link MethodInvocationException } If the sequence is empty
   * or contains more than one element.
   */
  public single(predicate?: Predicate<TSource>): TSource {
    return Enumerable.single(this, predicate);
  }

  /**
   * Returns the only element of a sequence or null
   * if the sequence is empty, or contains more than one element.
   */
  public singleOrDefault(): TSource | null;
  /**
   * Returns the only element of a sequence that satisfies a condition
   * or null if no such element exists.
   */
  public singleOrDefault(predicate: Predicate<TSource>): TSource | null;
  /**
   * Returns the only element of a sequence or a default value
   * if the sequence is empty, or contains more than one element.
   */
  public singleOrDefault(defaultValue?: TSource): TSource;
  /**
   * Returns the only element of a sequence that satisfies a
   * condition or a default value if no such element exists
   */
  public singleOrDefault(
    predicate: Predicate<TSource>,
    defaultValue: TSource
  ): TSource;
  public singleOrDefault(
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    return Enumerable.singleOrDefault(
      this,
      <Predicate<TSource>>predicate,
      <TSource>defaultValue
    );
  }

  /**
   * Returns a sequence that contains all elements that
   * satisfy the condition.
   */
  public where(predicate: Predicate<TSource>): IEnumerable<TSource> {
    return Enumerable.where(this, predicate);
  }

  /**
   * Projects each element of a sequence into a new form.
   */
  public select<TResult>(
    selector: ResultSelector<TSource, TResult>
  ): IEnumerable<TResult> {
    return Enumerable.select(this, selector);
  }

  /**
   * Returns the first element of a sequence.
   *
   * @throws {@link MethodInvocationException } If the sequence is empty
   */
  public first(): TSource;
  /**
   * Returns the first element of a sequence
   * that satisfies a condition.
   *
   * @throws {@link MethodInvocationException } If the sequence
   * contains no such element.
   */
  public first(predicate: Predicate<TSource>): TSource;
  public first(predicate?: Predicate<TSource>): TSource {
    return Enumerable.first(this, predicate);
  }

  /**
   * Returns the first element of a sequence, or null if
   * the sequence contains no elements.
   */
  public firstOrDefault(): TSource | null;
  /**
   * Returns the first element of the sequence that satisfies
   * a condition or null if no such element exists.
   */
  public firstOrDefault(predicate: Predicate<TSource>): TSource | null;
  /**
   * Returns the first element of the sequence or a
   * default value if the sequence contains no elements.
   */
  public firstOrDefault(defaultValue?: TSource): TSource;
  /**
   * Returns the first element of the sequence that satisfies
   * a condition or a default value if no such element exists.
   */
  public firstOrDefault(
    predicate: Predicate<TSource>,
    defaultValue: TSource
  ): TSource;
  public firstOrDefault(
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    return Enumerable.firstOrDefault(
      this,
      <Predicate<TSource>>predicate,
      <TSource>defaultValue
    );
  }

  /**
   * Returns the last element of a sequence.
   *
   * @throws {@link MethodInvocationException } If the sequence is empty
   */
  public last(): TSource;
  /**
   * Returns the last element of a sequence
   * that satisfies a condition.
   *
   * @throws {@link MethodInvocationException } If the sequence
   * contains no such element.
   */
  public last(predicate: Predicate<TSource>): TSource;
  public last(predicate?: Predicate<TSource>): TSource {
    return Enumerable.last(this, predicate);
  }

  /**
   * Returns the last element of a sequence
   * or null if the sequence contains no elements.
   */
  public lastOrDefault(): TSource | null;
  /**
   * Returns the last element of a sequence that satisfies a condition
   * or null if no such element exists.
   */
  public lastOrDefault(predicate: Predicate<TSource>): TSource | null;
  /**
   * Returns the last element of a sequence or
   * a default value if the sequence contains no elements.
   */
  public lastOrDefault(defaultValue?: TSource): TSource;
  /**
   * Returns the last element of a sequence that satisfies a condition
   * or a default value if no such element exists.
   */
  public lastOrDefault(
    predicate: Predicate<TSource>,
    defaultValue: TSource
  ): TSource;
  public lastOrDefault(
    predicate?: Predicate<TSource> | TSource,
    defaultValue?: TSource
  ): TSource | null {
    return Enumerable.lastOrDefault(
      this,
      <Predicate<TSource>>predicate,
      <TSource>defaultValue
    );
  }

  /**
   * Determines wether the sequence has any elements.
   */
  public any(): boolean;
  /**
   * Determines wether the sequence has any elements
   * that satisfy the predicate.
   */
  public any(predicate: Predicate<TSource>): boolean;
  public any(predicate?: Predicate<TSource>): boolean {
    return Enumerable.any(this, predicate);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  public all(predicate: Predicate<TSource>): boolean {
    return Enumerable.all(this, predicate);
  }

  /**
   * Determines whether a sequence contains a specified element.
   */
  public contains(value: TSource): boolean {
    return Enumerable.contains(this, value);
  }

  /**
   * Applies an accumulator function over a sequence.
   */
  public aggregate<TAccumulate>(
    accumulator: (acc: TSource, element: TSource) => TSource
  ): TSource;
  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value.
   */
  public aggregate<TAccumulate>(
    accumulator: (acc: TAccumulate, element: TSource) => TAccumulate,
    seed: TAccumulate
  ): TAccumulate;
  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value,
   * and the specified function is used to select the result value.
   */
  public aggregate<TAccumulate, TResult>(
    accumulator: (acc: TAccumulate, element: TSource) => TAccumulate,
    seed: TAccumulate,
    resultSelector: ResultSelector<TAccumulate, TResult>
  ): TResult;
  public aggregate<TAccumulate, TResult>(
    accumulator: (acc: TAccumulate, element: TSource) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: ResultSelector<TAccumulate, TResult>
  ): TResult {
    return <TResult>(
      Enumerable.aggregate(this, accumulator, seed!, resultSelector!)
    );
  }

  /**
   * Returns the maximum value in the sequence.
   *
   * @param compare An optional compare function (a, b) => bool,
   * where a > b should be true if a is greater than b. If omitted
   * the values are compared by using the `>` operator.
   */
  public max(compare?: Compare<TSource, TSource>): TSource {
    return Enumerable.max(this, compare);
  }

  /**
   * Returns the minimum value in the sequence.
   *
   * @param compare An optional compare function (a, b) => bool,
   * where a < b should be true if a is smaller than b. If omitted
   * the values are compared by using the `<` operator.
   */
  public min(compare?: Compare<TSource, TSource>): TSource {
    return Enumerable.min(this, compare);
  }

  /**
   * Sums up the sequence using the `+` operator.
   */
  static sum<TSource>(source: IEnumerable<TSource>): TSource;
  /**
   * Sums up the result of the selector using the `+` operator.
   */
  static sum<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector: ResultSelector<TSource, TResult>
  ): TResult;
  static sum<TSource, TResult>(
    source: IEnumerable<TSource>,
    selector?: ResultSelector<TSource, TResult>
  ): TResult {
    return Enumerable.sum(source, selector);
  }

  /**
   * Returns the IEnumerator of the source.
   */
  public abstract getEnumerator(): IEnumerator<TSource>;

  public [Symbol.iterator](): Iterator<TSource> {
    return this.getEnumerator().getIterator();
  }

  /**
   * Creates a new IEnumerable implementation, wrapping
   * the source iterator.
   */
  public static create<TSource>(
    source: EnumerableSource<TSource>
  ): IEnumerable<TSource> {
    return new EnumerableImpl<TSource>(source);
  }
}

class EnumerableImpl<TSource> extends IEnumerable<TSource> {
  private _enumerator: IEnumerator<TSource>;

  constructor(source: EnumerableSource<TSource>) {
    super();
    this._enumerator = new Enumerator(source);
  }

  public getEnumerator(): IEnumerator<TSource> {
    return this._enumerator;
  }
}

const __method_invocation_exception_import_ref__ = MethodInvocationException;
