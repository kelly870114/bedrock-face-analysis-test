import React, { useState } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { config } from '../../config';  // 引入設定
import {
  Container,
  Header,
  Content,
  MessageBox,
  CameraButtonContainer,
  CameraButton,
} from './styles';
import Camera from './Camera';
import AnalysisResult from './AnalysisResult';


const MobileView = () => {
    const [showCamera, setShowCamera] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
  
    const handleCapture = async (blob) => {
      try {
        setIsAnalyzing(true);
        setError(null);
  
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(blob);
        });
  
        const response = await fetch(`${config.apiEndpoint}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image
          })
        });
  
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          throw new Error(data.error || '分析失敗');
        }
  
        setAnalysisResult(data);
        
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsAnalyzing(false);
        setShowCamera(false);
      }
    };
  
    const handleRetake = () => {
      setAnalysisResult(null);
      setError(null);
      setShowCamera(true);
    };
  
    return (
      <Container>
        <Header>
          <h1>AI 面相分析</h1>
        </Header>
        
        <Content>
          {isAnalyzing ? (
            <MessageBox>
              <h2>分析中</h2>
              <p>正在進行面相分析，請稍候...</p>
            </MessageBox>
          ) : error ? (
            <MessageBox>
              <h2>發生錯誤</h2>
              <p>{error}</p>
            </MessageBox>
          ) : analysisResult ? (
            <AnalysisResult 
              result={analysisResult}
              onRetake={handleRetake}
            />
          ) : (
            <MessageBox>
              <h2>開始分析</h2>
              <p>點擊下方相機按鈕開始拍攝，讓 AI 為您分析面相</p>
            </MessageBox>
          )}
        </Content>
  
        {!analysisResult && !isAnalyzing && (
          <CameraButtonContainer>
            <CameraButton 
              onClick={() => setShowCamera(true)}
              disabled={isAnalyzing}
            >
              <CameraIcon size={32} color="white" />
            </CameraButton>
          </CameraButtonContainer>
        )}
  
        {showCamera && (
          <Camera
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </Container>
    );
  };
  
  export default MobileView;