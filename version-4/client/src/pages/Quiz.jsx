import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Quiz({ countriesData }) {
  const navigate = useNavigate();

  // stores the current question — a country whose flag we show
  const [currentCountry, setCurrentCountry] = useState(null);

  // stores the 4 answer options (one correct, three wrong)
  const [options, setOptions] = useState([]);

  // stores what the user selected
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // tracks whether the answer was correct or wrong
  const [isCorrect, setIsCorrect] = useState(null);

  // tracks the score
  const [score, setScore] = useState(0);

  // tracks how many questions have been answered
  const [questionCount, setQuestionCount] = useState(0);

  // tracks if the quiz is over (after 10 questions)
  const [quizOver, setQuizOver] = useState(false);


  // pick a random country and generate 4 answer options
  function generateQuestion() {
    if (!countriesData || countriesData.length === 0) return;

    // pick a random country as the correct answer
    const randomIndex = Math.floor(Math.random() * countriesData.length);
    const correct = countriesData[randomIndex];

    // pick 3 random wrong answers
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomWrong = countriesData[Math.floor(Math.random() * countriesData.length)];
      if (
        randomWrong.cca3 !== correct.cca3 &&
        !wrongOptions.find((c) => c.cca3 === randomWrong.cca3)
      ) {
        wrongOptions.push(randomWrong);
      }
    }

    // combine and shuffle all 4 options
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentCountry(correct);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }

  // generate the first question when countriesData loads
  useEffect(() => {
    if (countriesData.length > 0) {
      generateQuestion();
    }
  }, [countriesData]);


  // handle when the user clicks an answer
  function handleAnswer(country) {
    if (selectedAnswer) return; // prevent clicking again after answering

    setSelectedAnswer(country.cca3);

    if (country.cca3 === currentCountry.cca3) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
    } else {
      setIsCorrect(false);
    }

    setQuestionCount((prev) => prev + 1);

    // end quiz after 10 questions
    if (questionCount + 1 >= 10) {
      setTimeout(() => setQuizOver(true), 1200);
    } else {
      setTimeout(() => generateQuestion(), 1200);
    }
  }


  // restart the quiz
  function handleRestart() {
    setScore(0);
    setQuestionCount(0);
    setQuizOver(false);
    generateQuestion();
  }


  if (!currentCountry) {
    return <p className="loading">Loading quiz...</p>;
  }

  if (quizOver) {
    return (
      <main className="quiz-page">
        <div className="quiz-result-card">
          <h1 className="quiz-result-emoji">
            {score >= 8 ? "🏆" : score >= 5 ? "🌍" : "📚"}
          </h1>
          <h2 className="quiz-result-title">Quiz Complete!</h2>
          <p className="quiz-result-score">
            You got <span>{score}</span> out of <span>10</span> correct
          </p>
          <p className="quiz-result-message">
            {score >= 8
              ? "Amazing! You really know your flags!"
              : score >= 5
              ? "Good job! Keep exploring the world!"
              : "Keep practicing — you'll get there!"}
          </p>
          <div className="quiz-result-buttons">
            <button className="quiz-restart-btn" onClick={handleRestart}>
              Play Again
            </button>
            <button className="quiz-home-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="quiz-page">

      {/* Score and progress bar */}
      <div className="quiz-header">
        <div className="quiz-score">
          Score: <span>{score}</span>
        </div>
        <div className="quiz-progress">
          Question <span>{questionCount + 1}</span> of <span>10</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${(questionCount / 10) * 100}%` }}
        />
      </div>

      {/* Flag */}
      <div className="quiz-flag-container">
        <img
          src={currentCountry.flags?.svg || currentCountry.flags?.png}
          alt="Guess this flag"
          className="quiz-flag"
        />
      </div>

      <h2 className="quiz-question">Which country does this flag belong to?</h2>

      {/* Answer options */}
      <div className="quiz-options">
        {options.map((option) => {
          let optionClass = "quiz-option";
          if (selectedAnswer) {
            if (option.cca3 === currentCountry.cca3) {
              optionClass += " correct";
            } else if (option.cca3 === selectedAnswer) {
              optionClass += " wrong";
            }
          }
          return (
            <button
              key={option.cca3}
              className={optionClass}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
            >
              {option.name.common}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selectedAnswer && (
        <p className={`quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-wrong"}`}>
          {isCorrect
            ? "✅ Correct!"
            : `❌ Wrong! It was ${currentCountry.name.common}`}
        </p>
      )}

    </main>
  );
}

export default Quiz;