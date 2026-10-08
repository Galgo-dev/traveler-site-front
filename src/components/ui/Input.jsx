import { useId } from 'react'
import './Input.css'

export default function Input({ label, ...props }) {
  const id = useId()

  return (
    <div className="champ">
      <label className="champ__label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="champ__input" {...props} />
    </div>
  )
}
