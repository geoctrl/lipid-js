import React, { Component } from 'react';
import { view } from './view.state';

class App extends Component {
  constructor() {
    super();
    view.subscribe((state) => this.setState({ number: state.number }));
  }

  state = {
    number: view.get('number'),
  }

  set() {
    view.set({ number: 10 });
  }

  render() {
    return (
      <div>
        <div>number = {this.state.number}</div>
        <button onClick={this.set}>set</button>
      </div>
    );
  }
}

export { App };