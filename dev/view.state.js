import SimpleState from '../index';

class ViewState extends SimpleState {
  isTen() {
    return this.state.number === 10;
  }
  resetNumberTo5() {
    return this.set({
      number: 5,
    });
  }
}

export default new ViewState({ number: 5 });