import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { config } from '../../config';
import {
  Container,
  Card,
  Title,
  Description,
  QRContainer,
  InstructionList,
  Instruction,
  Footer,
  Input,
  Button,
  ErrorMessage,
  EventTitle
} from './styles';

const DesktopView = () => {
  const [eventId, setEventId] = useState('');
  const [eventInfo, setEventInfo] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId.trim()) {
      setError('請輸入活動代碼');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${config.apiEndpoint}/checkEvent?event=${eventId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '無法取得活動資訊');
      }

      if (!data.isAccessible) {
        setError(data.message || '活動未開放');
        return;
      }

      setEventInfo({
        id: eventId,
        name: data.eventName,
        message: data.message
      });
    } catch (err) {
      setError(err.message || '系統發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEventId('');
    setEventInfo(null);
    setError('');
  };

  const currentUrl = window.location.origin;
  const mobileUrl = `${currentUrl}/mobile?event=${eventInfo?.id}`;

  if (eventInfo) {
    return (
      <Container>
        <Card>
          <EventTitle>
            <h1>{eventInfo.name}</h1>
            <button onClick={handleReset} className="reset-button">
              返回
            </button>
          </EventTitle>
          
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
  }

  return (
    <Container>
      <Card>
        <Title>面相分析系統</Title>
        <Description>
          請輸入活動代碼以取得分析連結
        </Description>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="請輸入活動代碼"
            disabled={isLoading}
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button 
            type="submit" 
            disabled={isLoading || !eventId.trim()}
          >
            {isLoading ? '載入中...' : '確認'}
          </Button>
        </form>
      </Card>

      <Footer>
        © 2024 Face Reading System. All rights reserved.
      </Footer>
    </Container>
  );
};

export default DesktopView;