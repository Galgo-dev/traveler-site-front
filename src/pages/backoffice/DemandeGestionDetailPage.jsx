import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import HistoriqueDemande from '../../components/backoffice/HistoriqueDemande'
import ResumeDemande from '../../components/demandes/ResumeDemande'
import AnnulationDemandeForm from '../../components/forms/AnnulationDemandeForm'
import Button from '../../components/ui/Button'
import Confirmation from '../../components/ui/Confirmation'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useDemande } from '../../hooks/useDemandes'
import { ETATS_DEMANDE, ROUTES, routeClientDetail } from '../../utils/constants'
import './DemandeGestionDetailPage.css'

const ACTIONS = { CONFIRMATION: 'confirmation', ANNULATION: 'annulation' }
const STATUT_INTROUVABLE = 404

/** Coordonnées du client pour le rappeler (§7), ou mention d'anonymisation si son compte a été supprimé (§8). */
function CoordonneesClient({ client }) {
  if (!client) {
    return <p>Compte supprimé à la demande du client : cette demande est anonymisée.</p>
  }

  return (
    <dl className="liste-infos">
      <div>
        <dt>Nom</dt>
        <dd>
          <Link to={routeClientDetail(client.id)}>
            {client.prenom} {client.nom}
          </Link>
        </dd>
      </div>
      <div>
        <dt>Téléphone</dt>
        <dd>{client.telephone ? <a href={`tel:${client.telephone.replace(/\s/g, '')}`}>{client.telephone}</a> : '—'}</dd>
      </div>
      <div>
        <dt>E-mail</dt>
        <dd>
          <a href={`mailto:${client.email}`}>{client.email}</a>
        </dd>
      </div>
    </dl>
  )
}

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
            <CoordonneesClient client={demande.client} />
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
            <HistoriqueDemande historique={demande.historique ?? []} />
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
