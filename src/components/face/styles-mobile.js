import styled, { createGlobalStyle } from 'styled-components';
import { keyframes } from 'styled-components';

const MAIN_COLOR = '#C84B31';

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

// Message box
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

// 開始分析按鈕
export const CameraButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  background-color: #C84B31;
  color: white;
  font-size: 18px;
  font-weight: 800;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(184, 92, 56, 0.3);
  width: 200px;
  margin: 0 auto 40px;  /* 只保留底部邊距 */
  
  &:hover {
    transform: translateY(-2px);
    background-color: #B85C38;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ImageContainer = styled.div`
  width: 90vw;
  max-width: min(500px, 90%);
  position: relative;
  margin: 50px auto auto auto;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  align-items: center;

  .image-wrapper {
    width: 100%;
    position: relative;
    height: fit-content;
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
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
  font-weight: 500;
  font-family: 'Noto Serif TC', serif;
  animation: ${fadeInOut} 2s infinite ease-in-out;
`;

// 最外層容器 - 與 fortune 風格一致
export const PageWrapper = styled.div`
  min-height: 100vh;
  height: 100%;
  background-color: #FDF6E9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 背景和邊框 - 與 fortune 風格一致
export const ChineseContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px;
  background-color: #FDF6E9;
  ${props => props.isAnalyzing && `
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
  `}

  /* 上邊框 */
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    height: 7px;
    background-color: ${MAIN_COLOR};
  }

  /* 下邊框 */
  &::after {
    content: '';
    position: absolute;
    bottom: 20px;
    left: 50px;
    right: 50px;
    height: 7px;
    background-color: ${MAIN_COLOR};
  }
`;

// 左右邊框 - 與 fortune 風格一致
export const BorderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* 左邊框 */
  &::before {
    content: '';
    position: absolute;
    top: 50px;
    bottom: 50px;
    left: 20px;
    width: 7px;
    background-color: ${MAIN_COLOR};
  }

  /* 右邊框 */
  &::after {
    content: '';
    position: absolute;
    top: 50px;
    bottom: 50px;
    right: 20px;
    width: 7px;
    background-color: ${MAIN_COLOR};
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow-y: auto;  /* 添加捲動功能 */
  height: 100%; 
  padding: 20px;
  -webkit-overflow-scrolling: touch;
`;

// 圓角 - 與 fortune 風格一致
export const Corner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${MAIN_COLOR};
  z-index: 2;

  &.top-left {
    top: 10px;
    left: 10px;
  }

  &.top-right {
    top: 10px;
    right: 10px;
  }

  &.bottom-left {
    bottom: 10px;
    left: 10px;
  }

  &.bottom-right {
    bottom: 10px;
    right: 10px;
  }
`;

// 標題容器
export const TitleContainer = styled.div`
  width: 90vw;
  max-width: min(500px, 90%);
  margin: 20px auto;
  text-align: center;
  padding: 0 20px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: auto;
    transform: scale(0.8);
    transform-origin: center center;
  }

  @media (min-height: 700px) {
    img {
      transform: scale(0.9);
    }
  }

  @media (min-height: 800px) {
    img {
      transform: scale(1);
    }
  }
`;

// 首頁中間圖片，跟隨標題寬度
export const LogoContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: min(500px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 50vh;

  img {
    width: 100%;
    height: auto;
    transform: scale(0.8);
    transform-origin: center center;
    object-fit: contain;
  }

  @media (min-height: 700px) {
    img {
      transform: scale(0.9);
    }
  }

  @media (min-height: 800px) {
    img {
      transform: scale(1);
    }
  }
`;

// v2.0
export const AnalysisBlock = styled.div`
  background: #fff0d9;
  padding: 2rem 1rem 1rem;
  margin-bottom: 2.5rem;
  margin-top: 2rem;
  width: 90%;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BlockTitle = styled.div`
  position: relative;
  margin: 0 auto 20px;
  background: #fff7e6;
  padding: 5px 20px;
  border: 2px solid ${MAIN_COLOR};
  border-radius: 20px;
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  font-family: "Noto Serif TC", serif;
  width: fit-content;
  min-width: min(200px, 90%);
  max-width: 90%;
  box-sizing: border-box;
  position: relative;

  .title-icon {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &:first-child {
      left: 12px;
    }

    &:last-child {
      right: 12px;
    }
  }

  .title-text {
    display: block;
    text-align: center;
    padding: 0 30px;
    word-wrap: break-word;
    hyphens: auto;
  }
`;

export const ContentItem = styled.div`
  margin-bottom: 12px;
  text-align: center;
  width: 100%;
`;

export const ItemTitle = styled.h4`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  text-align: center;
  font-family: "Noto Serif TC", serif;
`;

export const ItemContent = styled.p`
  color: #414141;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  font-family: "Noto Serif TC", serif;
`;

export const Summary = styled.div`
  width: 90%;
  max-width: 450px;
  margin: 0 auto 30px;
  border-radius: 12px;
  padding: 20px;
  font-family: "Noto Serif TC", serif;
  
  p {
    color: #414141;
    line-height: 1.8;
    margin: 0;
    font-size: 15px;
  }
`;

export const IconImage = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  z-index: 3;
`;

// 進度指示器容器
export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90%;
  max-width: 450px;
  margin: 20px auto;
`;

// 進度項目
export const ProgressItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fff0d9;
  border: 2px solid ${({ status }) => 
    status === 'completed' ? '#4CAF50' : 
    status === 'processing' ? MAIN_COLOR : 
    status === 'failed' ? '#F44336' : '#E0E0E0'
  };
  
  .stage-name {
    font-weight: 500;
    font-family: "Noto Serif TC", serif;
    font-size: 16px;
  }
  
  .stage-status {
    font-family: "Noto Serif TC", serif;
    font-weight: 500;
    color: ${({ status }) => 
      status === 'completed' ? '#4CAF50' : 
      status === 'processing' ? MAIN_COLOR : 
      status === 'failed' ? '#F44336' : '#757575'
    };
  }
`;

// 錯誤訊息
export const ErrorMessage = styled.div`
  background-color: #FFEBEE;
  border: 2px solid #F44336;
  border-radius: 8px;
  padding: 16px;
  margin: 20px auto;
  width: 90%;
  max-width: 450px;
  text-align: center;
  
  p {
    color: #D32F2F;
    margin-bottom: 16px;
    font-family: "Noto Serif TC", serif;
    font-size: 16px;
  }
`;

// 重拍按鈕
export const RetakeButton = styled.button`
  background-color: ${MAIN_COLOR};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: "Noto Serif TC", serif;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #B85C38;
  }
`;