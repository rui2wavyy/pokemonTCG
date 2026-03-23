import './GameStart.css'

export function GameStart({ onStart, isLoading = false, error = null }) {
  return (
    <div className="game-start">
      <div className="start-content">
        <h1 className="game-title">🎴 Pokémon HP Predictor</h1>
        <p className="game-subtitle">Guess if the next Pokémon's HP will be higher or lower!</p>

        <div className="game-rules">
          <h2>How to Play</h2>
          <ul>
            <li>Look at the current Pokémon's HP</li>
            <li>Predict if the next Pokémon will have HIGHER or LOWER HP</li>
            <li>Correct guesses earn points + streak bonus</li>
            <li>Wrong guess resets your streak</li>
            <li>Keep going to build up your score!</li>
          </ul>
        </div>

        <div className="start-stats">
          <p>Base Points: <strong>10</strong></p>
          <p>Streak Bonus: <strong>+2 per streak</strong></p>
        </div>

        {error && <div style={{ color: '#dc2626', fontSize: '0.95rem', marginBottom: '16px' }}>⚠️ {error}</div>}

        <button 
          className="start-button" 
          onClick={onStart}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Start Game'}
        </button>
      </div>
    </div>
  )
}
