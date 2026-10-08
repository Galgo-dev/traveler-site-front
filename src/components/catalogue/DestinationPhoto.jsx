import './DestinationPhoto.css'

export default function DestinationPhoto({ nom, photoUrl, className = '' }) {
  if (!photoUrl) {
    return (
      <div className={`destination-photo destination-photo--absente ${className}`} aria-hidden="true">
        ✈
      </div>
    )
  }

  return (
    <img
      className={`destination-photo ${className}`}
      src={photoUrl}
      alt={`Vue de ${nom}`}
      loading="lazy"
    />
  )
}
