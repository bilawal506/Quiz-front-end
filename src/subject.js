import React, { useState } from 'react';
import './subject.css'; // Make sure the CSS file path is correct
import { useEffect } from 'react';

function Dashboard({ setSelectedChapter, setSelectedSubject }) {
  const [isLearnOpen, setLearnOpen] = useState(false);
  const [selectedSubject, setSelectedSubjectLocal] = useState(null);
  const [selectedChapter, setSelectedChapterLocal] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [questionStatus, setQuestionStatus] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleChapterSelect = (chapter) => {
    setSelectedChapterLocal(chapter); // Update the selected chapter state
    setSelectedChapter(chapter); // Export the selected chapter to App.js
    setCorrect(0)
    setWrong(0)
    setQuestionStatus({})
    setSelectedOptions({})
  }

  const handleSubjectSelect = (subject) => {
    setSelectedSubjectLocal(subject); // Update the selected subject state
    setSelectedSubject(subject); // Export the selected subject to App.js
    setSelectedChapterLocal(null); // Reset the selected chapter state when a subject is selected
  }
  function shuffleArray(array) {
    const shuffled = array.slice(); // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled.slice(0, 10); // Return the first 10 elements
  }
  
  useEffect(() => {
    if (selectedSubject && selectedChapter) {
      fetch(`https://related-frog-charmed.ngrok-free.app/mcqs/${selectedSubject}/${selectedChapter}`)
        .then(response => response.json())
        .then(data => {
          const selectedQuestions = shuffleArray(data); // Shuffle and pick 10 questions
          setQuestions(selectedQuestions);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
          setQuestions([]); // Handle errors or empty responses
        });
    }
  }, [selectedSubject, selectedChapter]);
  

  const handleAnswerSelect = (questionId, selectedOption) => {
    if (questionStatus[questionId]?.attempted) {
        return; // Prevent changes if already attempted
    }

    const question = questions.find(q => q.id === questionId);
    const isCorrect = question.correctanswer === selectedOption;

    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: { attempted: true, correct: isCorrect }
    }));

    // Update the selected option for the question
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));

    if (isCorrect) {
        setCorrect(prev => prev + 1);
    } else {
        setWrong(prev => prev + 1);
    }
}
  return (
    <div className="dashboard">
      <div className='Top-quiz'>
      <h1>Quizes Select the Subject then the Chapter to start the quiz</h1>
      <div className="dropdown">
        <button onClick={() => setLearnOpen(!isLearnOpen)}>Learn</button>
        {isLearnOpen && (
          <div className="dropdown-content">
            <button onClick={() => setLearnOpen(false)}>Close</button>
            <button onClick={() => handleSubjectSelect('math')}>Math</button>
            {selectedSubject === 'math' && (
              <div className="dropdown-content nested">
                {Array.from({ length: 9 }, (_, i) => (
                  <button key={i + 1} onClick={() => handleChapterSelect(`${i + 1}`)}>
                    Chapter {i + 1}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => handleSubjectSelect('science')}>Science</button>
            {selectedSubject === 'science' && (
              <div className="dropdown-content nested">
                {Array.from({ length: 9 }, (_, i) => (
                  <button key={i + 1} onClick={() => handleChapterSelect(`${i + 1}`)}>
                    Chapter {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Add more subjects and chapters as needed */}
          </div>
        )}
      </div>
      <div className="book-list">
        {/* mcqs display code */}
      </div>
      </div>
      <div className='quiz-sec'>
      <h1>Quiz</h1>
      
      {questions.map(question => (
  <div key={question.id}>
    <h3>{question.question}</h3>
    <ul>
      {[1, 2, 3, 4].map(optionIndex => (
        <li key={optionIndex}>
          <label>
            <input
              type="radio"
              name={`option${question.id}`}
              value={optionIndex}
              checked={selectedOptions[question.id] === optionIndex.toString()}
              onChange={() => handleAnswerSelect(question.id, optionIndex.toString())}
              disabled={questionStatus[question.id]?.attempted}
            />
            {question[`option${optionIndex}`]}
          </label>
        </li>
      ))}
    </ul>
    {questionStatus[question.id]?.attempted && (
      <h2>{questionStatus[question.id].correct ? 'Correct!' : 'Wrong!'}</h2>
    )}
  </div>
))}

      <h1>Correct Answers :- {correct}</h1>
      <h1 style={{'color':'red'}}>Wrong Answers :- {wrong}</h1>
      <h1 style={{ color: 'blue' }}>Total Percentage :- {questions.length && correct ? ((correct / questions.length) * 100).toFixed(2) : 0}%</h1>
    </div>
    </div>
  );
}

export default Dashboard;
