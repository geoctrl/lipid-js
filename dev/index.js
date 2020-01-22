import React, { Component, useEffect } from 'react';
import { render } from 'react-dom';
import Lipid from '../src/lipid';

const myState = new Lipid({
  age: 18,
});

class Base extends Component {
  constructor(props) {
    super(props);

    const myState = new Lipid({
      one: 1,
      two: 2,
      three: 3,
    });

    const obs = myState.on(['one', 'three']).subscribe(({ state, prevState}) => {
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
      <div>sup</div>
    );
  }
}

render(<Base />, document.getElementById('app'));