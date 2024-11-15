import styled from 'styled-components';

const MAIN_COLOR = '#5832A8';

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
 background-color: #5832A8;
 color: white;
 border: none;
 padding: 15px 30px;
 border-radius: 30px;
 font-size: 18px;
 display: flex;
 align-items: center;
 gap: 10px;
 box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
 
 &:hover {
   background-color: #4a2b8e;
 }
 
 &:active {
   transform: scale(0.95);
 }
`;

export const ImageContainer = styled.div`
 margin: 20px 0;
 img {
   width: 100%;
   max-width: 200px;
   height: auto;
 }
`;

export const CatDiagram = styled.div`
 margin: 30px 0;
 padding: 20px;
 background-color: rgba(255, 255, 255, 0.9);
 border-radius: 20px;
 img {
   width: 100%;
   max-width: 300px;
   height: auto;
 }
`;