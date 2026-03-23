import { useState, useEffect } from 'react'
import './PokemonCard.css'

export function PokemonCard({ card, label = '', isFlipped = false }) {
  const [displayImage, setDisplayImage] = useState(null)

  // Image lazy loading: display small first, preload large in background
  useEffect(() => {
    if (!card?.image) return

    let isMounted = true

    // Immediately display small image for fast initial render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayImage(card.image)

    // Preload large image in background
    if (card.largImage) {
      const img = new Image()
      img.onload = () => {
        if (isMounted) {
          setDisplayImage(card.largImage)
        }
      }
      img.onerror = () => {
        // Fallback to small image if large fails
        if (isMounted) {
          setDisplayImage(card.image)
        }
      }
      img.src = card.largImage
    }

    return () => {
      isMounted = false
    }
  }, [card?.id, card?.image, card?.largImage])

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
      <div className={`pokemon-card ${isFlipped ? 'flipped' : ''}`}>
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
            <p className="card-hp">HP: {card.hp}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
