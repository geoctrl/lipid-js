import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import intersection from 'lodash-es/intersection';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';

export type State = Record<string, any>;
export type StateOpts = { emit?: boolean, clear?: boolean };

export class Lipid {
  private __defaultState: State;
  private __obs: Subject<State>;
  private __state: State;
  onSetBefore: undefined | ((state: State, delta: State) => State);
  onSetAfter: undefined | ((state?: State, delta?: State) => void);

  constructor(state?: State) {
    if (state && typeof state !== 'object') {
      throw Error('new Lipid() "state" argument must be an object.')
    }
    this.__defaultState = state;
    this.__obs = new Subject();
    this.__state = state || {};
    this.onSetAfter = () => {}
  }

  on(props: string[] = []) {
    return this.__obs.pipe(
      filter(({ state, prevState, delta }) => {
        if (!props || !props.length) return true;
        const keyProps = intersection(props, Object.keys(delta));
        return !!keyProps.reduce((final, prop) => {
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

  get(prop?: string) {
    return prop ? this.__state[prop] : this.__state;
  }

  set(newState: ((prevState: State) => State) | State, options: StateOpts = { emit: true, clear: false }) {
    const { clear, emit } = options;
    let delta = typeof newState === 'function'
      ? newState(this.__state)
      : newState;
    if (!(typeof delta === 'object' && delta !== null)) {
      throw new TypeError(`[${this.constructor.name}] "state" argument must be an object`);
    }

    if (this.onSetBefore) {
      delta = this.onSetBefore(cloneDeep(this.__state), delta);
    }
    const prevState = Object.assign({}, this.__state);

    this.__state = clear
      ? delta
      : Object.assign({}, this.__state, delta);

    if (this.onSetAfter) {
      this.onSetAfter(this.__state, delta);
    }
    if (emit) {
      this.__obs.next({ state: this.__state, prevState, delta })
    }
    return this.__state;
  }

  revertToDefault(options: StateOpts = { emit: true, clear: true }) {
    return this.set(this.__defaultState, options);
  }

  setDefault(state: State) {
    this.__defaultState = state;
  }
}
