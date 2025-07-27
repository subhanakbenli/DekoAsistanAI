import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, RoomDesignStudio } from './pages';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/studio" element={<RoomDesignStudio />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
