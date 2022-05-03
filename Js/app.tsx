import React from 'react'
import ReactDOM from 'react-dom'
import { MainApp } from './Components/MainApp';
import { Provider } from 'mobx-react';
import store from './Stores/MainStore';

const rootElement = document.getElementById("app");

ReactDOM.render(
  <Provider mainStore={store}>
    <MainApp />
  </Provider>,
  rootElement
)