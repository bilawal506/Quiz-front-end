import React, { useState } from 'react';
import Dashboard from './subject';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <>
      <div>
        <h1 style={{"textAlign":'center'}}>Welcome to QuizMaster.com!</h1>
        <Dashboard setSelectedSubject={setSelectedSubject} setSelectedChapter={setSelectedChapter} />
      </div>
    </>
  );
}

export default App;
