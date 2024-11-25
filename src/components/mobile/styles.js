import styled from 'styled-components';
import { keyframes } from 'styled-components';


const MAIN_COLOR = '#F39518';
const fadeInOut = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative; // 添加相對定位
`;


export const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; // 改為100vh以覆蓋整個視窗高度
  background-image: url('/mobile_bg.png');
  background-size: contain; // 改為contain確保圖片完整顯示
  background-position: top center; // 確保圖片從頂部開始
  background-repeat: no-repeat;
  z-index: 0;
`;



export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 24px;
  position: center; // 添加相對定位
  z-index: 1; // 確保內容在背景之上
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
  z-index: 2;
`;

export const CameraButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px; // 圖標和文字之間的間距
  padding: 16px 32px; // 調整內部間距
  border-radius: 10px; // 圓角
  border: none;
  background-color: #000000;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    background-color: #414141;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  position: relative; // 添加相對定位
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  animation: ${fadeInOut} 2s infinite ease-in-out;
`;
