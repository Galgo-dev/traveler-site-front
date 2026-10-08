import './ErrorMessage.css'

export default function ErrorMessage({ message }) {
  return (
    <p className="message-erreur" role="alert">
      {message}
    </p>
  )
}
