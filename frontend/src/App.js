import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/home';
import GamePage from './components/game';
import RoomPage from './components/room';
import GenerateImagePage from './components/generateImage'
import './components/home.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<HomePage/>} />
        <Route path='/game/:room' element={<GamePage/>} />
        <Route path='/room' element={<RoomPage/>} />
        <Route path='/generate-image/:room' element={<GenerateImagePage/>} />
      </Routes>
    </Router>
  );
}

export default App;