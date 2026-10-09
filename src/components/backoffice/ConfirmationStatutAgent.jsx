import Confirmation from '../ui/Confirmation'

/**
 * Demande confirmation avant de désactiver ou de réactiver un compte du personnel.
 * @param {{ agent: object, onConfirmer: () => Promise<unknown>, onSucces: () => void, onAnnuler: () => void }} props
 */
export default function ConfirmationStatutAgent({ agent, ...actions }) {
  const nomComplet = `${agent.prenom} ${agent.nom}`

  return (
    <Confirmation
      message={
        agent.actif
          ? `${nomComplet} ne pourra plus se connecter. Son compte reste conservé et pourra être réactivé.`
          : `${nomComplet} pourra de nouveau se connecter avec son mot de passe actuel.`
      }
      libelleConfirmer={agent.actif ? 'Oui, désactiver' : 'Oui, réactiver'}
      variante={agent.actif ? 'danger' : 'primaire'}
      {...actions}
    />
  )
}
