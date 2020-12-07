import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules';
import Web3Provider from './common/providers/Web3.provider';
import ModalProvider from './common/providers/Modal.provider';
import EdcoinProvider from './common/providers/Edcoin.provider';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

const ContextProviders = ({ children }) => (
  <React.Fragment>
    <Web3Provider>
      <ModalProvider>
        <EdcoinProvider>{children}</EdcoinProvider>
      </ModalProvider>
    </Web3Provider>
  </React.Fragment>
);

ReactDOM.render(
  <React.StrictMode>
    <ContextProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProviders>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
