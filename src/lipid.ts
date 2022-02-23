import type { Subject } from 'rxjs';
import type { filter, map } from 'rxjs/operators';
import type intersection from 'lodash/intersection';
import type isEqual from 'lodash/isEqual';

type State = Record<string, any>;
type StateOpts = { emit?: boolean, clear?: boolean };
const defaultStateOpts = { emit: true, clear: false };

export default class Lipid {
  __defaultState: State;
  __obs: Subject<any>;
  __state: State;
  onSetBefore: (state?: State) => State;
  onSetAfter: (state?: State, delta?: State) => void;

  constructor(state?: State) {
    if (state && typeof state !== 'object') {
      throw Error('new Lipid() "state" argument must be an object.')
    }
    this.__defaultState = state;
    // @ts-ignore
    this.__obs = new Subject();
    this.onSetBefore = state => state;
    this.onSetAfter = () => {}
    this.__state = state || {};
  }

  on(props: string[] = []) {
    return this.__obs.pipe(
      // @ts-ignore
      filter(({ state, prevState, delta }) => {
        if (!props || !props.length) return true;
        // @ts-ignore
        const keyProps = intersection(props, Object.keys(delta));
        return !!keyProps.reduce((final, prop) => {
          // @ts-ignore
          if (!isEqual(state[prop], prevState[prop])) {
            return [...final, prop]
          }
          return final;
        }, []).length
      }),
      // @ts-ignore
      map(({ state, prevState, delta }) => {
        return ({ state, prevState });
      })
    );
  }

  get(prop: string = '') {
    return prop ? this.__state[prop] : this.__state;
  }

  set(newState: ((prevState: State) => State) | State, options: StateOpts = defaultStateOpts) {
    const { clear, emit } = options;
    let delta = typeof newState === 'function'
      ? newState(this.__state)
      : newState;
    if (!(typeof delta === 'object' && delta !== null)) {
      throw new TypeError(`[${this.constructor.name}] "state" argument must be an object`);
    }
    delta = this.onSetBefore(delta);
    const prevState = Object.assign({}, this.__state);

    this.__state = clear
      ? Object.assign({}, delta)
      : Object.assign({}, this.__state, delta);

    this.onSetAfter(this.__state, delta);
    if (emit) {
      this.__obs.next({ state: this.__state, prevState, delta })
    }
    return this.__state;
  }

  reset(options: { emit?: boolean } = {}) {
    const { emit } = options;
    return this.set(this.__defaultState, { emit, clear: true });
  }
}
