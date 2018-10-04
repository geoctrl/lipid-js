import SimpleState from './simple-state';
import EventEmitter from './event-emitter';

describe(`SimpleState`, () => {
  const simpleState = new SimpleState();
  const subscriber = jest.fn();
  let observer;
  class AdvancedState extends SimpleState {
    readableName() {
      return this.state.name
        .split('_')
        .map(name => name.slice(0, 1).toUpperCase() + name.slice(1))
        .join(' ');
    }
    setDoubleAge(age) {
      this.set({ age: age * 2 });
    }
  }
  const advancedState = new AdvancedState();

  test(`Should create a simple state instance with state and emitter`, () => {
    expect(simpleState.state).toEqual({});
    expect(simpleState.emitter).toEqual(new EventEmitter());
  });

  test(`Should update state on set`, () => {
    simpleState.set({ name: 'John Doe' });
    const { name } = simpleState.get();
    expect(name).toEqual('John Doe');
  });

  test(`Should allow previous state to be accessed using a function`, () => {
    simpleState.set({ age: 9 });
    simpleState.set(prevState => ({ age: prevState.age * 2 }));
    expect(simpleState.get().age).toEqual(18);
  });

  test(`Should retrieve entire state object on get`, () => {
    simpleState.set({ age: 18 });
    expect(simpleState.get()).toEqual({ name: 'John Doe', age: 18 });
  });

  test(`Custom methods should compute from state`, () => {
    advancedState.set({ name: 'john_doe' });
    expect(advancedState.readableName()).toEqual('John Doe');
  });

  test(`Should fire callback on change`, () => {
    observer = advancedState.subscribe(subscriber);
    advancedState.set({ age: '18' });
    expect(subscriber.mock.calls.length).toEqual(1);
  });

  test(`Should fire set from custom method`, () => {
    advancedState.setDoubleAge(18);
    expect(subscriber.mock.calls.length).toEqual(2);
    expect(advancedState.get().age).toEqual(36);
  });

  test(`Should unsubscribe`, () => {
    observer.unsubscribe();
    advancedState.set({ age: 20 });
    expect(subscriber.mock.calls.length).toEqual(2);
  });

  test(`Should throw if state is not an object`, () => {
    const state = new SimpleState();
    expect(() => state.set('not an object')).toThrowError();
  });

});