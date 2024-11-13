// src/components/mobile/Camera.jsx
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, RotateCcw, Check } from 'lucide-react';

const MAIN_COLOR = '#FF9900';

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

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px;
`;

const ActionButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.variant === 'primary' ? MAIN_COLOR : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : MAIN_COLOR};
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CaptureButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  
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
`;

const Camera = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    // 保存 blob 和預覽 URL
    canvas.toBlob(
      (blob) => {
        setCapturedImage(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      },
      'image/jpeg', 
      0.95
    );
  };

  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCapturedImage(null);
    setPreviewUrl(null);
    startCamera();
  };

  const handleAccept = () => {
    onCapture(capturedImage);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  return (
    <CameraContainer>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>

      {!previewUrl ? (
        <>
          <VideoPreview 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
          />
          <ButtonContainer>
            <CaptureButton onClick={handleCapture} />
          </ButtonContainer>
        </>
      ) : (
        <>
          <ImagePreview src={previewUrl} alt="captured" />
          <ButtonContainer>
            <ActionButton onClick={handleRetake}>
              <RotateCcw size={24} />
            </ActionButton>
            <ActionButton variant="primary" onClick={handleAccept}>
              <Check size={24} />
            </ActionButton>
          </ButtonContainer>
        </>
      )}
    </CameraContainer>
  );
};

export default Camera;