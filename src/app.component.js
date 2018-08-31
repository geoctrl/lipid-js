import React, { Component } from 'react';
import ViewState from './view.state';

class App extends Component {
  constructor() {
    super();
    ViewState.subscribe((state) => this.setState({ number: state.number }));
  }

  state = {
    number: ViewState.get('number'),
  }

  set() {
    ViewState.set(() => ({ number: 10 }));
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