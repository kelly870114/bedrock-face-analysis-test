// src/components/mobile/AnalysisResult.jsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const Title = styled.h2`
  color: #FF9900;
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
`;

const Content = styled.div`
  white-space: pre-line;
  line-height: 1.6;
  color: #333;
  font-size: 16px;
`;

const RetakeButton = styled.button`
  background-color: #FF9900;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #FF8800;
  }
`;

const AnalysisResult = ({ result, onRetake }) => {
  const analysisText = result?.analysis || '無法取得分析結果';

  return (
    <Container>
      <Title>面相分析結果</Title>
      <Content>{analysisText}</Content>
      <RetakeButton onClick={onRetake}>
        重新拍照
      </RetakeButton>
    </Container>
  );
};

export default AnalysisResult;