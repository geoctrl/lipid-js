import React, { Component } from 'react';
import { render } from 'react-dom';
import { App } from './app.component';
import { Other } from './other.component';

class Base extends Component {
  constructor() {
    super();
    this.state = { check: true };
  }
  render() {
    return (
      <div>
        {this.state.check && <App />}
        <Other />
      </div>
    );
  }
}

render(<Base />, document.getElementById('app'));