import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.pokemontcg.io/v2',
  }),
  endpoints: (builder) => ({
    getRandomCards: builder.query({
      query: (limit = 100) => {
        // Simple, reliable query - just get a random page of cards
        // The API will return various cards; we filter for those with HP client-side
        const randomPage = Math.floor(Math.random() * 50)
        return `/cards?pageSize=${limit}&page=${randomPage}`
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
            name: card.name || 'Unknown Card',
            hp: parseInt(card.hp) || 50,
            image: card.images.small, // Use small images for faster loading
            largeImage: card.images.large, // Store large image for later lazy load
          }))
          .sort(() => Math.random() - 0.5) // Randomize order on client

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

export const { useGetRandomCardsQuery } = pokemonApi
