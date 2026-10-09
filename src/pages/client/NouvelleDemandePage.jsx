import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DemandeForm from '../../components/forms/DemandeForm'
import SuccessMessage from '../../components/ui/SuccessMessage'
import WarningMessage from '../../components/ui/WarningMessage'
import { useCreationDemande } from '../../hooks/useDemandes'
import { ROUTES, routeMaDemande } from '../../utils/constants'
import './NouvelleDemandePage.css'

/** Écran affiché juste après l'envoi : message de confirmation immédiat (§7). */
function ConfirmationDemande({ resultat }) {
  return (
    <>
      <SuccessMessage message={resultat.message} />
      {resultat.avertissement && <WarningMessage message={resultat.avertissement} />}
      <div className="nouvelle-demande__suite">
        <Link to={routeMaDemande(resultat.demande.id)} className="bouton bouton--primaire">
          Voir ma demande
        </Link>
        <Link to={ROUTES.MES_DEMANDES} className="bouton bouton--secondaire">
          Toutes mes demandes
        </Link>
        <Link to={ROUTES.DESTINATIONS} className="bouton bouton--secondaire">
          Retour aux destinations
        </Link>
      </div>
    </>
  )
}

export default function NouvelleDemandePage() {
  const [parametresUrl] = useSearchParams()
  const { creer } = useCreationDemande()
  const [resultat, setResultat] = useState(null)

  // Le formulaire est long : la confirmation est affichée en haut de la page.
  useEffect(() => {
    if (resultat) window.scrollTo({ top: 0 })
  }, [resultat])

  return (
    <main className="conteneur conteneur--etroit">
      <h1>Demande de voyage</h1>

      {resultat ? (
        <ConfirmationDemande resultat={resultat} />
      ) : (
        <>
          <p className="introduction">
            Indiquez vos dates, le nombre de voyageurs et les activités qui vous intéressent. Aucun paiement n'est
            demandé : un conseiller vous rappellera pour organiser votre voyage.
          </p>
          <DemandeForm
            destinationInitiale={parametresUrl.get('destination')}
            onEnregistrer={async (demande) => setResultat(await creer(demande))}
            onSucces={() => {}}
          />
        </>
      )}
    </main>
  )
}
