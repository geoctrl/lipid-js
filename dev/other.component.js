import React, { Component } from 'react';
import ViewState from './view.state';

class Other extends Component {
  constructor() {
    super();
    const { number } = ViewState.get();
    this.state = {
      isTen: ViewState.isTen(),
      number,
    };
    this.test = ViewState.subscribe(({ number }) => {
      this.setState({
        number,
        isTen: ViewState.isTen()
      });
    }, 'number');
  }

  componentWillUnmount() {
    this.test.unsubscribe();
  }

  render() {
    return (
      <div>
        number: {this.state.number}
        <div>is 10: {ViewState.isTen() ? 'true' : 'false'}</div>
      </div>
    );
  }
}

export { Other };