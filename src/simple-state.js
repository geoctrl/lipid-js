import { Subject, throwError } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isEqual, intersection, isObject } from 'lodash';

export default class SimpleState {
  constructor(state) {
    this.state = state || {};
  }

  onSetBefore = state => state;
  onSetAfter = () => {}
  __obs = new Subject();

  pick = (...props) => {
    return this.__obs.pipe(
      filter(({ state, prevState, delta }) => {
        if (!props || !props.length) return true;
        const keyProps = intersection(props, Object.keys(delta));
        return keyProps.reduce((final, prop) => {
          console.log(state[prop], prevState[prop])
          if (!isEqual(state[prop], prevState[prop])) {
            return [...final, prop]
          }
          return final;
        }, []).length
      }),
      map(({ state, prevState, delta }) => ({ state, prevState }))
    );
  }

  set = (state = {}) => {
    return this.__set(state, true, false);
  }

  __set = (newState, emit, clear) => {
    let delta = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (!isObject(delta)) {
      throw new TypeError(`[${this.constructor.name}] "state" argument must be an object`);
    }
    delta = this.onSetBefore(delta);
    const prevState = Object.assign({}, this.state);

    this.state = clear
      ? Object.assign({}, delta)
      : Object.assign({}, this.state, delta);

    this.onSetAfter(this.state, delta);
    if (emit) {
      this.__obs.next({ state: this.state, prevState, delta })
    }
    return this.state;
  }

  setNoEmit = (state) => {
    return this.__set(state, false, false);
  }

  setOverride = (state) => {
    return this.__set(state, true, true);
  }

  get = (prop = '') => {
    return prop ? this.state[prop] : this.state;
  }

  clear = () => {
    return this.state = {};
  }
}