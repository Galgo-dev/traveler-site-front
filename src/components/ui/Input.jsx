import { useId } from 'react'
import './Input.css'

export default function Input({ label, aide, erreur, ...props }) {
  const id = useId()
  const idAide = `${id}-aide`
  const idErreur = `${id}-erreur`
  const descriptions = [aide && idAide, erreur && idErreur].filter(Boolean).join(' ')

  return (
    <div className="champ">
      <label className="champ__label" htmlFor={id}>
        {label}
      </label>
      {aide && (
        <p id={idAide} className="champ__aide">
          {aide}
        </p>
      )}
      <input
        id={id}
        className={`champ__input ${erreur ? 'champ__input--erreur' : ''}`.trim()}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={descriptions || undefined}
        {...props}
      />
      {erreur && (
        <p id={idErreur} className="champ__erreur">
          {erreur}
        </p>
      )}
    </div>
  )
}
