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
    this.state = {
      ...this.state,
      ...newState,
    };
    this.subject.next(this.state);
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