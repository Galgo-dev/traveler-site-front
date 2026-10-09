import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CoordonneesClient from '../../components/backoffice/CoordonneesClient'
import HistoriqueEtats from '../../components/backoffice/HistoriqueEtats'
import ResumeDemande from '../../components/demandes/ResumeDemande'
import AnnulationDemandeForm from '../../components/forms/AnnulationDemandeForm'
import Button from '../../components/ui/Button'
import Confirmation from '../../components/ui/Confirmation'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useDemande } from '../../hooks/useDemandes'
import { ETATS_DEMANDE, LIBELLES_ETAT_DEMANDE, ROUTES } from '../../utils/constants'
import './DemandeGestionDetailPage.css'

const ACTIONS = { CONFIRMATION: 'confirmation', ANNULATION: 'annulation' }
const STATUT_INTROUVABLE = 404

function ActionsDemande({ etat, onAction }) {
  if (etat === ETATS_DEMANDE.ANNULEE) return null

  return (
    <div className="actions">
      {etat === ETATS_DEMANDE.EN_ATTENTE && (
        <Button onClick={() => onAction(ACTIONS.CONFIRMATION)}>Confirmer la demande</Button>
      )}
      <Button variante="danger" onClick={() => onAction(ACTIONS.ANNULATION)}>
        Annuler la demande
      </Button>
    </div>
  )
}

export default function DemandeGestionDetailPage() {
  const { id } = useParams()
  const { demande, chargement, erreur, confirmer, annuler } = useDemande(id)
  const [action, setAction] = useState(null)
  const [succes, setSucces] = useState(null)

  function ouvrir(type) {
    setSucces(null)
    setAction(type)
  }

  function terminer(message) {
    setAction(null)
    setSucces(message)
  }

  return (
    <main>
      <Link className="lien-retour" to={ROUTES.GESTION_DEMANDES}>
        ← Toutes les demandes
      </Link>

      {chargement && <Loader message="Chargement de la demande…" />}
      {!chargement && erreur && (
        <ErrorMessage
          message={erreur.status === STATUT_INTROUVABLE ? "Cette demande n'existe pas." : erreur.message}
        />
      )}
      {demande && (
        <>
          <h1>
            Demande n° {demande.id} — {demande.destination?.nom}
          </h1>
          {succes && <SuccessMessage message={succes} />}
          <ActionsDemande etat={demande.etat} onAction={ouvrir} />

          <section className="demande-gestion__bloc" aria-labelledby="titre-client">
            <h2 id="titre-client">Client</h2>
            {/* Coordonnées pour rappeler le client (§7) ; anonymisation si son compte a été supprimé (§8). */}
            <CoordonneesClient
              client={demande.client}
              messageAnonymise="Compte supprimé à la demande du client : cette demande est anonymisée."
            />
          </section>

          {demande.etat === ETATS_DEMANDE.ANNULEE && demande.motifAnnulation && (
            <section className="demande-gestion__bloc" aria-labelledby="titre-motif">
              <h2 id="titre-motif">Motif de l'annulation</h2>
              <p className="demande-gestion__motif">{demande.motifAnnulation}</p>
            </section>
          )}

          <ResumeDemande demande={demande} />

          <section className="demande-gestion__bloc" aria-labelledby="titre-historique">
            <h2 id="titre-historique">Historique</h2>
            <HistoriqueEtats
              historique={demande.historique ?? []}
              libelles={LIBELLES_ETAT_DEMANDE}
              libelleCreation="Demande créée"
            />
          </section>
        </>
      )}

      {action === ACTIONS.CONFIRMATION && (
        <Modal titre="Confirmer cette demande ?" onFermer={() => setAction(null)}>
          <Confirmation
            message="Le client verra sa demande comme confirmée. Il ne pourra plus l'annuler lui-même."
            libelleConfirmer="Oui, confirmer"
            onConfirmer={confirmer}
            onSucces={() => terminer('La demande a été confirmée.')}
            onAnnuler={() => setAction(null)}
          />
        </Modal>
      )}

      {action === ACTIONS.ANNULATION && (
        <Modal titre="Annuler cette demande" onFermer={() => setAction(null)}>
          <AnnulationDemandeForm onEnregistrer={annuler} onSucces={() => terminer('La demande a été annulée.')} />
        </Modal>
      )}
    </main>
  )
}
