const { EventEmitter } = require('./event-emitter');

/**
 * Simple State
 * @param {object} defaultState
 */
class SimpleState {
  constructor(defaultState) {
    this.state = defaultState || {};
    this.subject = new EventEmitter();
  }
  set(newState) {
    const state = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (typeof state === 'object' && !Array.isArray(state)) {
      const prevState = Object.assign({}, this.state);
      this.state = Object.assign({}, this.state, JSON.parse(JSON.stringify(state)));
      this.subject.next(this.state, prevState);
    } else {
      throw Error(`[State] state must be an object`)
    }
    return this.state;
  }
  get(name) {
    if (name) {
      return this.state[name];
    }
    return this.state;
  }
  subscribe(next, props) {
    let saveProps;
    if (typeof props === 'string') {
      saveProps = [props];
    } else if (!Array.isArray(props)) {
      saveProps = ['*'];
    } else {
      saveProps = props;
    }
    return this.subject.subscribe(saveProps, next);
  }
}

module.exports = { SimpleState };