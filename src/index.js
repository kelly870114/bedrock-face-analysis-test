import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureAmplifyIoT } from './components/utils/amplifyConfig';
import { config } from './config';

// 初始化 Amplify
configureAmplifyIoT(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);