import { useState } from 'react'
import Button from './Button'
import ErrorMessage from './ErrorMessage'
import './Confirmation.css'

/**
 * Demande confirmation avant une action, puis affiche l'erreur de l'API si elle échoue.
 * @param {{ message: React.ReactNode, libelleConfirmer: string, variante?: 'primaire'|'danger',
 *   onConfirmer: () => Promise<unknown>, onSucces: () => void, onAnnuler: () => void }} props
 */
export default function Confirmation({
  message,
  libelleConfirmer,
  variante = 'primaire',
  onConfirmer,
  onSucces,
  onAnnuler,
}) {
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function confirmer() {
    setEnvoi(true)
    setErreur(null)
    try {
      await onConfirmer()
      onSucces()
    } catch (erreurAction) {
      setErreur(erreurAction)
      setEnvoi(false)
    }
  }

  return (
    <div>
      {erreur && <ErrorMessage message={erreur.message} />}
      <p>{message}</p>
      <div className="confirmation__actions">
        <Button variante={variante} disabled={envoi} onClick={confirmer}>
          {envoi ? 'Enregistrement…' : libelleConfirmer}
        </Button>
        <Button variante="secondaire" disabled={envoi} onClick={onAnnuler}>
          Annuler
        </Button>
      </div>
    </div>
  )
}
