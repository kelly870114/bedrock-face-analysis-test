// AWS Cognito OAuth 配置 (透過 Identity Center trusted token issuer)
// Cognito User Pool: us-east-1_L66sgLcWO
export const authConfig = {
  // Cognito 設定 - 需要你提供 Cognito 的 domain 和 client id
  // 格式: https://<domain>.auth.<region>.amazoncognito.com
  cognitoDomain: 'https://cup-us-east-1-oidcuserpool.auth.us-east-1.amazoncognito.com',
  clientId: '', // 需要填入 Cognito App Client ID (就是你填在 AUD claim 的那個)
  
  // Identity Center 設定 (用於 token 驗證)
  identityCenterClientId: '6hmchvf90j7m9ra4fuuk47o5u5',
  
  // 應用程式 URL
  redirectUri: process.env.NODE_ENV === 'production' 
    ? 'https://main.dhz5sy3utprte.amplifyapp.com/admin/callback'
    : 'http://localhost:3000/admin/callback',
  
  // OAuth 設定
  scope: 'openid profile email',
  responseType: 'code',
};

// 產生 PKCE code verifier
export const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// 產生 PKCE code challenge
export const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// 建立授權 URL
export const buildAuthUrl = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateCodeVerifier(); // 用作 CSRF 保護
  
  // 儲存到 sessionStorage
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);
  sessionStorage.setItem('oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    response_type: authConfig.responseType,
    redirect_uri: authConfig.redirectUri,
    scope: authConfig.scope,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  
  return `${authConfig.issuer}/oauth2/authorize?${params.toString()}`;
};

// 用授權碼換取 token
export const exchangeCodeForToken = async (code) => {
  const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: authConfig.clientId,
    code: code,
    redirect_uri: authConfig.redirectUri,
    code_verifier: codeVerifier,
  });
  
  const response = await fetch(`${authConfig.issuer}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    throw new Error('Token exchange failed');
  }
  
  const tokens = await response.json();
  
  // 儲存 tokens
  sessionStorage.setItem('access_token', tokens.access_token);
  sessionStorage.setItem('id_token', tokens.id_token);
  if (tokens.refresh_token) {
    sessionStorage.setItem('refresh_token', tokens.refresh_token);
  }
  
  // 清除 PKCE 資料
  sessionStorage.removeItem('pkce_code_verifier');
  sessionStorage.removeItem('oauth_state');
  
  return tokens;
};

// 檢查是否已登入
export const isAuthenticated = () => {
  return !!sessionStorage.getItem('access_token');
};

// 取得用戶資訊
export const getUserInfo = () => {
  const idToken = sessionStorage.getItem('id_token');
  if (!idToken) return null;
  
  try {
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    return {
      email: payload.email,
      name: payload.name || payload.email,
      sub: payload.sub,
    };
  } catch {
    return null;
  }
};

// 登出
export const logout = () => {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('id_token');
  sessionStorage.removeItem('refresh_token');
  window.location.href = '/admin/events';
};
