import { State } from './state';

class View extends State {
  isTen() {
    return this.state.number === 10;
  }
}

const view = new View();
export { view };