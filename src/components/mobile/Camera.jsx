import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const MAIN_COLOR = '#FF9900';

// 相機全屏容器
const CameraContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

// 關閉按鈕
const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 1001;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

// 視訊預覽
const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); // 加入這行
`;

// 拍照按鈕容器
const CaptureButtonContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

// 拍照按鈕
const CaptureButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 62px;
    height: 62px;
    border-radius: 50%;
    border: 3px solid ${MAIN_COLOR};
  }
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ErrorMessage = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Camera = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 啟動相機
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('無法存取相機，請確認已授予相機權限');
      onClose();
    }
  };

  // 停止相機
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // 拍照
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    // 翻轉繪製
    context.scale(-1, 1);
    context.drawImage(video, -video.videoWidth, 0);
    
    canvas.toBlob(
      (blob) => {
        onCapture(blob);
        stopCamera();
      },
      'image/jpeg', 
      0.95
    );
  };

  // 組件掛載時啟動相機
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // 鍵盤事件處理
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'Enter') {
        handleCapture();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  return (
    <CameraContainer>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>

      <VideoPreview 
        ref={videoRef}
        autoPlay 
        playsInline
        muted
      />

      <CaptureButtonContainer>
        <CaptureButton onClick={handleCapture} />
      </CaptureButtonContainer>
    </CameraContainer>
  );
};

export default Camera;