import { isEqual } from './utils';

class Observer {
  constructor(props, next, error, unsubscribe) {
    this.props = props;
    this.next = next;
    this.error = error;
    this.unsubscribe = unsubscribe;
  }
}

export default class EventEmitter {
  constructor() {
    this.observers = [];
  }

  next(prevState, state) {
    this.observers.forEach(observer => {
      if (!observer.props.length) {
        observer.next(state, prevState);
      } else if (
        observer.props &&
        observer.props.reduce((final, prop) => {
          if (!isEqual(state[prop], prevState[prop])) {
            return [...final, prop]
          }
          return final;
        }, []).length)
      {
        observer.next(state, prevState);
      }
    });
  }

  error(error) {
    this.observers.forEach(observer => {
      observer.error(error);
    });
  }

  subscribe(next, props = [], onError) {
    if (typeof next !== 'function') {
      throw TypeError(`"next" should be a function`);
    }
    const obs = new Observer(props, next, onError, this._unsubscribe);
    this.observers.push(obs);
    return { unsubscribe: () => this._unsubscribe(obs) };
  }
  _unsubscribe(thisObserver) {
    const index = this.observers.findIndex(
      observer => observer === thisObserver
    );
    if (index > -1) {
      this.observers = [
        ...this.observers.slice(0, index),
        ...this.observers.slice(index + 1),
      ];
    }
  }
}