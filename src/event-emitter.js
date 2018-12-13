class Observer {
  constructor(props, next, unsubscribe) {
    this.props = props;
    this.next = next;
    this.unsubscribe = unsubscribe;
  }
}

module.exports = class EventEmitter {
  constructor() {
    this.observers = [];
  }

  next(prevState, state) {
    this.observers.forEach(observer => {
      if (!observer.props.length) {
        observer.next(state);
      } else if (observer.props && observer.props.reduce((final, prop) => {
        if (state[prop] !== prevState[prop]) {
          return [...final, prop]
        }
        return final;
      }, []).length) {
        observer.next(state);
      }
    });
  }
  subscribe(next = () => {}, props = []) {
    const obs = new Observer(props, next, this._unsubscribe);
    this.observers.push(obs);
    return { unsubscribe: () => this._unsubscribe(obs) };
  }
  _unsubscribe(thisObserver) {
    const index = this.observers.findIndex(observer => observer === thisObserver);
    if (index > -1) {
      this.observers = this.observers.slice(0, index).concat(this.observers.slice(index + 1));
    }
  }
}