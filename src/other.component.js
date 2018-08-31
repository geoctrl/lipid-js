import React, { Component } from 'react';
import { view } from './view.state';

class Other extends Component {
  constructor() {
    super();
    this.state = {
      number: view.get('number'),
    };
    view.subscribe(({ number }) => this.setState({ number }));
  }

  render() {
    return (
      <div>
        number: {this.state.number}
        <div>is 10: {view.isTen() ? 'true' : 'false'}</div>
      </div>
    );
  }
}

export { Other };