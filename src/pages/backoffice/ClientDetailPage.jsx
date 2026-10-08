import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Confirmation from '../../components/backoffice/Confirmation'
import FavorisClient from '../../components/backoffice/FavorisClient'
import ClientForm from '../../components/forms/ClientForm'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useDossierClient } from '../../hooks/useClients'
import { ROUTES } from '../../utils/constants'
import { formaterDate } from '../../utils/formatters'
import './ClientDetailPage.css'

const ACTIONS = { CORRECTION: 'correction', EFFACEMENT: 'effacement' }

function InfosClient({ client }) {
  return (
    <dl className="liste-infos dossier-client__infos">
      <dt>E-mail</dt>
      <dd>{client.email}</dd>
      <dt>Téléphone</dt>
      <dd>{client.telephone || '—'}</dd>
      <dt>Date de naissance</dt>
      <dd>{client.dateNaissance ? formaterDate(client.dateNaissance) : '—'}</dd>
      {client.createdAt && (
        <>
          <dt>Client depuis le</dt>
          <dd>{formaterDate(client.createdAt)}</dd>
        </>
      )}
    </dl>
  )
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { client, chargement, erreur, favoris, chargementFavoris, erreurFavoris, modifier, effacer } =
    useDossierClient(id)
  const [action, setAction] = useState(null)
  const [succes, setSucces] = useState(null)

  function ouvrirAction(type) {
    setSucces(null)
    setAction(type)
  }

  function retourListe(message) {
    navigate(ROUTES.GESTION_CLIENTS, { replace: true, state: { succes: message } })
  }

  if (chargement && !client) return <Loader message="Chargement du dossier…" />

  if (erreur) {
    return (
      <main>
        <ErrorMessage message={erreur.message} />
        <Link to={ROUTES.GESTION_CLIENTS}>Retour à la liste des clients</Link>
      </main>
    )
  }

  const nomComplet = `${client.prenom} ${client.nom}`

  return (
    <main>
      <p>
        <Link to={ROUTES.GESTION_CLIENTS} className="dossier-client__retour">
          ← Retour à la liste des clients
        </Link>
      </p>
      <h1>Dossier de {nomComplet}</h1>

      {succes && <SuccessMessage message={succes} />}

      <section className="dossier-client__section">
        <h2>Informations personnelles</h2>
        <InfosClient client={client} />
        <div className="dossier-client__actions">
          <Button onClick={() => ouvrirAction(ACTIONS.CORRECTION)}>Corriger les informations</Button>
          <Button variante="danger" onClick={() => ouvrirAction(ACTIONS.EFFACEMENT)}>
            Effacer le compte (RGPD)
          </Button>
        </div>
      </section>

      <section className="dossier-client__section">
        <h2>Favoris</h2>
        <FavorisClient favoris={favoris} chargement={chargementFavoris} erreur={erreurFavoris} />
      </section>

      {action === ACTIONS.CORRECTION && (
        <Modal titre={`Corriger les informations de ${nomComplet}`} onFermer={() => setAction(null)}>
          <ClientForm
            client={client}
            onEnregistrer={modifier}
            onSucces={() => {
              setAction(null)
              setSucces('Les informations du client ont été corrigées.')
            }}
          />
        </Modal>
      )}

      {action === ACTIONS.EFFACEMENT && (
        <Modal titre="Effacer ce compte client ?" onFermer={() => setAction(null)}>
          <Confirmation
            message={`À faire uniquement à la demande de ${nomComplet}. Son compte, ses données personnelles et ses favoris seront effacés définitivement. Cette action est irréversible.`}
            libelleConfirmer="Oui, effacer définitivement"
            variante="danger"
            onConfirmer={effacer}
            onSucces={() => retourListe(`Le compte de ${nomComplet} a été effacé.`)}
            onAnnuler={() => setAction(null)}
          />
        </Modal>
      )}
    </main>
  )
}
