import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  score: 0,
  streak: 0,
  totalGuesses: 0,
  currentCard: null,
  nextCard: null,
  gameStarted: false,
  lastPrediction: null,
  lastResult: null,
  cardHistory: [],
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload
    },
    setNextCard: (state, action) => {
      state.nextCard = action.payload
    },
    startGame: (state) => {
      state.gameStarted = true
      state.score = 0
      state.streak = 0
      state.totalGuesses = 0
      state.cardHistory = []
    },
    endGame: (state) => {
      state.gameStarted = false
    },
    makeGuess: (state, action) => {
      const { prediction, result } = action.payload
      state.lastPrediction = prediction
      state.lastResult = result
      state.totalGuesses += 1

      if (result) {
        state.score += 10 + (state.streak * 2)
        state.streak += 1
      } else {
        state.streak = 0
      }
    },
    advanceCard: (state) => {
      if (state.nextCard) {
        if (state.currentCard) {
          state.cardHistory.push(state.currentCard)
        }
        state.currentCard = state.nextCard
        state.nextCard = null
      }
    },
    resetGame: () => {
      return initialState
    },
  },
})

export const {
  setCurrentCard,
  setNextCard,
  startGame,
  endGame,
  makeGuess,
  advanceCard,
  resetGame,
} = gameSlice.actions

export default gameSlice.reducer
