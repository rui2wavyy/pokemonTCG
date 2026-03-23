import './GuessButtons.css'

export function GuessButtons({ onHigher, onLower, disabled = false, loading = false }) {
  return (
    <div className="guess-buttons">
      <button
        className="guess-btn guess-lower"
        onClick={onLower}
        disabled={disabled || loading}
      >
        <span className="btn-icon">⬇️</span>
        <span className="btn-text">LOWER HP</span>
      </button>
      <button
        className="guess-btn guess-higher"
        onClick={onHigher}
        disabled={disabled || loading}
      >
        <span className="btn-icon">⬆️</span>
        <span className="btn-text">HIGHER HP</span>
      </button>
    </div>
  )
}
