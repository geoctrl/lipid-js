import React, { Component } from 'react';
import ViewState from './view.state';

class App extends Component {
  constructor() {
    super();
    ViewState.subscribe(({ number, age }) => {
      this.setState({ number, age });
    });

    const { number, age } = ViewState.get();

    this.state = {
      number,
      age,
    }
  }

  set() {
    ViewState.set(() => ({ number: this.state.number + 5 }));
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