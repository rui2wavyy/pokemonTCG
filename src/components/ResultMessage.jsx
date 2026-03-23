import './ResultMessage.css'

export function ResultMessage({ result, prediction, currentHP, nextHP, pointsEarned }) {
  if (result === null) return null

  const isCorrect = result
  const message = isCorrect ? '✅ Correct!' : '❌ Wrong!'
  const hpComparison =
    nextHP > currentHP
      ? `${currentHP} → ${nextHP} (Higher)`
      : `${currentHP} → ${nextHP} (Lower)`

  return (
    <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="result-content">
        <h3>{message}</h3>
        <p className="result-detail">You guessed: <strong>{prediction}</strong></p>
        <p className="result-hp">HP Changed: <strong>{hpComparison}</strong></p>
        {isCorrect && <p className="points-earned">+{pointsEarned} points!</p>}
      </div>
    </div>
  )
}
