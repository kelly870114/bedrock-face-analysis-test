import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopView from './components/common/DesktopView/DesktopView';
import MobileView from './components/face/MobileView';
import FortuneMobileView from './components/fortune/FortuneMobileView';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* 主入口 */}
        <Route path="/" element={<DesktopView />} />
        
        {/* 面相大師手機介面 */}
        <Route path="/face/mobile" element={<MobileView />} />
        
        {/* 解籤大師手機介面 */}
        <Route path="/fortune/mobile" element={<FortuneMobileView />} />
      </Routes>
    </Router>
  );
};

export default App;