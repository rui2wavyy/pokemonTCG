import { useState, useEffect } from 'react'
import './PokemonCard.css'

export function PokemonCard({ card, label = '', isRevealed = true, isPlayerCard = false }) {
  const [displayImage, setDisplayImage] = useState(null)

  // Image lazy loading: display small first, preload large in background
  useEffect(() => {
    if (!card?.image) return

    let isMounted = true

    // Immediately display small image for fast initial render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayImage(card.image)

    // Preload large image in background
    if (card.largeImage) {
      const img = new Image()
      img.onload = () => {
        if (isMounted) {
          setDisplayImage(card.largeImage)
        }
      }
      img.onerror = () => {
        // Fallback to small image if large fails
        if (isMounted) {
          setDisplayImage(card.image)
        }
      }
      img.src = card.largeImage
    }

    return () => {
      isMounted = false
    }
  }, [card?.id, card?.image, card?.largeImage])

  // Show placeholder if card is not yet loaded
  if (!card) {
    return (
      <div className="pokemon-card-container">
        {label && <p className="card-label">{label}</p>}
        <div className="pokemon-card loading-card">
          <div className="card-inner">
            <div className="card-image placeholder">
              <div className="poke-ball-mini"></div>
            </div>
            <div className="card-info">
              <h3>Loading...</h3>
              <p className="card-hp">-- HP</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pokemon-card-container">
      {label && <p className="card-label">{label}</p>}
      <div className={`pokemon-card ${isPlayerCard ? 'player-card' : 'enemy-card'}`}>
        <div className="card-inner">
          {displayImage && (
            <img 
              src={displayImage} 
              alt={card.name} 
              className="card-image"
              loading="lazy"
            />
          )}
          <div className="card-info">
            <h3>{card.name}</h3>
            {isRevealed ? (
              <p className="card-hp">HP: {card.hp}</p>
            ) : (
              <p className="card-hp card-hp-hidden">[?????]</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
