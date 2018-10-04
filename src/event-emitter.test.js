import EventEmitter from './event-emitter';

describe(`EventEmitter`, () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();
  const subscriber3 = jest.fn();
  let observer;
  const emitter = new EventEmitter();

  test(`Emitter waits for subscribers`, () => {
    expect(emitter.observers.length).toEqual(0);
  });

  test(`Emitter should emit to all subscribers`, () => {
    emitter.subscribe(subscriber1);
    expect(emitter.observers.length).toEqual(1);
    emitter.next({}, {});
    expect(subscriber1.mock.calls.length).toEqual(1);
  });

  test(`Emitter should handle multiple subscribers`, () => {
    emitter.subscribe(subscriber2);
    expect(emitter.observers.length).toEqual(2);
    emitter.next({}, {});
    expect(subscriber1.mock.calls.length).toEqual(2);
    expect(subscriber2.mock.calls.length).toEqual(1);
  });

  test(`Emitter only emits when props change`, () => {
    observer = emitter.subscribe(subscriber3, ['name']);
    emitter.next({ name: 'John' }, { name: 'Jane' });
    expect(subscriber3.mock.calls.length).toEqual(1);
    emitter.next({ name: 'Jane' }, { name: 'Jane' });
    expect(subscriber3.mock.calls.length).toEqual(1);
    emitter.next({ name: 'Jane' }, { name: 'Josephine' });
    expect(subscriber3.mock.calls.length).toEqual(2);
  });

  test(`Emitter doesn't emit to unsubscribed observers`, () => {
    observer.unsubscribe();
    expect(subscriber3.mock.calls.length).toEqual(2);
    emitter.next({ name: 'John' }, { name: 'Jane' });
    expect(subscriber3.mock.calls.length).toEqual(2);
  });

});