import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/screenHome/home';
import GamePage from './components/screenGame/screenGuessing/guessingGame';
import GenerateImagePage from './components/screenGame/screenGenerate/generateImage';
import './components/screenHome/home.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<HomePage/>} />
        <Route path='/game/:room' element={<GamePage/>} />
        <Route path='/generate-image/:room' element={<GenerateImagePage/>} />
      </Routes>
    </Router>
  );
}

export default App;