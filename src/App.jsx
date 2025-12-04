import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventEntry from './components/event/EventEntry';
import EventLanding from './components/event/EventLanding';
import FortuneMobileView from './components/fortune/FortuneMobileView';
import MobileView from './components/face/MobileView';
import EventConfigManager from './components/admin/EventConfigManager';
import AuthCallback from './components/admin/AuthCallback';
import { SUPPORTED_LANGUAGES } from './i18n/config';

const App = () => {
  const languagePaths = Object.keys(SUPPORTED_LANGUAGES);
  
  return (
    <Router>
      <Routes>
        {/* 首頁 - 輸入活動代碼 */}
        <Route path="/" element={<EventEntry />} />
        
        {/* 活動首頁 - 顯示功能選項 */}
        <Route path="/home" element={<EventLanding />} />
        
        {/* 為每種支援的語言創建路由 */}
        {languagePaths.map((lang) => (
          <React.Fragment key={lang}>
            {/* 籤詩算命頁面 */}
            <Route path={`/${lang}/fortune`} element={<FortuneMobileView lang={lang} />} />
            
            {/* 面相分析頁面 */}
            <Route path={`/${lang}/face`} element={<MobileView lang={lang} />} />
            
            {/* 保留舊路由相容性（可之後移除） */}
            <Route path={`/${lang}/fortune/mobile`} element={<FortuneMobileView lang={lang} />} />
            <Route path={`/${lang}/face/mobile`} element={<MobileView lang={lang} />} />
          </React.Fragment>
        ))}
        
        {/* 活動配置管理頁面 */}
        <Route path="/admin/events" element={<EventConfigManager />} />
        
        {/* SSO 回調頁面 */}
        <Route path="/admin/callback" element={<AuthCallback />} />
        
        {/* 捕捉無效路徑 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;