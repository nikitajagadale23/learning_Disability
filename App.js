import React, { useState } from 'react';
import './App.css';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [quizResults, setQuizResults] = useState({});

  const startQuiz = (ageGroup) => {
    setQuizData(getQuizQuestions(ageGroup));
    setQuizResults({});
  };

  const handleAnswer = (questionId, answer) => {
    setQuizResults((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleTextAnswer = (questionId, e) => {
    handleAnswer(questionId, e.target.value);
  };

  const handleSubmitQuiz = () => {
    console.log('Submitted Quiz Results:', quizResults);
    alert('Quiz submitted! Thank you.');
    setQuizData(null);
  };

  return (
    <div className="App">
      <header>
        <h1>Learning Disability Screening Quiz</h1>
      </header>

      <main>
        {!quizData && (
          <div className="age-selector">
            <h2>Select Age Group</h2>
            <button onClick={() => startQuiz('7-9')}>Age 7-9</button>
            <button onClick={() => startQuiz('10-11')}>Age 10-11</button>
            <button onClick={() => startQuiz('12-13')}>Age 12-13</button>
            <button onClick={() => startQuiz('14-15')}>Age 14-15</button>
          </div>
        )}

        {quizData && (
          <div className="quiz-container">
            <h2>Quiz</h2>
            {quizData.map((question) => (
              <div key={question.id} className="question">
                <p>{question.text}</p>

                {question.options.length > 0 ? (
                  question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(question.id, option)}
                      className={quizResults[question.id] === option ? 'selected' : ''}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <textarea
                    placeholder="Write your answer here..."
                    value={quizResults[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e)}
                    rows={4}
                  />
                )}
              </div>
            ))}

            <button onClick={handleSubmitQuiz} className="submit-button">
              Submit Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
}



export default App;
