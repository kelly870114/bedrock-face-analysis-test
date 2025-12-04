import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Noto Sans TC', sans-serif;
  background: linear-gradient(135deg, #232F3E 0%, #37475A 100%);
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
`;

const Message = styled.div`
  font-size: 18px;
  color: ${props => props.$error ? '#D32F2F' : '#333'};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF9900;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 當認證完成後導向 admin 頁面
    if (auth.isAuthenticated) {
      navigate('/admin/events');
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <Container>
        <Card>
          <Message $error>登入失敗: {auth.error.message}</Message>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Spinner />
        <Message>正在處理登入...</Message>
      </Card>
    </Container>
  );
};

export default AuthCallback;
