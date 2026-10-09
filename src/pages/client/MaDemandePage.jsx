import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ResumeDemande from '../../components/demandes/ResumeDemande'
import Button from '../../components/ui/Button'
import Confirmation from '../../components/ui/Confirmation'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useCommandesEligibles } from '../../hooks/useAvis'
import { useDemande } from '../../hooks/useDemandes'
import { ETATS_DEMANDE, ROUTES, routeNouvelAvis } from '../../utils/constants'
import { aujourdhuiIso } from '../../utils/validators'

const STATUT_INTROUVABLE = 404

/** Voyage confirmé dont la date de retour est passée (V3 : notion calculée, pas d'état « Terminée »). */
function VoyageTermine({ demandeId, avisPossible }) {
  return (
    <div className="encadre">
      <p>Votre voyage est terminé. Nous espérons qu'il vous a plu !</p>
      {avisPossible && (
        <Link to={routeNouvelAvis(demandeId)} className="bouton bouton--primaire">
          Donner mon avis
        </Link>
      )}
    </div>
  )
}

/** Ce que le client peut faire selon l'état de sa demande (§6, R11), puis son avis une fois rentré (V3). */
function SuiteDemande({ demande, avisPossible, onAnnuler }) {
  const { etat } = demande
  if (etat === ETATS_DEMANDE.EN_ATTENTE) {
    return (
      <Button variante="danger" onClick={onAnnuler}>
        Annuler ma demande
      </Button>
    )
  }
  if (etat === ETATS_DEMANDE.CONFIRMEE && demande.dateRetour < aujourdhuiIso()) {
    return <VoyageTermine demandeId={demande.id} avisPossible={avisPossible} />
  }
  if (etat === ETATS_DEMANDE.CONFIRMEE) {
    return <p className="encadre">Votre demande est confirmée. Pour l'annuler, téléphonez à l'agence.</p>
  }
  return <p className="encadre">Cette demande a été annulée.</p>
}

export default function MaDemandePage() {
  const { id } = useParams()
  const { demande, chargement, erreur, annuler } = useDemande(id)
  const { commandes } = useCommandesEligibles()
  const avisPossible = commandes.some((commande) => String(commande.id) === id)
  const [confirmationOuverte, setConfirmationOuverte] = useState(false)
  const [succes, setSucces] = useState(null)

  return (
    <main className="conteneur conteneur--etroit">
      <Link className="lien-retour" to={ROUTES.MES_DEMANDES}>
        ← Mes demandes
      </Link>

      {chargement && <Loader message="Chargement de la demande…" />}
      {!chargement && erreur && (
        <ErrorMessage
          message={erreur.status === STATUT_INTROUVABLE ? "Cette demande n'existe pas." : erreur.message}
        />
      )}
      {demande && (
        <>
          <h1>Ma demande pour {demande.destination?.nom}</h1>
          {succes && <SuccessMessage message={succes} />}
          <ResumeDemande demande={demande} />
          <SuiteDemande
            demande={demande}
            avisPossible={avisPossible}
            onAnnuler={() => setConfirmationOuverte(true)}
          />
        </>
      )}

      {confirmationOuverte && (
        <Modal titre="Annuler votre demande ?" onFermer={() => setConfirmationOuverte(false)}>
          <Confirmation
            message="L'annulation est définitive. Pour un autre voyage, vous pourrez faire une nouvelle demande."
            libelleConfirmer="Oui, annuler ma demande"
            variante="danger"
            onConfirmer={() => annuler()}
            onSucces={() => {
              setConfirmationOuverte(false)
              setSucces('Votre demande a été annulée.')
            }}
            onAnnuler={() => setConfirmationOuverte(false)}
          />
        </Modal>
      )}
    </main>
  )
}
