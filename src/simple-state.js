import EventEmitter from './event-emitter';
import { isObject } from './utils'

/**
 * Simple State
 * @param {object} defaultState
 */
export default class SimpleState {
  constructor(defaultState) {
    this.state = defaultState || {};
    this.emitter = new EventEmitter();
  }
  set(newState) {
    const state = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (isObject(state)) {
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