import { IEnumerator } from '../enumerator';

import type { IEnumerable } from '../enumerable';

/**
 * A symbol, indicating to the state machine
 * that the sequence has no more elements.
 */
export const DONE = Symbol.for('Enumerator state machine done');
export type Next<T> = typeof DONE | T;

type EnumeratorStateMachineSetup<T> =
  () => EnumeratorStateMachineNextGenerator<T>;
type EnumeratorStateMachineNextGenerator<T> = () => T | typeof DONE;

export const enum EnumeratorState {
  /**
   * The state machine will be set to this state, if the
   * sequence has no more elements.
   */
  Stop = -1,
  /**
   * Sets up variables like the enumerator for iteration.
   * This happens, when moveNext is called while the state is Setup.
   * The State will then be set to Stop.
   */
  Setup = 0,
  /**
   * Is set after the `next` call to get the next
   * element of the sequence. If `next` returns DONE, the state
   * will be kept as `Stop`.
   */
  HasNextElement = 1,
}

/**
 * An alternative implementation to the JavaScript
 * generator function that uses a bit more memory
 * but is significantly faster.
 */
export abstract class EnumeratorStateMachine<
  TEnumerator,
  TEnumerable extends TEnumerator = NonNullable<TEnumerator>
> implements IEnumerator<TEnumerator>
{
  public current?: TEnumerator;
  protected state: EnumeratorState = EnumeratorState.Setup;

  /**
   * Creates a new instance of a state machine
   * using the setup function to create the next generator.
   */
  public static create<T>(
    setup: EnumeratorStateMachineSetup<T>
  ): EnumeratorStateMachine<T> {
    return new EnumeratorStateMachineImpl<T>(setup);
  }

  /**
   * Resets the internal state to be `Setup`.
   */
  public reset(): void {
    this.state = EnumeratorState.Setup;
  }

  public moveNext(): boolean {
    if (this.state !== EnumeratorState.Setup) {
      if (this.state !== EnumeratorState.HasNextElement) {
        return false;
      }

      this.state = EnumeratorState.Stop;
    } else {
      this.setup();
      this.state = EnumeratorState.Stop;
    }

    const next = this.next();

    if (next === DONE) {
      return false;
    }

    this.state = EnumeratorState.HasNextElement;
    this.current = next;
    return true;
  }

  /**
   * Returns the next value, the enumerator
   * should return or DONE if the sequence
   * has no more elements.
   */
  public abstract next(): Next<TEnumerator>;

  /**
   * Sets up the state machine;
   * this is called the first time moveNext
   * is called or after the state machine is reset.
   */
  public abstract setup(): void;

  public getEnumerator(): IEnumerator<TEnumerable> {
    return <IEnumerator<TEnumerable>>(<unknown>this);
  }

  public [Symbol.iterator](): Iterator<TEnumerable> {
    return {
      next: () => {
        if (this.moveNext()) {
          return {
            value: <TEnumerable>this.current,
            done: false,
          };
        }

        return {
          value: null,
          done: true,
        };
      },
    };
  }
}

class EnumeratorStateMachineImpl<T> extends EnumeratorStateMachine<T> {
  private _setup: EnumeratorStateMachineSetup<T>;

  constructor(setup: EnumeratorStateMachineSetup<T>) {
    super();
    this._setup = setup;
  }

  public next!: () => Next<T>;

  public setup() {
    this.next = this._setup();
  }
}

export interface EnumeratorStateMachine<
  TEnumerator,
  TEnumerable extends TEnumerator = NonNullable<TEnumerator>
> extends IEnumerable<TEnumerable> {}

/*
class MapEnumerator<TKey, TValue> extends EnumeratorStateMachine<
  [TKey, TValue]
> {
  private keys!: TKey[];
  private _idx: number = -1;

  constructor(source: Map<TKey, TValue>) {
    super(() => {
      switch (this.state) {
        // @ts-ignore
        case EnumeratorState.Stopped: {
          this.keys = [...source.keys()];
        }
        case EnumeratorState.HasNextElement:
          this._idx++;
          if (this._idx >= this.keys.length) {
            return __DONE;
          }
      }

      return [this.keys[this._idx], source.get(this.keys[this._idx])!];
    });
  }
}

class SkipIterator<T> extends EnumeratorStateMachine<T> {
  private _enumerator!: IEnumerator<T>;

  constructor(source: IEnumerable<T>, count: number) {
    super(() => {
      switch (this.state) {
        case EnumeratorState.Stop: {
          this._enumerator = source.getEnumerator();

          while (count > 0 && this._enumerator.moveNext()) count--;
        }
        case EnumeratorState.HasNextElement:
          if (count <= 0 && this._enumerator.moveNext()) {
            return this._enumerator.current!;
          }
      }

      return __DONE;
    });
  }
}
*/
