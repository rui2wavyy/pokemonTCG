import './ScoreDisplay.css'

export function ScoreDisplay({ score, streak, totalGuesses }) {
  return (
    <div className="score-display">
      <div className="score-item">
        <span className="score-label">Score</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Streak</span>
        <span className="score-value streak">{streak}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Guesses</span>
        <span className="score-value">{totalGuesses}</span>
      </div>
    </div>
  )
}
