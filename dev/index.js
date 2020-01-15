import React, { Component } from 'react';
import { render } from 'react-dom';
import SimpleState from '../src/simple-state';

class Base extends Component {
  constructor(props) {
    super(props);

    const myState = new SimpleState({
      one: 1,
      two: 2,
      three: 3,
    });

    const obs = myState.pick('one', 'three').subscribe(({ state, prevState}) => {
      console.log('done', prevState, state);
    });

    setTimeout(() => {
      myState.set({
        one: 2,
      });
      obs.unsubscribe();
    }, 2000);

    setTimeout(() => {
      myState.set({
        three: 4,
      })
    }, 3000);

  }
  render() {
    return (
      <div>
        hello
      </div>
    );
  }
}

render(<Base />, document.getElementById('app'));