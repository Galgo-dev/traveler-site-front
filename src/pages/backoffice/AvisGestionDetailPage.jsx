import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EtatAvis from '../../components/avis/EtatAvis'
import NoteEtoiles from '../../components/avis/NoteEtoiles'
import CoordonneesClient from '../../components/backoffice/CoordonneesClient'
import HistoriqueEtats from '../../components/backoffice/HistoriqueEtats'
import MotifModerationForm from '../../components/forms/MotifModerationForm'
import ReponseAvisForm from '../../components/forms/ReponseAvisForm'
import Button from '../../components/ui/Button'
import Confirmation from '../../components/ui/Confirmation'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import SuccessMessage from '../../components/ui/SuccessMessage'
import WarningMessage from '../../components/ui/WarningMessage'
import { useModerationAvis } from '../../hooks/useAvis'
import { ETATS_AVIS, LIBELLES_ETAT_AVIS, ROUTES, routeGestionDemande } from '../../utils/constants'
import { formaterDate, formaterDateHeure, formaterVoyageurs } from '../../utils/formatters'
import './AvisGestionDetailPage.css'

const ACTIONS = { VALIDATION: 'validation', REFUS: 'refus', MASQUAGE: 'masquage' }
const STATUT_INTROUVABLE = 404

/** Actions de modération possibles selon l'état (§6) : un avis refusé n'en a plus. */
function ActionsModeration({ etat, onAction }) {
  if (etat === ETATS_AVIS.EN_ATTENTE) {
    return (
      <div className="actions">
        <Button onClick={() => onAction(ACTIONS.VALIDATION)}>Publier l'avis</Button>
        <Button variante="danger" onClick={() => onAction(ACTIONS.REFUS)}>
          Refuser l'avis
        </Button>
      </div>
    )
  }
  if (etat === ETATS_AVIS.PUBLIE) {
    return (
      <div className="actions">
        <Button variante="danger" onClick={() => onAction(ACTIONS.MASQUAGE)}>
          Masquer l'avis
        </Button>
      </div>
    )
  }
  return null
}

