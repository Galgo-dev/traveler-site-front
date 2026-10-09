import './WarningMessage.css'

/** Avertissement non bloquant : l'utilisateur peut poursuivre en connaissance de cause. */
export default function WarningMessage({ message }) {
  return (
    <p className="message-avertissement" role="status">
      <span aria-hidden="true">⚠ </span>
      {message}
    </p>
  )
}
