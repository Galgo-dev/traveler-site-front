import { useState } from 'react'
import ChangementMotDePasseForm from '../../components/forms/ChangementMotDePasseForm'
import ClientForm from '../../components/forms/ClientForm'
import DemandeSuppressionForm from '../../components/forms/DemandeSuppressionForm'
import Button from '../../components/ui/Button'
import Confirmation from '../../components/ui/Confirmation'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useMonProfil } from '../../hooks/useMonProfil'
import { formaterDate } from '../../utils/formatters'
import './ProfilPage.css'

const MESSAGES = {
  informations: 'Vos informations ont été enregistrées.',
  motDePasse: 'Votre mot de passe a été changé. Utilisez-le lors de votre prochaine connexion.',
  demandeSuppression: 'Votre demande de suppression a bien été envoyée à nos conseillers.',
  annulationSuppression: 'Votre demande de suppression a été annulée. Votre compte est conservé.',
}

const FENETRES = { DEMANDE: 'demande', ANNULATION: 'annulation' }

/** Demande (ou annulation de la demande) de suppression du compte, traitée ensuite par un conseiller. */
function SectionSuppression({ profil, demanderSuppression, annulerDemandeSuppression, succes, onSucces }) {
  const [fenetre, setFenetre] = useState(null)
  const fermer = () => setFenetre(null)

  function terminer(message) {
    fermer()
    onSucces(message)
  }

  return (
    <section className="profil__section profil__section--suppression" aria-labelledby="titre-suppression">
      <h2 id="titre-suppression">Supprimer mon compte</h2>
      {succes && <SuccessMessage message={MESSAGES[succes]} />}

      {profil.suppressionDemandeeLe ? (
        <>
          <p>
            Votre demande de suppression du <strong>{formaterDate(profil.suppressionDemandeeLe)}</strong> a été
            transmise à nos conseillers. Votre compte, vos informations personnelles et vos favoris seront effacés
            définitivement dès qu'elle aura été traitée.
          </p>
          <Button variante="secondaire" onClick={() => setFenetre(FENETRES.ANNULATION)}>
            Annuler ma demande
          </Button>
        </>
      ) : (
        <>
          <p>
            Vous pouvez demander la suppression de votre compte. Un conseiller effacera alors définitivement vos
            informations personnelles et vos favoris. Vous pourrez annuler votre demande tant qu'elle n'a pas été
            traitée.
          </p>
          <Button variante="danger" onClick={() => setFenetre(FENETRES.DEMANDE)}>
            Demander la suppression de mon compte
          </Button>
        </>
      )}

      {fenetre === FENETRES.DEMANDE && (
        <Modal titre="Demander la suppression de votre compte ?" onFermer={fermer}>
          <p>
            Après traitement par un conseiller, la suppression est <strong>définitive</strong> : vous ne pourrez plus
            vous connecter et vos favoris seront perdus.
          </p>
          <DemandeSuppressionForm
            onEnregistrer={demanderSuppression}
            onSucces={() => terminer('demandeSuppression')}
          />
        </Modal>
      )}

      {fenetre === FENETRES.ANNULATION && (
        <Modal titre="Annuler votre demande de suppression ?" onFermer={fermer}>
          <Confirmation
            message="Votre compte sera conservé et vos conseillers ne le supprimeront pas."
            libelleConfirmer="Oui, annuler ma demande"
            onConfirmer={annulerDemandeSuppression}
            onSucces={() => terminer('annulationSuppression')}
            onAnnuler={fermer}
          />
        </Modal>
      )}
    </section>
  )
}

export default function ProfilPage() {
  const { profil, chargement, erreur, modifier, changerMotDePasse, demanderSuppression, annulerDemandeSuppression } =
    useMonProfil()
  const [succes, setSucces] = useState(null)
  // Change après chaque mot de passe enregistré, pour vider le formulaire.
  const [versionMotDePasse, setVersionMotDePasse] = useState(0)

  function motDePasseChange() {
    setVersionMotDePasse((precedente) => precedente + 1)
    setSucces('motDePasse')
  }

  if (chargement && !profil) return <Loader message="Chargement de votre profil…" />

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Mon profil</h1>

      {erreur && <ErrorMessage message={erreur.message} />}

      {profil && (
        <section className="profil__section" aria-labelledby="titre-informations">
          <h2 id="titre-informations">Mes informations</h2>
          {succes === 'informations' && <SuccessMessage message={MESSAGES.informations} />}
          <ClientForm
            key={profil.updatedAt}
            client={profil}
            onEnregistrer={modifier}
            onSucces={() => setSucces('informations')}
            libelleEnvoi="Enregistrer mes informations"
          />
        </section>
      )}

      <section className="profil__section" aria-labelledby="titre-mot-de-passe">
        <h2 id="titre-mot-de-passe">Mot de passe</h2>
        {succes === 'motDePasse' && <SuccessMessage message={MESSAGES.motDePasse} />}
        <ChangementMotDePasseForm
          key={versionMotDePasse}
          onEnregistrer={changerMotDePasse}
          onSucces={motDePasseChange}
        />
      </section>

      {profil && (
        <SectionSuppression
          profil={profil}
          demanderSuppression={demanderSuppression}
          annulerDemandeSuppression={annulerDemandeSuppression}
          succes={['demandeSuppression', 'annulationSuppression'].includes(succes) ? succes : null}
          onSucces={setSucces}
        />
      )}
    </main>
  )
}
