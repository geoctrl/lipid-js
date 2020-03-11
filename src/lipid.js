import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { intersection, isEqual } from 'lodash';

export default class Lipid {
  constructor(state) {
    this.__defaultState = Object.assign({}, state);
    this.__obs = new Subject();
    this.onSetBefore = state => state;
    this.onSetAfter = () => {}
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
        return ({ state, prevState });
      })
    );
  }

  get(prop = '') {
    return prop ? this.state[prop] : this.state;
  }

  set(newState = {}, options = {}) {
    const emit = typeof options.emit === 'boolean' ? options.emit : true;
    const clear = typeof options.clear === 'boolean' ? options.clear : false;

    let delta = typeof newState === 'function'
      ? newState(this.state)
      : newState;
    if (!(typeof delta === 'object' && delta !== null)) {
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

  reset(options) {
    const { emit, clear } = options;
    return this.set(this.__defaultState, { emit, clear });
  }
}