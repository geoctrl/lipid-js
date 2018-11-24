const EventEmitter = require('./event-emitter');

/**
 * Simple State
 * @param {object} defaultState
 */
module.exports = class SimpleState {
  constructor(defaultState) {
    this.state = defaultState || {};
    this.emitter = new EventEmitter();
  }
  set(newState) {
    const state = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (typeof state === 'object' && !Array.isArray(state)) {
      const prevState = Object.assign({}, this.state);
      this.state = Object.assign({}, this.state, state);
      this.emitter.next(prevState, this.state);
    } else {
      throw Error(`[State] state must be an object`)
    }
    return this.state;
  }
  get() {
    return this.state;
  }
   subscribe(next, ...props) {
    return this.emitter.subscribe(next, props);
  }
}