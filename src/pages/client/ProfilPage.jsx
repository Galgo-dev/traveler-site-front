import { useState } from 'react'
import ChangementMotDePasseForm from '../../components/forms/ChangementMotDePasseForm'
import ClientForm from '../../components/forms/ClientForm'
import ErrorMessage from '../../components/ui/ErrorMessage'
import Loader from '../../components/ui/Loader'
import SuccessMessage from '../../components/ui/SuccessMessage'
import { useMonProfil } from '../../hooks/useMonProfil'
import './ProfilPage.css'

const MESSAGES = {
  informations: 'Vos informations ont été enregistrées.',
  motDePasse: 'Votre mot de passe a été changé. Utilisez-le lors de votre prochaine connexion.',
}

export default function ProfilPage() {
  const { profil, chargement, erreur, modifier, changerMotDePasse } = useMonProfil()
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
    </main>
  )
}
