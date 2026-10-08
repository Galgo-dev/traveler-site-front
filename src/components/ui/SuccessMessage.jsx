import './SuccessMessage.css'

export default function SuccessMessage({ message }) {
  return (
    <p className="message-succes" role="status">
      {message}
    </p>
  )
}
