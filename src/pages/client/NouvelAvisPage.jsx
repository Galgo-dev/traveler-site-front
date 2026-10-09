import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AvisForm from '../../components/forms/AvisForm'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useAuth } from '../../hooks/useAuth'
import { useCommandesEligibles, useCreationAvis } from '../../hooks/useAvis'
import { ROUTES, routeMaDemande } from '../../utils/constants'
import { formaterDate, formaterNomPublic } from '../../utils/formatters'

function LiensRetour({ demandeId }) {
  return (
    <div className="actions">
      <Link to={routeMaDemande(demandeId)} className="bouton bouton--primaire">
        Retour au voyage
      </Link>
      <Link to={ROUTES.MES_DEMANDES} className="bouton bouton--secondaire">
        Toutes mes demandes
      </Link>
    </div>
  )
}

/** Commande déjà notée, pas terminée ou introuvable (R2 à R4). */
function CommandeNonEligible({ demandeId }) {
  return (
    <>
      <h1>Donner mon avis</h1>
      <p className="encadre">
        Vous ne pouvez pas donner d'avis sur ce voyage. Un avis se donne une seule fois, une fois le voyage confirmé
        et terminé.
      </p>
      <LiensRetour demandeId={demandeId} />
    </>
  )
}

/** Écran affiché après l'envoi : l'avis attend la modération (R10). */
function ConfirmationAvis({ demandeId }) {
  return (
    <>
      <h1>Merci pour votre avis !</h1>
      <SuccessMessage message="Votre avis a bien été envoyé. Il sera publié dès que notre équipe l'aura relu." />
      <LiensRetour demandeId={demandeId} />
    </>
  )
}

export default function NouvelAvisPage() {
  const { id } = useParams()
  const { utilisateur } = useAuth()
  const { commandes, chargement, erreur } = useCommandesEligibles()
  const { creer } = useCreationAvis()
  const [envoye, setEnvoye] = useState(false)
  const commande = commandes.find((eligible) => String(eligible.id) === id)

  // Le formulaire est long : la confirmation est affichée en haut de la page.
  useEffect(() => {
    if (envoye) window.scrollTo({ top: 0 })
  }, [envoye])

  function contenu() {
    if (envoye) return <ConfirmationAvis demandeId={id} />
    if (chargement) return <Loader message="Chargement de votre voyage…" />
    if (erreur) return <ErrorMessage message={erreur.message} />
    if (!commande) return <CommandeNonEligible demandeId={id} />

    return (
      <>
        <h1>Mon avis sur {commande.destination.nom}</h1>
        <p className="introduction">
          Votre voyage du {formaterDate(commande.dateDepart)} au {formaterDate(commande.dateRetour)}. Votre avis aidera
          les autres voyageurs à choisir leur destination.
        </p>
        <AvisForm
          commande={commande}
          signature={formaterNomPublic(utilisateur)}
          onEnregistrer={creer}
          onSucces={() => setEnvoye(true)}
        />
      </>
    )
  }

  return (
    <main className="conteneur conteneur--etroit">
      <Link className="lien-retour" to={routeMaDemande(id)}>
        ← Mon voyage
      </Link>
      {contenu()}
    </main>
  )
}
