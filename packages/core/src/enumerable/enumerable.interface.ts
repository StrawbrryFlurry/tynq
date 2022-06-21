import { IEnumerator } from '../enumerator';
import { MethodInvocationException } from '../exceptions';
import {
  Action,
  Comparer,
  EqualityComparer,
  GroupByResultSelector,
  JoinResultSelector,
  Predicate,
  ResultSelector,
  ResultSelectorWithIndex,
} from '../types';
import { Enumerable } from './enumerable';
import { IGrouping } from './lookup';

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
   * Returns the sequence as an enumerable.
   */
  public asEnumerable(): IEnumerable<TSource> {
    return this;
  }

  /**
   * Returns the sequence as an array.
   */
  public toArray(): TSource[] {
    return Enumerable.toArray(this);
  }

  /**
   * Converts an IEnumerable of promises to a single
   * promise that can be awaited.
   */
  public async toAwaitable(): Promise<IEnumerable<Awaited<TSource>>> {
    return Enumerable.toAwaitable(this);
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
   * Returns a new enumerable, wrapping the
   * sequence of this enumerable. This is useful,
   * when you need to call an ambiguous method on
   * the enumerable. `Array.prototype.forEach` will
   * always be called on an array, even if it's type
   * is `IEnumerable<T>`.
   */
  public toEnumerable(): IEnumerable<TSource> {
    return Enumerable.toEnumerable(this);
  }

  /**
   * Returns a specified number of contiguous elements
   * from the start of a sequence.
   */
  public take(count: number): IEnumerable<TSource> {
    return Enumerable.take(this, count);
  }

  /**
   * Returns elements of a sequence
   * while a specified predicate resolves to true.
   */
  public takeWhile(
    predicate: (value: TSource, index: number) => boolean
  ): IEnumerable<TSource> {
    return Enumerable.takeWhile(this, predicate);
  }

  /**
   * Returns the last `count` elements of a sequence.
   */
  public takeLast(count: number): IEnumerable<TSource> {
    return Enumerable.takeLast(this, count);
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
   * and is named this way as to not interfere with
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
   * Prepends an element to the beginning of the sequence.
   */
  public prepend(element: TSource): IEnumerable<TSource> {
    return Enumerable.prepend(this, element);
  }

  /**
   * Returns the count of elements in the sequence.
   */
  public count(): number {
    return Enumerable.count(this);
  }

  /**
   * Returns distinct elements of a sequence,
   * using Object.is equality.
   */
  public distinct(): IEnumerable<TSource>;
  /**
   * Returns distinct elements of a sequence,
   * using a specified equality comparer.
   */
  public distinct(
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;
  public distinct(
    equalityComparer?: EqualityComparer<TSource>
  ): IEnumerable<TSource> {
    return Enumerable.distinct(this, equalityComparer);
  }

  /**
   * Returns distinct elements from a sequence by using
   * a specified key selector function whose values
   * are compared using `Object.is` equality.
   */
  public distinctBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>
  ): IEnumerable<TSource>;
  /**
   * Returns distinct elements from a sequence according to
   * a specified key selector function and using a specified
   * comparer to compare selected values.
   */
  public distinctBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;
  public distinctBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return Enumerable.distinctBy(this, keySelector, equalityComparer);
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
   * Bypasses a specified number of elements in a sequence
   * and then returns the remaining elements.
   */
  public skip(count: number): IEnumerable<TSource> {
    return Enumerable.skip(this, count);
  }

  /**
   * Returns a sequence that contains the elements
   * from source with the last `count` elements of the source
   * collection omitted.
   */
  public skipLast(count: number): IEnumerable<TSource> {
    return Enumerable.skipLast(this, count);
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true
   * and then returns the remaining elements.
   */
  public skipWhile(
    predicate: (element: TSource, index: number) => boolean
  ): IEnumerable<TSource> {
    return Enumerable.skipWhile(this, predicate);
  }

  /**
   * Determines whether two sequences are equal
   * according to `Object.is` equality.
   */
  public sequenceEqual(second: IEnumerable<TSource>): boolean;
  /**
   * Determines whether two sequences are equal
   * according to an equality comparer.
   */
  public sequenceEqual(
    second: IEnumerable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): boolean;
  public sequenceEqual(
    second: IEnumerable<TSource>,
    equalityComparer?: EqualityComparer<TSource>
  ): boolean {
    return Enumerable.sequenceEqual(this, second, equalityComparer);
  }

  /**
   * Returns a sequence containing all elements that are
   * an instance of a specified type.
   */
  public ofType<TType extends Function>(type: TType): IEnumerable<TType> {
    return Enumerable.ofType(this, type);
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
    selector: ResultSelectorWithIndex<TSource, TResult>
  ): IEnumerable<TResult> {
    return Enumerable.select(this, selector);
  }

  /**
   * Projects each element of a sequence to an IEnumerable<T>
   * and flattens the resulting sequences into one sequence.
   */
  public selectMany<TCollection>(
    collectionSelector: ResultSelector<TSource, IEnumerable<TCollection>>
  ): IEnumerable<TCollection>;
  /**
   * Projects each element of a sequence to an IEnumerable<T>
   * and flattens the resulting sequences into one sequence,
   * and invokes a result selector function on each element.
   */
  public selectMany<TCollection, TResult>(
    collectionSelector: ResultSelector<TSource, IEnumerable<TCollection>>,
    resultSelector: ResultSelector<TCollection, TResult>
  ): IEnumerable<TResult>;
  public selectMany<TCollection, TResult>(
    collectionSelector: ResultSelector<TSource, IEnumerable<TCollection>>,
    resultSelector?: ResultSelector<TCollection, TResult>
  ): IEnumerable<TResult | TCollection> {
    return Enumerable.selectMany(this, collectionSelector, resultSelector);
  }

  /**
   * Performs a specified action on each element of a sequence.
   */
  public forElement(action: Action<TSource>): void {
    Enumerable.forElement(this, action);
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
   * Returns the element at a specified index in a sequence.
   *
   * @throws {@link MethodInvocationException } If the index is out of range
   */
  public elementAt(index: number): TSource {
    return Enumerable.elementAt(this, index);
  }

  /**
   * Reverses the order of the elements in a sequence.
   *
   * @remarks
   * This method enumerates all elements in the sequence
   * when the sequence is enumerated.
   */
  public reverse(): IEnumerable<TSource> {
    return Enumerable.reverse(this);
  }

  /**
   * Returns the element at a specified index in a sequence or null
   * if the index is out of range.
   */
  public elementAtOrDefault(index: number): TSource | null;
  /**
   * Returns the element at a specified index in a sequence or a default value
   * if the index is out of range.
   */
  public elementAtOrDefault(index: number, defaultValue: TSource): TSource;
  public elementAtOrDefault(
    index: number,
    defaultValue?: TSource
  ): TSource | null {
    return Enumerable.elementAtOrDefault(this, index, defaultValue);
  }

  /**
   * Returns a sequence containing the difference of two sequences.
   * Uses `Object.is` equality to compare elements.
   *
   * @remarks
   * This method returns those elements in first that don't appear
   * in second. It doesn't return those elements in second that
   * don't appear in first.
   */
  public except(second: IEnumerable<TSource>): IEnumerable<TSource>;
  /**
   * Returns a sequence containing the difference of two sequences.
   * Uses the specified equality comparer to compare elements.
   *
   * @remarks
   * This method returns those elements in first that don't appear
   * in second. It doesn't return those elements in second that
   * don't appear in first.
   */
  public except(
    second: IEnumerable<TSource>,
    comparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;
  public except(
    second: IEnumerable<TSource>,
    comparer?: EqualityComparer<TSource>
  ): IEnumerable<TSource> {
    return Enumerable.except(this, second, comparer);
  }

  /**
   * Returns a sequence containing the difference of two sequences
   * according to a selector function. Uses `Object.is` equality
   * to compare elements.
   *
   * @remarks
   * This method returns those elements in first that don't appear
   * in second. It doesn't return those elements in second that
   * don't appear in first.
   */
  public exceptBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>
  ): IEnumerable<TSource>;
  /**
   * Returns a sequence containing the difference of two sequences
   * according to a selector function. Uses the specified equality
   * comparer to compare elements.
   *
   * @remarks
   * This method returns those elements in first that don't appear
   * in second. It doesn't return those elements in second that
   * don't appear in first.
   */
  public exceptBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    comparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;
  public exceptBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    comparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return Enumerable.exceptBy<TSource, TKey>(
      this,
      second,
      keySelector,
      comparer
    );
  }

  /**
   * Produces the set intersection of two sequences by using
   * `Object.is` equality to compare values.
   */
  public intersect(second: IEnumerable<TSource>): IEnumerable<TSource>;
  /**
   * Produces the set intersection of two sequences by using
   * a specified equality comparer to compare values.
   */
  public intersect(
    second: IEnumerable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;
  public intersect(
    second: IEnumerable<TSource>,
    equalityComparer?: EqualityComparer<TSource>
  ): IEnumerable<TSource> {
    return Enumerable.intersect(this, second, equalityComparer);
  }

  /**
   * Produces the set intersection of two sequences according
   * to a specified key selector function using
   * `Object.is` equality to compare values.
   */
  public intersectBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>
  ): IEnumerable<TSource>;
  /**
   * Produces the set intersection of two sequences according
   * to a specified key selector function using
   * a specified equality comparer to compare values.
   */
  public intersectBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;
  public intersectBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return Enumerable.intersectBy(this, second, keySelector, equalityComparer);
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
   * Uses the `>` operator to compare elements.
   */
  public max(): TSource;
  /**
   * Returns the maximum value in the sequence.
   * Uses a specified comparer to compare elements.
   */
  public max(compare: Comparer<TSource, TSource>): TSource;
  public max(compare?: Comparer<TSource, TSource>): TSource {
    return Enumerable.max(this, compare);
  }

  /**
   * Returns the maximum value in the sequence according to
   * a specified key selector function.
   */
  public maxBy<TKey>(keySelector: ResultSelector<TSource, TKey>): TKey;
  /**
   * Returns the maximum value in the sequence according to
   * a specified key selector function and a specified
   * key comparer.
   */
  public maxBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>,
    comparer: Comparer<TKey, TKey>
  ): TKey;
  public maxBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>,
    comparer?: Comparer<TKey, TKey>
  ): TKey {
    return Enumerable.maxBy(this, keySelector, comparer);
  }

  /**
   * Returns the minimum value in the sequence.
   * Uses the `<` operator to compare elements.
   */
  public min(): TSource;
  /**
   * Returns the maximum value in the sequence.
   * Uses a specified comparer to compare elements.
   */
  public min(compare: Comparer<TSource, TSource>): TSource;
  public min(compare?: Comparer<TSource, TSource>): TSource {
    return Enumerable.min(this, compare);
  }

  /**
   * Returns the minimum value in the sequence according to
   * a specified key selector function.
   */
  public minBy<TKey>(keySelector: ResultSelector<TSource, TKey>): TKey;
  /**
   * Returns the minimum value in the sequence according to
   * a specified key selector function and a specified
   * key comparer.
   */
  public minBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>,
    comparer: Comparer<TKey, TKey>
  ): TKey;
  public minBy<TKey>(
    keySelector: ResultSelector<TSource, TKey>,
    comparer?: Comparer<TKey, TKey>
  ): TKey {
    return Enumerable.minBy(this, keySelector, comparer);
  }

  /**
   * Sums up the sequence using the `+` operator.
   */
  public sum(source: IEnumerable<TSource>): TSource;
  /**
   * Sums up the result of the selector using the `+` operator.
   */
  public sum<TResult>(
    source: IEnumerable<TSource>,
    selector: ResultSelector<TSource, TResult>
  ): TResult;
  public sum<TResult>(
    source: IEnumerable<TSource>,
    selector?: ResultSelector<TSource, TResult>
  ): TResult {
    return Enumerable.sum(source, selector);
  }

  /**
   * Produces a sequence of unique elements of both sequences.
   * Uses `Object.is` equality to compare elements.
   */
  public union(second: IEnumerable<TSource>): IEnumerable<TSource>;
  /**
   * Produces a sequence of unique elements of both sequences.
   * Uses a specified equality comparer to compare elements.
   */
  public union(
    second: IEnumerable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;
  public union(
    second: IEnumerable<TSource>,
    equalityComparer?: EqualityComparer<TSource>
  ): IEnumerable<TSource> {
    return Enumerable.union(this, second, equalityComparer);
  }

  /**
   * Produces a sequence of unique elements of both sequences
   * according to a specified key selector.
   * Uses `Object.is` equality to compare elements.
   */
  public unionBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>
  ): IEnumerable<TSource>;
  /**
   * Produces a sequence of unique elements of both sequences
   * according to a specified key selector.
   * Uses a specified equality comparer to compare elements.
   */
  public unionBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;
  public unionBy<TKey>(
    second: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return Enumerable.unionBy(this, second, keySelector, equalityComparer);
  }

  /**
   * Correlates the elements of two sequences based on matching keys.
   * Uses `Object.is` equality to compare keys.
   */
  public innerJoin<TInner, TKey, TResult>(
    /**
     * The sequence to join to the first sequence.
     */
    inner: IEnumerable<TInner>,
    /**
     * A function to extract the join key from each
     * element of the first sequence.
     */
    outerKeySelector: ResultSelector<TSource, TKey>,
    /**
     * A function to extract the join key from each
     * element of the second sequence.
     */
    innerKeySelector: ResultSelector<TInner, TKey>,
    /**
     * A function to create a result element from two matching elements.
     */
    resultSelector: JoinResultSelector<TSource, TInner, TResult>
  ): IEnumerable<TResult>;
  /**
   * Correlates the elements of two sequences based on matching keys.
   * Uses a specified equality comparer to compare keys.
   */
  public innerJoin<TInner, TKey, TResult>(
    /**
     * The sequence to join to the first sequence.
     */
    inner: IEnumerable<TInner>,
    /**
     * A function to extract the join key from each
     * element of the first sequence.
     */
    outerKeySelector: ResultSelector<TSource, TKey>,
    /**
     * A function to extract the join key from each
     * element of the second sequence.
     */
    innerKeySelector: ResultSelector<TInner, TKey>,
    /**
     * A function to create a result element from two matching elements.
     */
    resultSelector: JoinResultSelector<TSource, TInner, TResult>,
    /**
     * An equality comparer to compare keys.
     */
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;
  public innerJoin<TInner, TKey, TResult>(
    inner: IEnumerable<TInner>,
    outerKeySelector: ResultSelector<TSource, TKey>,
    innerKeySelector: ResultSelector<TInner, TKey>,
    resultSelector: JoinResultSelector<TSource, TInner, TResult>,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return Enumerable.innerJoin(
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      equalityComparer
    );
  }

  /**
   * Correlates the elements of two sequences based on matching keys
   * and groups the results. Uses `Object.is` equality to compare keys.
   */
  public groupJoin<TSource, TOuter, TKey, TResult>(
    outer: IEnumerable<TOuter>,
    inner: IEnumerable<TSource>,
    outerKeySelector: ResultSelector<TOuter, TKey>,
    innerKeySelector: ResultSelector<TSource, TKey>,
    resultSelector: JoinResultSelector<TOuter, IEnumerable<TSource>, TResult>
  ): IEnumerable<TResult>;
  /**
   * Correlates the elements of two sequences based on matching keys
   * and groups the results. Uses a specified equality comparer to compare keys.
   */
  public groupJoin<TSource, TOuter, TKey, TResult>(
    outer: IEnumerable<TOuter>,
    inner: IEnumerable<TSource>,
    outerKeySelector: ResultSelector<TOuter, TKey>,
    innerKeySelector: ResultSelector<TSource, TKey>,
    resultSelector: JoinResultSelector<TOuter, IEnumerable<TSource>, TResult>,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;
  public groupJoin<TSource, TOuter, TKey, TResult>(
    outer: IEnumerable<TOuter>,
    inner: IEnumerable<TSource>,
    outerKeySelector: ResultSelector<TOuter, TKey>,
    innerKeySelector: ResultSelector<TSource, TKey>,
    resultSelector: JoinResultSelector<TOuter, IEnumerable<TSource>, TResult>,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return Enumerable.groupJoin(
      outer,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      equalityComparer
    );
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   */
  public groupBy<TKey>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>
  ): IEnumerable<IGrouping<TKey, TSource>>;
  /**
   * Groups the elements of a sequence according to a specified key selector
   * function and creates a result value from each group and its key.
   */
  public groupBy<TKey, TResult>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    resultSelector: GroupByResultSelector<TKey, TSource, TResult>
  ): IEnumerable<TResult>;
  /**
   * Groups the elements of a sequence according to a specified key selector
   * function and creates a result value from each group and its key.
   * The elements of each group are projected by using a specified function.
   */
  public groupBy<TKey, TElement, TResult>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    elementSelector: ResultSelector<TSource, TElement>,
    resultSelector: GroupByResultSelector<TKey, TElement, TResult>
  ): IEnumerable<TResult>;
  /**
   * Groups the elements of a sequence according to a specified key selector
   * function and creates a result value from each group and its key. Key values
   * are compared by using a specified comparer, and the elements of each group are
   * projected by using a specified function.
   */
  public groupBy<TKey, TElement, TResult>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    elementSelector: ResultSelector<TSource, TElement>,
    resultSelector: GroupByResultSelector<TKey, TElement, TResult>,
    equalityComparer: EqualityComparer<TElement>
  ): IEnumerable<TResult>;
  public groupBy<TKey, TElement, TResult>(
    source: IEnumerable<TSource>,
    keySelector: ResultSelector<TSource, TKey>,
    elementOrResultSelector?:
      | ResultSelector<TSource, TElement>
      | GroupByResultSelector<TKey, TElement, TResult>,
    resultSelector?: GroupByResultSelector<TKey, TElement, TResult>,
    equalityComparer?: EqualityComparer<TKey | TElement>
  ): IEnumerable<TResult> | IEnumerable<IGrouping<TKey, TSource>> {
    return Enumerable.groupBy(
      source,
      keySelector,
      <ResultSelector<TSource, TElement>>elementOrResultSelector,
      resultSelector!,
      equalityComparer!
    );
  }

  /**
   * Joins all elements of a sequence to a single string.
   * Uses "" as the default separator.
   */
  public joinBy(character?: string): string {
    return Enumerable.joinBy(this, character);
  }

  /**
   *  Applies a specified function to the corresponding
   *  elements of two sequences, producing a sequence of the results.
   *  [1,2,3].zip([4,5,6], (a,b) => [a, b]) => [[1,4],[2,5],[3,6]]
   */
  public zip<TSecond, TResult>(
    second: IEnumerable<TSecond>,
    resultSelector: (first: TSource, second: TSecond) => TResult
  ): IEnumerable<TResult> {
    return Enumerable.zip(this, second, resultSelector);
  }

  /**
   * Returns the IEnumerator of the source.
   */
  public abstract getEnumerator(): IEnumerator<TSource>;

  public [Symbol.iterator](): Iterator<TSource> {
    return this.getEnumerator()[Symbol.iterator]();
  }
}

const __method_invocation_exception_import_ref__ = MethodInvocationException;
