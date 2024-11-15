// src/components/mobile/styles.js
import styled from 'styled-components';

const MAIN_COLOR = '#FF9900';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  h1 {
    font-size: 20px;
    color: #333;
    font-weight: 600;
    text-align: center;
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 24px;
`;

export const MessageBox = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 320px;
  width: 100%;
  
  h2 {
    color: ${MAIN_COLOR};
    font-size: 24px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    line-height: 1.5;
    font-size: 16px;
  }
`;

export const CameraButtonContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

export const CameraButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;
  background-color: ${MAIN_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
  
  &:hover {
    transform: scale(1.05);
    background-color: #ffad33;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
export const ImageContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;