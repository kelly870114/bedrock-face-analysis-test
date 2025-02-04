import styled from 'styled-components';

export const MAIN_COLOR = '#C84B31';

export const Container = styled.div`
  padding: 5%;
  margin: 2% auto;
  width: 90%;
  max-width: 400px;
`;

export const ImageContainer = styled.div`
  width: 45%;
  margin: 0 auto 20px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

export const ResultContainer = styled.div`
  background-color: #fdf6e9;
  padding: 20px;
  border-radius: 12px;
`;

export const AnalysisBlock = styled.div`
  background: #fff0d9;
  padding: 2rem 1rem 1rem;
  margin-bottom: 2.5rem;
  margin-top: 2rem;
  width: 100%;
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
  text-align: center;
  font-family: "Noto Serif TC", serif;
  display: flex;
  align-items: center;
  justify-content: center;  // 修改：確保內容水平居中
  gap: 8px;
  width: fit-content;
  min-width: 200px;
  max-width: 80%;

  .title-text {
    flex: 1;
    text-align: center;
    margin: 0 auto;  // 新增：確保文字居中
  }

  .title-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;  // 新增：防止圖標被壓縮
  }
`;


export const ContentItem = styled.div`
  margin-bottom: 12px;
  text-align: center;
  width: 100%;  // 新增：確保內容寬度一致
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
  width: 100%;  // 新增：確保內容寬度一致
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

export const ButtonContainer = styled.div`
  width: 90vw;
  max-width: min(400px, 90%);
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 32px;
  border-radius: 16px;
  border: none;
  background-color: ${MAIN_COLOR};
  color: white;
  font-size: 18px;
  font-weight: 800;
  font-family: 'Noto Serif TC', serif;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(184, 92, 56, 0.3);
  width: 300px;
  
  &:hover {
    transform: translateY(-2px);
    background-color: #B85C38;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 20px;
  font-family: "Noto Serif TC", serif;
`;

// Modal 相關樣式
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #FDF6E9;
  padding: 36px 24px 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  position: relative;
  border: 2px solid ${MAIN_COLOR};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ModalTitle = styled.h3`
  text-align: center;
  margin-bottom: 24px;
  font-family: "Noto Serif TC", serif;
  font-size: 20px;
  color: ${MAIN_COLOR};
  width: 100%;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000;
  }
`;

export const QRCodeContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ModalText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 0;
  font-family: "Noto Serif TC", serif;
`;