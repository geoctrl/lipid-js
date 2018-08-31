import { Subject } from 'rxjs';

/**
 * State has 1 rule:
 * state must be an object
 */
class State {
  constructor(defaultState) {
    this.state = defaultState || {};
    this.subject = new Subject();
  }

  set(newState) {
    const state = typeof newState === 'function'
      ? newState(this.state)
      : newState;

    if (typeof state === 'object' && !Array.isArray(state)) {
      this.state = {
        ...this.state,
        ...state,
      };
      this.subject.next(this.state);
    } else {
      throw Error(`[State] state must be an object`)
    }
    return this.state;
  }
  get(name) {
    if (name) {
      return this.state[name];
    }
    return this.state;
  }
  subscribe(next, complete, error) {
    return this.subject.subscribe(next, complete, error);
  }
}

export { State };