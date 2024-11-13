import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Container,
  Card,
  Title,
  Description,
  QRContainer,
  InstructionList,
  Instruction,
  Footer
} from './styles';

const DesktopView = () => {
  const currentUrl = window.location.origin;
  const mobileUrl = `${currentUrl}/mobile`;

  return (
    <Container>
      <Card>
        <Title>面相分析系統</Title>
        <Description>
          請使用手機掃描下方 QR Code 開始分析
        </Description>
        
        <QRContainer>
          <QRCodeSVG
            value={mobileUrl}
            size={240}
            level="H"
            includeMargin={true}
          />
        </QRContainer>

        <InstructionList>
          <Instruction number="1">
            請使用手機相機掃描 QR Code
          </Instruction>
          <Instruction number="2">
            掃描後會自動開啟相機進行拍攝
          </Instruction>
          <Instruction number="3">
            拍攝完成後系統會自動進行分析
          </Instruction>
        </InstructionList>
      </Card>

      <Footer>
        © 2024 Face Reading System. All rights reserved.
      </Footer>
    </Container>
  );
};

export default DesktopView;