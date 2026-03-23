import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './gameSlice'
import { pokemonApi } from './pokemonApi'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore errors from non-serializable actions
        ignoredActions: ['pokemonApi/executeQuery/fulfilled'],
        ignoredPaths: [pokemonApi.reducerPath],
      },
      // Optimize middleware performance
      immutableCheck: {
        warnAfter: 10000, // Only warn if it takes longer than 10s
      },
    }).concat(pokemonApi.middleware),
})

