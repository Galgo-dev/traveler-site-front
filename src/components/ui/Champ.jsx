import { useId } from 'react'
import './Input.css'

/**
 * Habillage commun des champs de formulaire : libellé, aide et message d'erreur reliés au contrôle.
 * @param {{ label: string, aide?: string, erreur?: string,
 *   children: (attributs: object) => React.ReactNode }} props
 *   children reçoit les attributs à poser sur le contrôle (id, classe, accessibilité)
 */
export default function Champ({ label, aide, erreur, children }) {
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
      {children({
        id,
        className: `champ__input ${erreur ? 'champ__input--erreur' : ''}`.trim(),
        'aria-invalid': erreur ? true : undefined,
        'aria-describedby': descriptions || undefined,
      })}
      {erreur && (
        <p id={idErreur} className="champ__erreur">
          {erreur}
        </p>
      )}
    </div>
  )
}
