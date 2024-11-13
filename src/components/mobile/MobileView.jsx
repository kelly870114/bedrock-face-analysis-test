// src/components/mobile/MobileView.jsx
import React, { useState } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import {
  Container,
  Header,
  Content,
  MessageBox,
  CameraButtonContainer,
  CameraButton,
} from './styles';
import Camera from './Camera';

const MobileView = () => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = async (blob) => {
    try {
      // 將照片轉為 base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });

      // TODO: 之後加入 API Gateway 呼叫
      console.log('Ready to analyze photo:', { imageSize: blob.size });
      
      setShowCamera(false);
    } catch (error) {
      console.error('Error:', error);
      alert('處理照片失敗，請重試');
    }
  };

  return (
    <Container>
      <Header>
        <h1>AI 面相分析</h1>
      </Header>
      
      <Content>
        <MessageBox>
          <h2>開始分析</h2>
          <p>點擊下方相機按鈕開始拍攝，讓 AI 為您分析面相</p>
        </MessageBox>
      </Content>

      <CameraButtonContainer>
        <CameraButton onClick={() => setShowCamera(true)}>
          <CameraIcon size={32} color="white" />
        </CameraButton>
      </CameraButtonContainer>

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