/** Texte du client, tel qu'il l'a écrit : le personnel ne le modifie jamais (R13). */
function ContenuAvis({ avis }) {
  return (
    <section className="avis-gestion__bloc" aria-labelledby="titre-avis">
      <div className="avis-gestion__entete">
        <NoteEtoiles note={avis.note} />
        <EtatAvis etat={avis.etat} />
      </div>
      <h2 id="titre-avis" className="avis-gestion__titre">
        {avis.titre}
      </h2>
      <p className="avis-gestion__texte">{avis.commentaire || 'Pas de commentaire.'}</p>

      <dl className="liste-infos">
        <div>
          <dt>Signature publique</dt>
          <dd>{avis.auteurPublic}</dd>
        </div>
        <div>
          <dt>Déposé le</dt>
          <dd>{formaterDateHeure(avis.createdAt)}</dd>
        </div>
        {avis.publieLe && (
          <div>
            <dt>Publié le</dt>
            <dd>{formaterDateHeure(avis.publieLe)}</dd>
          </div>
        )}
        <div>
          <dt>Modifiable par le client jusqu'au</dt>
          <dd>{formaterDate(avis.modifiableParLeClientJusquau)}</dd>
        </div>
      </dl>

      {avis.notesActivites.length > 0 && (
        <>
          <h3>Notes des activités</h3>
          <ul className="avis-gestion__notes">
            {avis.notesActivites.map((noteActivite) => (
              <li key={noteActivite.activiteId}>
                {noteActivite.nom ?? 'Activité supprimée'} : <NoteEtoiles note={noteActivite.note} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function CommandeLiee({ demande }) {
  if (!demande) return <p>La commande liée n'existe plus.</p>

  return (
    <dl className="liste-infos">
      <div>
        <dt>Commande</dt>
        <dd>
          <Link to={routeGestionDemande(demande.id)}>Demande n° {demande.id}</Link>
        </dd>
      </div>
      <div>
        <dt>Séjour</dt>
        <dd>
          Du {formaterDate(demande.dateDepart)} au {formaterDate(demande.dateRetour)}
        </dd>
      </div>
      {demande.nbAdultes != null && (
        <div>
          <dt>Voyageurs</dt>
          <dd>{formaterVoyageurs(demande.nbAdultes, demande.nbEnfants)}</dd>
        </div>
      )}
    </dl>
  )
}

/** Réponse unique de l'agence (R14), seulement sur un avis publié (P6). */
function ReponseAgence({ avis, onRepondre, onSucces }) {
  const { reponse, etat } = avis

  return (
    <section className="avis-gestion__bloc" aria-labelledby="titre-reponse">
      <h2 id="titre-reponse">Réponse de l'agence</h2>
      {reponse && (
        <p className="champ__aide">
          Dernière modification le {formaterDateHeure(reponse.modifieeLe)}
          {reponse.agent && `, signée ${reponse.agent}`}.
        </p>
      )}
      {etat === ETATS_AVIS.PUBLIE && (
        // La clé recrée le formulaire quand la réponse enregistrée change.
        <ReponseAvisForm
          key={reponse?.modifieeLe ?? 'nouvelle'}
          texteInitial={reponse?.texte}
          onEnregistrer={onRepondre}
          onSucces={onSucces}
        />
      )}
      {etat !== ETATS_AVIS.PUBLIE && reponse && (
        <>
          <p className="avis-gestion__texte">{reponse.texte}</p>
          <p className="encadre">Cette réponse est conservée, mais masquée tant que l'avis n'est pas publié.</p>
        </>
      )}
      {etat !== ETATS_AVIS.PUBLIE && !reponse && <p>Vous pourrez répondre une fois l'avis publié.</p>}
    </section>
  )
}

export default function AvisGestionDetailPage() {
  const { id } = useParams()
  const { avis, chargement, erreur, valider, refuser, masquer, repondre } = useModerationAvis(id)
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

  // R18 : une destination ou un pays masqué cache ses avis au public.
  const destinationMasquee = avis && (!avis.destination?.actif || !avis.destination?.pays?.actif)

  return (
    <main>
      <Link className="lien-retour" to={ROUTES.GESTION_AVIS}>
        ← Avis clients
      </Link>

      {chargement && <Loader message="Chargement de l'avis…" />}
      {!chargement && erreur && (
        <ErrorMessage message={erreur.status === STATUT_INTROUVABLE ? "Cet avis n'existe pas." : erreur.message} />
      )}
      {avis && (
        <>
          <h1>
            Avis n° {avis.id} — {avis.destination?.nom}
          </h1>
          {succes && <SuccessMessage message={succes} />}
          {destinationMasquee && (
            <WarningMessage message="Cette destination est masquée : ses avis restent invisibles du public jusqu'à sa réactivation." />
          )}
          <ActionsModeration etat={avis.etat} onAction={ouvrir} />

          {avis.etat === ETATS_AVIS.REFUSE && avis.motifRefus && (
            <section className="avis-gestion__bloc" aria-labelledby="titre-motif">
              <h2 id="titre-motif">Motif du refus (visible par le client)</h2>
              <p className="avis-gestion__texte">{avis.motifRefus}</p>
            </section>
          )}

          <ContenuAvis avis={avis} />

          <section className="avis-gestion__bloc" aria-labelledby="titre-client">
            <h2 id="titre-client">Client{avis.anonyme && ' (anonyme pour le public)'}</h2>
            {/* R17 : le personnel voit toujours le vrai client ; R19 : anonymisé si le compte a été supprimé. */}
            <CoordonneesClient
              client={avis.client}
              messageAnonymise="Compte supprimé à la demande du client : cet avis est anonymisé."
            />
          </section>

          <section className="avis-gestion__bloc" aria-labelledby="titre-commande">
            <h2 id="titre-commande">Voyage</h2>
            <CommandeLiee demande={avis.demande} />
          </section>

          <ReponseAgence avis={avis} onRepondre={repondre} onSucces={() => setSucces('La réponse a été enregistrée.')} />

          <section className="avis-gestion__bloc" aria-labelledby="titre-historique">
            <h2 id="titre-historique">Historique</h2>
            <HistoriqueEtats
              historique={avis.historique ?? []}
              libelles={LIBELLES_ETAT_AVIS}
              libelleCreation="Avis déposé"
            />
          </section>
        </>
      )}

      {action === ACTIONS.VALIDATION && (
        <Modal titre="Publier cet avis ?" onFermer={() => setAction(null)}>
          <Confirmation
            message="L'avis sera visible par tous sur la fiche de la destination et comptera dans sa note moyenne."
            libelleConfirmer="Oui, publier"
            onConfirmer={() => valider()}
            onSucces={() => terminer("L'avis est publié.")}
            onAnnuler={() => setAction(null)}
          />
        </Modal>
      )}

      {action === ACTIONS.REFUS && (
        <Modal titre="Refuser cet avis" onFermer={() => setAction(null)}>
          <MotifModerationForm
            explication="L'avis ne sera pas publié. Le client verra le motif et pourra corriger son avis s'il est encore dans le délai de 30 jours."
            libelleBouton="Refuser l'avis"
            onEnregistrer={refuser}
            onSucces={() => terminer("L'avis a été refusé.")}
          />
        </Modal>
      )}

      {action === ACTIONS.MASQUAGE && (
        <Modal titre="Masquer cet avis" onFermer={() => setAction(null)}>
          <MotifModerationForm
            explication="L'avis disparaîtra de la fiche de la destination et passera à l'état « Refusé ». Le client verra le motif."
            libelleBouton="Masquer l'avis"
            onEnregistrer={masquer}
            onSucces={() => terminer("L'avis est masqué.")}
          />
        </Modal>
      )}
    </main>
  )
}
