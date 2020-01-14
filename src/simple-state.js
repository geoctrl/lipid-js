import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isEqual, intersection, isObject } from 'lodash';

export default class SimpleState {
  constructor(state) {
    this.state = state || {};
  }

  __watchers = [];
  onSetBefore = state => state;
  onSetAfter = () => {}

  observe = (...props) => {
    const obs = (new Subject())
      .pipe(
        filter(({ state, prevState, delta }) => {
          if (!props || !props.length) return true;
          const keyProps = intersection(props, Object.keys(delta));
          return keyProps.reduce((final, prop) => {
            if (!isEqual(state[prop], prevState[prop])) {
              return [...final, prop]
            }
            return final;
          }, []).length
        }),
        map(({ state, prevState, delta }) => ({ state, prevState }))
      );
    this.__watchers.push(obs);
    return obs;
  }

  __set = (newState, emit, clear) => {
    let delta = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (!isObject(delta)) {
      new TypeError(`[${this.constructor.name}] "state" argument must be an object`)
      return;
    }
    delta = this.onSetBefore(delta);
    const prevState = Object.assign({}, this.state);

    this.state = clear
      ? Object.assign({}, delta)
      : Object.assign({}, this.state, delta);

    this.onSetAfter(this.state, delta);
    if (emit) {
      this.__watchers.forEach(obs => {
        obs.next({ state: this.state, prevState, delta });
      });
    }
    return this.state;
  }

  set = (state) => {
    return this.__set(state, true);
  }

  setNoEmit = (state) => {
    return this.__set(state, false);
  }

  overrideState = (state) => {
    return this.__set(state, true, true);
  }
}