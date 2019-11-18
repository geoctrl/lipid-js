import EventEmitter from './event-emitter';
import { isObject } from './utils'

/**
 * Simple State
 * @param {object} defaultState
 */
export default class SimpleState {
  constructor(defaultState) {
    this.__default_state = defaultState || {};
    this.__emitter = new EventEmitter();
    this.state = defaultState || {};
    this.onSetBefore = (state) => state;
    this.onSetAfter = () => {};
  }
  set(newState) {
    return this.__setState(newState, true);
  }
  __setState(newState, append) {
    let state = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (isObject(state)) {
      state = this.onSetBefore(state);
      const prevState = Object.assign({}, this.state);
      this.state = append
        ? Object.assign({}, this.state, state)
        : Object.assign({}, state);
      this.onSetAfter(this.state, state);
      this.__emitter.next(prevState, this.state);
    } else {
      this.__emitter.error(new TypeError(`[${this.constructor.name}] set(state) - "state" must be an object`));
    }
    return this.state;
  }
  get(key) {
    if (key) return this.state[key];
    return this.state;
  }
  reset() {
    return this.__setState(this.__default_state, false);
  }
  clear() {
    return this.__setState({}, false);
  }
  subscribe(next, props, error) {
    return this.__emitter.subscribe(next, props, error);
  }
}