import { useState } from 'react'
import AgentCard from '../../components/backoffice/AgentCard'
import AgentsFiltres from '../../components/backoffice/AgentsFiltres'
import ConfirmationStatutAgent from '../../components/backoffice/ConfirmationStatutAgent'
import AgentForm from '../../components/forms/AgentForm'
import MotDePasseAgentForm from '../../components/forms/MotDePasseAgentForm'
import Button from '../../components/ui/Button'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useAgents } from '../../hooks/useAgents'
import { useAuth } from '../../hooks/useAuth'

const FILTRES_VIDES = { q: '', role: '', statut: '' }

const ACTIONS = {
  CREATION: 'creation',
  MODIFICATION: 'modification',
  MOT_DE_PASSE: 'motDePasse',
  STATUT: 'statut',
}

// Ne transmet à l'API que les filtres renseignés.
function versParametresApi({ q, role, statut }, page) {
  return {
    page,
    ...(q && { q }),
    ...(role && { role }),
    ...(statut && { actif: statut === 'actif' }),
  }
}

function nomComplet(agent) {
  return `${agent.prenom} ${agent.nom}`
}

function titreModale({ type, agent }) {
  switch (type) {
    case ACTIONS.CREATION:
      return 'Nouveau compte du personnel'
    case ACTIONS.MODIFICATION:
      return `Modifier le compte de ${nomComplet(agent)}`
    case ACTIONS.MOT_DE_PASSE:
      return `Nouveau mot de passe pour ${nomComplet(agent)}`
    default:
      return agent.actif ? 'Désactiver ce compte ?' : 'Réactiver ce compte ?'
  }
}

function ListeAgents({ agents, idConnecte, onAction }) {
  if (agents.length === 0) {
    return <p>Aucun compte ne correspond à votre recherche.</p>
  }

  return (
    <ul className="grille-cartes">
      {agents.map((agent) => (
        <li key={agent.id}>
          <AgentCard
            agent={agent}
            estSoiMeme={agent.id === idConnecte}
            onModifier={() => onAction(ACTIONS.MODIFICATION, agent)}
            onDefinirMotDePasse={() => onAction(ACTIONS.MOT_DE_PASSE, agent)}
            onChangerStatut={() => onAction(ACTIONS.STATUT, agent)}
          />
        </li>
      ))}
    </ul>
  )
}

export default function AgentsPage() {
  const { utilisateur } = useAuth()
  const [filtres, setFiltres] = useState(FILTRES_VIDES)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState(null)
  const [succes, setSucces] = useState(null)
  const { agents, pagination, chargement, erreur, creer, modifier, changerStatut, definirMotDePasse } =
    useAgents(versParametresApi(filtres, page))

  function rechercher(nouveauxFiltres) {
    setFiltres(nouveauxFiltres)
    setPage(1)
  }

  function ouvrirAction(type, agent = null) {
    setSucces(null)
    setAction({ type, agent })
  }

  function terminerAction(message) {
    setAction(null)
    setSucces(message)
  }

  function contenuModale() {
    const { type, agent } = action

    switch (type) {
      case ACTIONS.CREATION:
        return <AgentForm onEnregistrer={creer} onSucces={() => terminerAction('Le compte a été créé.')} />
      case ACTIONS.MODIFICATION:
        return (
          <AgentForm
            agent={agent}
            onEnregistrer={(champs) => modifier(agent.id, champs)}
            onSucces={() => terminerAction(`Le compte de ${nomComplet(agent)} a été modifié.`)}
          />
        )
      case ACTIONS.MOT_DE_PASSE:
        return (
          <MotDePasseAgentForm
            onEnregistrer={(motDePasse) => definirMotDePasse(agent.id, motDePasse)}
            onSucces={() => terminerAction(`Le nouveau mot de passe de ${nomComplet(agent)} est enregistré.`)}
          />
        )
      default:
        return (
          <ConfirmationStatutAgent
            agent={agent}
            onConfirmer={() => changerStatut(agent.id, !agent.actif)}
            onSucces={() =>
              terminerAction(`Le compte de ${nomComplet(agent)} a été ${agent.actif ? 'désactivé' : 'réactivé'}.`)
            }
            onAnnuler={() => setAction(null)}
          />
        )
    }
  }

  return (
    <main>
      <div className="entete-gestion">
        <h1>Comptes du personnel</h1>
        <Button onClick={() => ouvrirAction(ACTIONS.CREATION)}>Créer un compte</Button>
      </div>
      <p>
        Créez les comptes des agents, corrigez leurs informations et désactivez le compte d'un employé qui
        quitte l'agence.
      </p>

      {succes && <SuccessMessage message={succes} />}

      <AgentsFiltres filtres={filtres} onRechercher={rechercher} />

      {chargement && <Loader message="Chargement des comptes…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && (
        <>
          <ListeAgents agents={agents} idConnecte={utilisateur.id} onAction={ouvrirAction} />
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChanger={setPage} />}
        </>
      )}

      {action && (
        <Modal titre={titreModale(action)} onFermer={() => setAction(null)}>
          {contenuModale()}
        </Modal>
      )}
    </main>
  )
}
