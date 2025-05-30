import styled, { createGlobalStyle, keyframes } from 'styled-components';

const MAIN_COLOR = '#C84B31';

const fadeInOut = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

// 第一階段 - 圓形旋轉動畫
const rotateCircle = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 第三階段 - 金色光芒效果
const goldenGlow = keyframes`
  0% { 
    filter: drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 15px #FFD700);
    opacity: 0.8;
  }
  50% { 
    filter: drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 30px #FFD700);
    opacity: 1;
  }
  100% { 
    filter: drop-shadow(0 0 5px #FFD700) drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 15px #FFD700);
    opacity: 0.8;
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 24px;
  position: center;
  z-index: 1;
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
  margin: 0 auto 40px;
  
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
  margin: 40px auto; /* 修改：增加 top margin 避免擋到邊框 */
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

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #FDF6E9;
  display: flex;
  flex-direction: column;
`;

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

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    height: 7px;
    background-color: ${MAIN_COLOR};
  }

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

export const BorderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50px;
    bottom: 50px;
    left: 20px;
    width: 7px;
    background-color: ${MAIN_COLOR};
  }

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
`;

export const Corner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${MAIN_COLOR};

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

// ===== 進度指示器相關樣式 =====
export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 90%;
  max-width: 450px;
  margin: 40px auto;
  padding: 20px 10px;
`;

// 進度階段樣式
export const ProgressStage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  flex: 1;
  position: relative;

  // 虛線連接線（除了最後一個）
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 40px; // 調整到圖示中心位置
    right: -20px;
    width: 20px;
    height: 2px;
    background-image: linear-gradient(to right, ${props => props.isActive ? MAIN_COLOR : '#E0E0E0'} 40%, transparent 40%);
    background-size: 8px 2px;
    background-repeat: repeat-x;
    z-index: 0;
  }
`;

// 第一階段 - 臉型分析圖示容器
export const FaceShapeContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 第一階段 - 旋轉的圓形邊框（完整圓圈，只有小縫隙）
export const RotatingCircle = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid ${props => props.isActive ? MAIN_COLOR : '#E0E0E0'};
  border-radius: 50%;
  border-top-color: transparent;
  border-top-width: 6px; // 讓縫隙更明顯一點
  animation: ${props => props.isProcessing ? rotateCircle : 'none'} 2s linear infinite;
`;

// 第一階段 - 中心圖示
export const FaceIcon = styled.img`
  width: 50px;
  height: 50px;
  z-index: 1;
  filter: ${props => props.isActive ? 'none' : 'grayscale(100%)'};
  opacity: ${props => props.isActive ? 1 : 0.5};
`;

// 第二階段 - 輪播圖示容器（確保沒有圓圈樣式）
export const FeatureContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* 確保沒有 border 或其他圓圈樣式 */
`;

// 第二階段 - 輪播圖示（保持原始比例，不壓縮）
export const FeatureIcon = styled.img`
  max-width: 80px;  /* 增加最大寬度 */
  max-height: 80px; /* 增加最大高度 */
  width: auto;
  height: auto;
  object-fit: contain;
  transition: opacity 0.3s ease;
  filter: ${props => props.isActive ? 'none' : 'grayscale(100%)'};
  opacity: ${props => props.isActive ? 1 : 0.5};
  /* 確保圖片不會被額外的樣式影響 */
  border: none;
  border-radius: 0;
  background: none;
`;

// 第三階段 - 運勢圖示容器
export const OverallContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 第三階段 - 閃光圖示（保持原始比例，不壓縮）
export const OverallIcon = styled.img`
  max-width: 80px;  /* 增加最大寬度 */
  max-height: 80px; /* 增加最大高度 */
  width: auto;      
  height: auto;
  object-fit: contain;
  animation: ${props => props.isProcessing ? goldenGlow : 'none'} 2s ease-in-out infinite;
  filter: ${props => props.isActive ? 'none' : 'grayscale(100%)'};
  opacity: ${props => props.isActive ? 1 : 0.5};
  /* 確保圖片不會被額外的樣式影響 */
  border: none;
  border-radius: 0;
  background: none;
`;

// 進度文字
export const ProgressText = styled.div`
  font-family: "Noto Serif TC", serif;
  font-size: 14px;
  color: ${props => 
    props.completed ? '#4CAF50' : 
    props.isActive ? MAIN_COLOR : 
    '#999999'  // pending 狀態是灰色
  };
  font-weight: 500;
  text-align: center;
  max-width: 100px;
  line-height: 1.2;
`;

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