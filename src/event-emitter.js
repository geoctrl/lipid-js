class EventEmitter {
  constructor() {
    this.observers = [];
    this.index = 0;
  }

  next(state, prevState) {
    this.observers.forEach(observer => {
      if (observer.props.reduce((final, prop) => {
        if (prop === '*') {
          return [...final, prop];
        }
        if (state[prop] !== prevState[prop]) {
          return [...final, prop]
        }
        return final;
      }, []).length) {
        observer.next(state);
      }
    });
  }
  subscribe(props, next = () => {}) {
    this.index = this.index + 1;
    this.observers.push({ props, next, key: this.index });
    return { unsubscribe: () => this._unsubscribe(this.index) };
  }
  _unsubscribe(key) {
    const index = this.observers.findIndex(observer => observer.key === key);
    if (index > -1) {
      this.observers = this.observers.slice(0, index).concat(this.observers.slice(index + 1));
    }
  }
}

module.exports = { EventEmitter };