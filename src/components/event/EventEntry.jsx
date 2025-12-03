import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MAIN_COLOR = "#C84B31";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FDF6E9 0%, #F5E6D3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${MAIN_COLOR};
  font-size: 24px;
  font-family: 'Noto Sans', sans-serif;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 30px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
  font-family: 'Noto Sans TC', sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${MAIN_COLOR};
  }
  
  &::placeholder {
    color: #bbb;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 20px;
  border: none;
  border-radius: 12px;
  background: ${MAIN_COLOR};
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #b85c38;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #D32F2F;
  font-size: 14px;
  margin-top: 15px;
  padding: 10px;
  background: #FFEBEE;
  border-radius: 8px;
`;

const EventEntry = () => {
  const navigate = useNavigate();
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventId.trim()) {
      setError("Please enter an event code");
      return;
    }

    setIsLoading(true);
    setError("");

    // 直接導向活動首頁，讓那邊處理驗證
    navigate(`/home?event=${eventId.trim()}`);
  };

  return (
    <PageWrapper>
      <Container>
        <Logo>🎪</Logo>
        <Title>AWS Interactive Experience</Title>
        <Subtitle>Enter your event code to get started</Subtitle>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Enter event code"
            autoFocus
          />
          
          <SubmitButton type="submit" disabled={isLoading || !eventId.trim()}>
            {isLoading ? "Loading..." : "Get Started"}
          </SubmitButton>
        </form>

        {error && <ErrorText>{error}</ErrorText>}
      </Container>
    </PageWrapper>
  );
};

export default EventEntry;
