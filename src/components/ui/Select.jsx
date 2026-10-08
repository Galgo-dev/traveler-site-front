import { useId } from 'react'
import './Input.css'

/**
 * Liste déroulante avec libellé, aide et message d'erreur (même présentation que Input).
 * @param {{ label: string, options: { valeur: string, libelle: string }[], aide?: string, erreur?: string }} props
 */
export default function Select({ label, options, aide, erreur, ...props }) {
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
      <select
        id={id}
        className={`champ__input ${erreur ? 'champ__input--erreur' : ''}`.trim()}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={descriptions || undefined}
        {...props}
      >
        {options.map(({ valeur, libelle }) => (
          <option key={valeur} value={valeur}>
            {libelle}
          </option>
        ))}
      </select>
      {erreur && (
        <p id={idErreur} className="champ__erreur">
          {erreur}
        </p>
      )}
    </div>
  )
}
