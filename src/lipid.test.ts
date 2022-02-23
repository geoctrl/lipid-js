import { Lipid } from './lipid';
import { Subscription } from 'rxjs';

describe(`Lipid`, () => {
  const myState = new Lipid();
  const subscriber = jest.fn();
  let observer: Subscription;
  class AdvancedState extends Lipid {
    readableName() {
      return this.get('name')
        .split('_')
        .map((name: string) => name.slice(0, 1).toUpperCase() + name.slice(1))
        .join(' ');
    }
    setDoubleAge(age: number) {
      this.set({ age: age * 2 });
    }
  }
  const advancedState = new AdvancedState({
    thing: 10
  });

  test(`Should update state on set`, () => {
    myState.set({ name: 'John Doe' });
    const { name } = myState.get();
    expect(name).toEqual('John Doe');
  });

  test(`Should allow previous state to be accessed using a function`, () => {
    myState.set({ age: 9 });
    myState.set((prevState) => ({ age: prevState.age * 2 }));
    expect(myState.get().age).toEqual(18);
  });

  test(`Should retrieve entire state object on get`, () => {
    myState.set({ age: 18 });
    expect(myState.get()).toEqual({ name: 'John Doe', age: 18 });
  });

  test(`Custom methods should compute from state`, () => {
    advancedState.set({ name: 'john_doe' });
    expect(advancedState.readableName()).toEqual('John Doe');
  });

  test(`Should fire callback on change`, () => {
    observer = advancedState.on(['age']).subscribe(subscriber);
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
    advancedState.set({ age: 20, thing: 10 });
    expect(subscriber.mock.calls.length).toEqual(2);
  });

  test(`Should require object for sets`, () => {
    const state = new Lipid();
    state.on().subscribe(() => {});
    let error;
    try {
      // @ts-ignore
      state.set('not an object');
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
  });

  test(`Should reset to default state`, () => {
    const defaultState = { thing1: 1, thing2: 'two' };
    const state = new Lipid(defaultState);
    expect(state.get()).toEqual(defaultState);
    state.set({ thing1: 2, thing2: 'three' });
    expect(state.get('thing1') === defaultState.thing1).toBeFalsy();
    state.set(defaultState, { clear: true });
    expect(state.get('thing1') === defaultState.thing1).toBeTruthy();
  });

  test(`Should call set hooks`, () => {
    const setBeforeFn = jest.fn(state => state);
    const setAfterFn = jest.fn();
    class MyState extends Lipid {
      onSetBefore = setBeforeFn
      onSetAfter = setAfterFn
    }
    const myState = new MyState();
    myState.set({ hi: 'mom' });
    expect(setBeforeFn).toBeCalled();
    expect(setAfterFn).toBeCalled();
  });

  test(`should clear state`, () => {
    const state = new Lipid({ hello: 'world!' });
    expect(state.get()).toEqual({ hello: 'world!' });
    state.set({}, { clear: true });
    expect(state.get()).toEqual({});
  })

});
