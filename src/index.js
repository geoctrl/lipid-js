import React, { Component } from 'react';
import { render } from 'react-dom';
import { App } from './app.component';
import { Other } from './other.component';

render(<div>
  <App />
  <Other />
</div>, document.getElementById('app'));