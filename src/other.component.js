import React, { Component } from 'react';
import ViewState from './view.state';

class Other extends Component {
  constructor() {
    super();
    this.state = {
      isTen: ViewState.isTen(),
      number: ViewState.get('number'),
    };
    ViewState.subscribe(({ number }) => {
      this.setState({
        number,
        isTen: ViewState.isTen()
      });
    });
  }

  render() {
    return (
      <div>
        number: {this.state.number}
        <div>is 10: {this.state.isTen ? 'true' : 'false'}</div>
      </div>
    );
  }
}

export { Other };