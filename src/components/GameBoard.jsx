import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetRandomCardsQuery } from '../redux/pokemonApi'
import {
  setCurrentCard,
  setNextCard,
  makeGuess,
  advanceCard,
  startGame,
  resetGame,
} from '../redux/gameSlice'
import { PokemonCard } from './PokemonCard'
import { ScoreDisplay } from './ScoreDisplay'
import { GuessButtons } from './GuessButtons'
import { ResultMessage } from './ResultMessage'
import { GameStart } from './GameStart'
import './GameBoard.css'

export function GameBoard() {
  const dispatch = useDispatch()
  const { gameStarted, score, streak, totalGuesses, currentCard, nextCard } = useSelector(
    (state) => state.game
  )

  // Fetch cards with error handling
  const { data: cardsResponse, isLoading, error: apiError } = useGetRandomCardsQuery(100)

  const [cards, setCards] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [showResult, setShowResult] = useState(null)
  const [result, setResult] = useState(null)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [lastPrediction, setLastPrediction] = useState(null)
  const [gameError, setGameError] = useState(null)

  // Initialize cards when data arrives
  useEffect(() => {
    if (cardsResponse && cardsResponse.length > 0) {
      setCards(cardsResponse)
      setGameError(null)
    }
  }, [cardsResponse])

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      setGameError('Failed to load Pokémon cards. Please try again.')
      console.error('API Error:', apiError)
    }
  }, [apiError])

  // Initialize game when cards are loaded and game is started
  useEffect(() => {
    if (gameStarted && cards.length > 0 && !currentCard) {
      loadNextCards()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, cards])

  const loadNextCards = useCallback(() => {
    setCards((prevCards) => {
      if (!prevCards || prevCards.length === 0) {
        setGameError('No cards available')
        return prevCards
      }

      const nextIndex = cardIndex + 1
      if (nextIndex < prevCards.length) {
        dispatch(setCurrentCard(prevCards[cardIndex]))
        dispatch(setNextCard(prevCards[nextIndex]))
        setShowResult(null)
        setResult(null)
        setCardIndex(nextIndex)
      } else {
        // Rotate cards when we reach the end
        const rotatedCards = [...prevCards].sort(() => Math.random() - 0.5)
        setCardIndex(0)
        dispatch(setCurrentCard(rotatedCards[0]))
        if (rotatedCards.length > 1) {
          dispatch(setNextCard(rotatedCards[1]))
        }
        return rotatedCards
      }
      return prevCards
    })
  }, [cardIndex, dispatch])

  const handleGuess = (prediction) => {
    if (!nextCard || !currentCard) return

    const correct =
      (prediction === 'higher' && nextCard.hp > currentCard.hp) ||
      (prediction === 'lower' && nextCard.hp < currentCard.hp)

    const pts = correct ? 10 + streak * 2 : 0

    dispatch(makeGuess({ prediction, result: correct }))
    setResult(correct)
    setShowResult(correct)
    setPointsEarned(pts)
    setLastPrediction(prediction)

    // Auto advance after 2 seconds
    const timer = setTimeout(() => {
      dispatch(advanceCard())
      loadNextCards()
    }, 2000)

    return () => clearTimeout(timer)
  }

  const handleStartGame = () => {
    if (cards.length === 0) {
      setGameError('Waiting for cards to load...')
      return
    }
    setGameError(null)
    dispatch(startGame())
  }

  const handleGameOver = () => {
    dispatch(resetGame())
    setShowResult(null)
    setResult(null)
    setCardIndex(0)
    setGameError(null)
  }

  // Show start screen if not started
  if (!gameStarted) {
    return <GameStart onStart={handleStartGame} isLoading={isLoading} error={gameError} />
  }

  // Show error if API failed
  if (gameError) {
    return (
      <div className="game-error">
        <div className="error-content">
          <h2>⚠️ {gameError}</h2>
          <button className="retry-button" onClick={handleGameOver}>
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  // Show loading while cards are being fetched
  if (isLoading || cards.length === 0) {
    return (
      <div className="game-board">
        <div className="game-container">
          <div className="loading-state">
            <div className="poke-ball-spinner"></div>
            <h2>Loading Pokémon cards...</h2>
            <p>Getting ready for an epic battle!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-board">
      <ResultMessage
        result={result}
        prediction={lastPrediction}
        currentHP={currentCard?.hp}
        nextHP={nextCard?.hp}
        pointsEarned={pointsEarned}
      />

      <div className="game-container">
        <h1 className="game-header">🎴 Pokémon HP Predictor</h1>

        <ScoreDisplay score={score} streak={streak} totalGuesses={totalGuesses} />

        <div className="cards-section">
          <div className="current-card-wrapper">
            <PokemonCard card={currentCard} label="Current Card" />
          </div>

          <div className="vs-separator">VS</div>

          <div className="next-card-wrapper">
            <PokemonCard card={nextCard} label="Next Card" isFlipped={!showResult} />
          </div>
        </div>

        <div className="game-instructions">
          <p>Will the next card have <strong>higher</strong> or <strong>lower</strong> HP?</p>
        </div>

        <GuessButtons
          onHigher={() => handleGuess('higher')}
          onLower={() => handleGuess('lower')}
          disabled={!!showResult}
          loading={false}
        />

        <button className="quit-button" onClick={handleGameOver}>
          Quit Game
        </button>
      </div>
    </div>
  )
}
