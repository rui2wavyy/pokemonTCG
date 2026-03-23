import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.pokemontcg.io/v2',
  }),
  endpoints: (builder) => ({
    getRandomCards: builder.query({
      query: (limit = 100) => {
        // Get random cards with HP data - optimized query
        const randomPage = Math.floor(Math.random() * 30)
        return `/cards?q=hp:[* TO *]&pageSize=${limit}&page=${randomPage}&select=id,name,hp,images`
      },
      transformResponse: (response) => {
        // Validate response structure
        if (!response || !response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid API response: no card data returned')
        }

        // Filter and transform only essential data - use small images for speed
        const cards = response.data
          .filter((card) => card.hp && card.images?.small)
          .map((card) => ({
            id: card.id,
            name: card.name,
            hp: parseInt(card.hp) || 0,
            image: card.images.small, // Use small images for faster loading
            largImage: card.images.large, // Store large image for later lazy load
          }))

        if (cards.length === 0) {
          throw new Error('No valid Pokémon cards found. Please try again.')
        }

        return cards
      },
      // Aggressive caching - keep data for 30 minutes (1800 seconds)
      keepUnusedDataFor: 1800,
    }),
  }),
})

export const { useGetRandomCardsQuery, useGetPreloadedCardsQuery, util: { prefetchGetRandomCards, prefetchGetPreloadedCards } } = pokemonApi
