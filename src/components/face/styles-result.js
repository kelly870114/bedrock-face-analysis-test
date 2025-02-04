import styled, { createGlobalStyle } from 'styled-components';

const MAIN_COLOR = "#C84B31";

export const Container = styled.div`
  padding: 5%;
  margin: 2% auto;
  width: 90%;
  max-width: 400px;
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

export const RetakeButton = styled.button`
  background-color: ${MAIN_COLOR};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  width: 100%;
  font-family: "Noto Serif TC", serif;
  font-size: 16px;

  &:hover {
    background-color: #b85c38;
  }
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
`;

export const BlockTitle = styled.div`
  position: center;
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
  justify-content: space-between;
  gap: 8px;
  width: fit-content;
  min-width: 200px;
  max-width: 80%;

  .title-icon {
    width: 18px;
    height: 18px;
  }

  .title-text {
    flex: 1;
    text-align: center;
  }
`;

export const ContentItem = styled.div`
  margin-bottom: 12px;
  text-align: center;
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
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  font-family: "Noto Serif TC", serif;
  p {
    color: #666;
    line-height: 1.8;
    margin: 0;
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

export const DownloadButton = styled.button`
  background-color: ${MAIN_COLOR};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  width: 100%;
  font-family: "Noto Serif TC", serif;
  font-size: 16px;

  &:hover {
    background-color: #b85c38;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ResultContainer = styled.div`
  background-color: #fdf6e9;
  padding: 20px;
  border-radius: 12px;
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
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  position: relative;
`;

export const ModalTitle = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  font-family: "Noto Serif TC", serif;
  font-size: 18px;
  color: ${MAIN_COLOR};
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  
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
