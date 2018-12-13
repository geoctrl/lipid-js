import React, { Component } from 'react';
import { render } from 'react-dom';
import { App } from './app.component';
import { Other } from './other.component';

class Base extends Component {
  constructor() {
    super();
    this.state = { check: true, showOther: true };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState(({ showOther }) => ({ showOther: !showOther }))
  }
  render() {
    return (
      <div>
        <App />
        ------------
        <button onClick={this.toggle}>Hide Other</button>
        {this.state.showOther && <Other />}
      </div>
    );
  }
}

render(<Base />, document.getElementById('app'));