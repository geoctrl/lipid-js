import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { intersection, isEqual, cloneDeep } from 'lodash';

export default class Lipid {
  constructor(state) {
    this.__defaultState = Object.assign({}, state);
    this.__obs = new Subject();
    this.onSetBefore = state => state;
    this.onSetAfter = () => {}
    this.__state = state || {};
    this.state = cloneDeep(state || {});
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
    return prop ? cloneDeep(this.__state[prop]) : cloneDeep(this.__state);
  }

  set(newState = {}, options = {}) {
    const emit = typeof options.emit === 'boolean' ? options.emit : true;
    const clear = typeof options.clear === 'boolean' ? options.clear : false;

    let delta = typeof newState === 'function'
      ? newState(cloneDeep(this.__state))
      : newState;
    if (!(typeof delta === 'object' && delta !== null)) {
      throw new TypeError(`[${this.constructor.name}] "state" argument must be an object`);
    }
    delta = this.onSetBefore(delta);
    const prevState = Object.assign({}, this.__state);

    this.__state = clear
      ? Object.assign({}, delta)
      : Object.assign({}, this.__state, delta);

    this.state = cloneDeep(this.__state);

    this.onSetAfter(this.__state, delta);
    if (emit) {
      this.__obs.next({ state: this.__state, prevState, delta })
    }
    return this.__state;
  }

  reset(options) {
    const { emit, clear } = options;
    return this.set(this.__defaultState, { emit, clear });
  }
}