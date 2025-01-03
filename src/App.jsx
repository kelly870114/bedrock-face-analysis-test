import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopView from './components/desktop/DesktopView';
import MobileView from './components/mobile/MobileView';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DesktopView />} />
        <Route path="/mobile" element={<MobileView />} />
      </Routes>
    </Router>
  );
};

export default App;