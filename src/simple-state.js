import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isEqual, intersection, isObject, get } from 'lodash';

export default class SimpleState {
  constructor(state) {
    this.__defaultState = Object.assign({}, state);
    this.__onSetBefore = state => state;
    this.__onSetAfter = () => {}
    this.__obs = new Subject();
    this.state = state || {};
  }

  on(props = []) {
    return this.__obs.pipe(
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
      map(({ state, prevState, delta }) => {
        console.log(state);
        return ({ state, prevState });
      })
    );
  }

  get(prop = '') {
    return prop ? this.state[prop] : this.state;
  }

  set(newState = {}, config) {
    const emit = get(config, 'emit', true);
    const clear = get(config, 'clear', false);

    let delta = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (!isObject(delta)) {
      throw new TypeError(`[${this.constructor.name}] "state" argument must be an object`);
    }
    delta = this.__onSetBefore(delta);
    const prevState = Object.assign({}, this.state);

    this.state = clear
      ? Object.assign({}, delta)
      : Object.assign({}, this.state, delta);

    this.__onSetAfter(this.state, delta);
    if (emit) {
      this.__obs.next({ state: this.state, prevState, delta })
    }
    return this.state;
  }

  reset(config) {
    return this.set(this.__defaultState, {
      emit: get(config, 'emit', true),
      clear: get(config, 'clear', true),
    });
  }
}