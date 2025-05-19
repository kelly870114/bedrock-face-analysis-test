import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { X } from 'lucide-react';
import {
  PageWrapper,
  ChineseContainer,
  BorderContainer,
  Corner,
  ContentWrapper,
  TitleContainer,
  LogoContainer,
  FormContainer,
  InputContainer,
  Input,
  ButtonGroup,
  CategoryButton,
  StartButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalCloseButton,
  NumberInput,
  NumberButtonGrid,
  NumberButton
} from './styles-fortune-mobile';
import FortuneResult from './FortuneNumber';
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useTranslation, translateError } from "../../i18n";

const FortuneMobileView = ({ lang }) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(lang);
  
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [fortuneNumber, setFortuneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingNumber, setExistingNumber] = useState(null);
  const [instanceKey, setInstanceKey] = useState(Date.now()); // 用於強制重新渲染FortuneResult
  const [error, setError] = useState("");

  // 從 URL 參數讀取重置信息
  useEffect(() => {
    // 檢查是否是重置操作
    const resetParam = searchParams.get("reset");
    if (resetParam) {
      // 重置所有狀態
      setName("");
      setSelectedCategory(null);
      setShowResult(false);
      setExistingNumber(null);
      setFortuneNumber("");
      setError("");
      
      // 更新URL，移除reset參數
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleStartFortune = () => {
    // 檢查是否選擇了類別
    if (!selectedCategory) {
      setError(t("fortuneTelling.noCategoryError"));
      return;
    }
    
    if (!name.trim()) {
      setError(t("fortuneTelling.noNameError", { defaultValue: "請輸入姓名" }));
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // 清空既有籤號
    setExistingNumber(null);
    
    // 生成新的instanceKey，確保FortuneResult組件完全重新渲染
    setInstanceKey(Date.now());
    
    // 使用延時確保狀態更新完成後再顯示結果
    setTimeout(() => {
      setShowResult(true);
      setIsLoading(false);
    }, 50);
  };

  const handleExistingNumber = () => {
    const number = parseInt(fortuneNumber);
    if (number >= 1 && number <= 24) {
      if (!name.trim()) {
        setError(t("fortuneTelling.noNameError", { defaultValue: "請輸入姓名" }));
        return;
      }
      
      setIsLoading(true);
      setError("");
      
      // 設置已有籤號
      setExistingNumber(number);
      
      // 關閉模態框
      setShowNumberModal(false);
      
      // 生成新的instanceKey
      setInstanceKey(Date.now());
      
      // 延時顯示結果
      setTimeout(() => {
        setShowResult(true);
        setIsLoading(false);
      }, 50);
    } else {
      setError(t("fortuneTelling.invalidFortuneNumber", { defaultValue: "請輸入 1-24 之間的籤號" }));
    }
  };

  const handleRetry = () => {
    setName('');
    setSelectedCategory(null);
    setShowResult(false);
    setFortuneNumber('');
    setExistingNumber(null);
    setError("");
  };

  return (
    <PageWrapper>
      <ChineseContainer>
        <BorderContainer />
        <Corner className="top-left" />
        <Corner className="top-right" />
        <Corner className="bottom-left" />
        <Corner className="bottom-right" />

        <ContentWrapper>
          <LanguageSwitcher />
          
          {!showResult ? (
            <>
              <TitleContainer>
                <img src="/app_title_fortune.png" alt={t("fortuneTelling.title")} />
              </TitleContainer>

              <LogoContainer>
                <img src="/mobile_logo_fortune.png" alt={t("fortuneTelling.title")} />
              </LogoContainer>

              <FormContainer>
                <InputContainer>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("fortuneTelling.enterName")}
                    maxLength={20}
                  />
                </InputContainer>

                <ButtonGroup>
                  <CategoryButton
                    selected={selectedCategory === 'love'}
                    onClick={() => setSelectedCategory('love')}
                  >
                    {t("fortuneTelling.category.love")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'career'}
                    onClick={() => setSelectedCategory('career')}
                  >
                    {t("fortuneTelling.category.career")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'wealth'}
                    onClick={() => setSelectedCategory('wealth')}
                  >
                    {t("fortuneTelling.category.wealth")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'family'}
                    onClick={() => setSelectedCategory('family')}
                  >
                    {t("fortuneTelling.category.family")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'study'}
                    onClick={() => setSelectedCategory('study')}
                  >
                    {t("fortuneTelling.category.study")}
                  </CategoryButton>
                  <CategoryButton
                    selected={selectedCategory === 'travel'}
                    onClick={() => setSelectedCategory('travel')}
                  >
                    {t("fortuneTelling.category.travel")}
                  </CategoryButton>
                </ButtonGroup>

                {error && (
                  <div style={{ 
                    color: 'red', 
                    backgroundColor: '#fee', 
                    padding: '10px', 
                    margin: '10px 0', 
                    borderRadius: '5px',
                    textAlign: 'center',
                    width: '90%',
                    maxWidth: '400px'
                  }}>
                    {error}
                  </div>
                )}

                <StartButton
                  disabled={!selectedCategory || isLoading || !name.trim()}
                  onClick={handleStartFortune}
                >
                  {isLoading ? t("common.loading") : t("fortuneTelling.startFortuneTelling")}
                </StartButton>

                <StartButton
                  disabled={!selectedCategory || isLoading || !name.trim()}
                  onClick={() => setShowNumberModal(true)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#C84B31', 
                    border: '2px solid #C84B31',
                    marginTop: '10px'
                  }}
                >
                  {t("fortuneTelling.hasFortuneNumber")}
                </StartButton>
              </FormContainer>
            </>
          ) : (
            <FortuneResult
              key={instanceKey} // 使用key強制重新渲染
              user_name={name}
              category={selectedCategory}
              existingNumber={existingNumber}
              lang={lang} // 傳遞語言設定
            />
          )}
        </ContentWrapper>
      </ChineseContainer>

      {showNumberModal && (
        <ModalOverlay onClick={() => setShowNumberModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowNumberModal(false)}>
              <X size={20} />
            </ModalCloseButton>
            <ModalTitle>{t("fortuneTelling.chooseFortuneNumber")}</ModalTitle>
            <NumberInput
              type="number"
              min="1"
              max="24"
              value={fortuneNumber}
              onChange={(e) => setFortuneNumber(e.target.value)}
              placeholder={t("fortuneTelling.fortuneNumberPlaceholder")}
            />
            
            {/* 數字按鈕 */}
            <NumberButtonGrid>
              {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                <NumberButton
                  key={num}
                  selected={parseInt(fortuneNumber) === num}
                  onClick={() => setFortuneNumber(num.toString())}
                >
                  {num}
                </NumberButton>
              ))}
            </NumberButtonGrid>
            
            {error && (
              <div style={{ 
                color: 'red', 
                backgroundColor: '#fee', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <StartButton
              onClick={handleExistingNumber}
              disabled={isLoading || !fortuneNumber || parseInt(fortuneNumber) < 1 || parseInt(fortuneNumber) > 24}
            >
              {isLoading ? t("common.loading") : t("fortuneTelling.confirm")}
            </StartButton>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {isLoading && (
        <ModalOverlay>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Noto Serif TC, serif' }}>
            {t("common.loading")}
          </div>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default FortuneMobileView;