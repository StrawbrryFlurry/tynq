import { DONE, EnumeratorState, EnumeratorStateMachine, Next } from '@core/iterators';

describe('EnumeratorStateMachine.moveNext', () => {
  it('calls the setup function if the state is Setup', () => {
    const sut = new StubStateMachine();

    sut.moveNext();

    expect(sut.setup).toHaveBeenCalled();
  });

  it('does not call the setup function while the state is not setup', () => {
    const sut = new StubStateMachine();

    sut.innerState = EnumeratorState.HasNextElement;
    sut.moveNext();

    expect(sut.setup).not.toHaveBeenCalled();
  });

  it('returns false if the state is stop', () => {
    const sut = new StubStateMachine();

    sut.innerState = EnumeratorState.Stop;
    expect(sut.moveNext()).toBe(false);
  });

  it('returns false if the value returned from next is DONE', () => {
    const sut = new StubStateMachine();

    sut.next = () => DONE;

    expect(sut.moveNext()).toBe(false);
  });

  it('returns true if the value returned from next is not DONE', () => {
    const sut = new StubStateMachine();

    sut.next = () => null;

    expect(sut.moveNext()).toBe(true);
  });

  it('sets the state to stop if the value returned from next is DONE', () => {
    const sut = new StubStateMachine();

    sut.next = () => DONE;

    sut.moveNext();

    expect(sut.innerState).toBe(EnumeratorState.Stop);
  });

  it('sets the state to hasNextElement if the value returned from next is not DONE', () => {
    const sut = new StubStateMachine();

    sut.next = () => null;

    sut.moveNext();

    expect(sut.innerState).toBe(EnumeratorState.HasNextElement);
  });

  it('sets the current value to the value returned from next', () => {
    const sut = new StubStateMachine();

    sut.next = () => 'test';

    sut.moveNext();

    expect(sut.current).toBe('test');
  });
});

describe('EnumeratorStateMachine.reset', () => {
  it('sets the state to setup', () => {
    const sut = new StubStateMachine();

    sut.reset();

    expect(sut.innerState).toBe(EnumeratorState.Setup);
  });
});

describe('EnumeratorStateMachine.getEnumerator', () => {
  it('returns itself as the enumerator', () => {
    const sut = new StubStateMachine();

    expect(sut.getEnumerator()).toBe(sut);
  });
});

describe('EnumeratorStateMachine.create', () => {
  it('returns a new EnumeratorStateMachine', () => {
    const sut = EnumeratorStateMachine.create(() => () => null);

    expect(sut).toBeInstanceOf(EnumeratorStateMachine);
  });

  it('calls the provided setup function when setup on the state machine is called', () => {
    const setup = jest.fn(() => () => null);

    const sut = EnumeratorStateMachine.create(setup);

    sut.setup();

    expect(setup).toHaveBeenCalled();
  });

  it('Sets the next function to the value returned by the setup function', () => {
    const generator = () => null;
    const setup = jest.fn(() => generator);

    const sut = EnumeratorStateMachine.create(setup);

    sut.setup();

    expect(sut.next).toStrictEqual(generator);
  });
});

class StubStateMachine<T> extends EnumeratorStateMachine<T> {
  public get innerState(): EnumeratorState {
    return this.state;
  }
  public set innerState(v: EnumeratorState) {
    this.state = v;
  }

  constructor() {
    super();

    this.next = jest.fn();
    this.setup = jest.fn();
  }

  public next(): Next<T> {
    throw new Error('Method not implemented.');
  }

  public setup(): void {
    throw new Error('Method not implemented.');
  }
}
