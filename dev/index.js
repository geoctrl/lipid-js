import React, { Component, useEffect } from 'react';
import { render } from 'react-dom';
import SimpleState, { SimpleState, useSimpleState } from '../src/simple-state';

const myState = new SimpleState({
  age: 18,
});

function Base() {
  const { state, prevState, delta } = useSimpleState(['age']);


  useEffect(() => {
    setTimeout(() => {

    }, 2000);
  }, []);

  return (
    <div>
      hello
    </div>
  )
}

class Base extends Component {
  constructor(props) {
    super(props);

    const myState = new SimpleState({
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
    );
  }
}

render(<Base />, document.getElementById('app'));