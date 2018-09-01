import React, { Component } from 'react';
import ViewState from './view.state';

class App extends Component {
  constructor() {
    super();
    ViewState.subscribe(({ number, age }) => {
      this.setState({ number, age });
    });

    this.state = {
      number: ViewState.get('number'),
      age: ViewState.get('age'),
    }
  }

  set() {
    ViewState.set(() => ({ number: ViewState.get('number') + 5 }));
  }

  render() {
    return (
      <div>
        <div>number = {this.state.number}</div>
        <button onClick={this.set.bind(this)}>set</button>
      </div>
    );
  }
}

export { App };