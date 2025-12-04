import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureAmplifyIoT } from './components/utils/amplifyConfig';
import { config } from './config';
import { AuthProvider } from 'react-oidc-context';

// 初始化 Amplify
configureAmplifyIoT(config);

// Cognito OIDC 配置 (用於 Identity Center Application)
const cognitoAuthConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_L66sgLcWO',
  client_id: '3qenkgtfedaoqq7e1cvdvnniu9',
  redirect_uri: window.location.origin + '/admin/callback',
  response_type: 'code',
  scope: 'email openid phone',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);