import { useState } from 'react'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import './ConfirmationStatutAgent.css'

/**
 * Demande confirmation avant de désactiver ou de réactiver un compte du personnel.
 * @param {{ agent: object, onConfirmer: () => Promise<unknown>, onSucces: () => void, onAnnuler: () => void }} props
 */
export default function ConfirmationStatutAgent({ agent, onConfirmer, onSucces, onAnnuler }) {
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState(null)
  const nomComplet = `${agent.prenom} ${agent.nom}`

  async function confirmer() {
    setEnvoi(true)
    setErreur(null)
    try {
      await onConfirmer()
      onSucces()
    } catch (erreurStatut) {
      setErreur(erreurStatut)
      setEnvoi(false)
    }
  }

  return (
    <div>
      {erreur && <ErrorMessage message={erreur.message} />}
      <p>
        {agent.actif
          ? `${nomComplet} ne pourra plus se connecter. Son compte reste conservé et pourra être réactivé.`
          : `${nomComplet} pourra de nouveau se connecter avec son mot de passe actuel.`}
      </p>
      <div className="confirmation__actions">
        <Button variante={agent.actif ? 'danger' : 'primaire'} disabled={envoi} onClick={confirmer}>
          {envoi ? 'Enregistrement…' : agent.actif ? 'Oui, désactiver' : 'Oui, réactiver'}
        </Button>
        <Button variante="secondaire" disabled={envoi} onClick={onAnnuler}>
          Annuler
        </Button>
      </div>
    </div>
  )
}
