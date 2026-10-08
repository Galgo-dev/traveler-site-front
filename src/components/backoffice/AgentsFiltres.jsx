import { useState } from 'react'
import { LIBELLES_ROLE, LIBELLES_STATUT_COMPTE } from '../../utils/constants'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import './AgentsFiltres.css'

const TOUS = { valeur: '', libelle: 'Tous' }

const OPTIONS_ROLE = [
  TOUS,
  ...Object.entries(LIBELLES_ROLE).map(([valeur, libelle]) => ({ valeur, libelle })),
]

const OPTIONS_STATUT = [
  TOUS,
  ...Object.entries(LIBELLES_STATUT_COMPTE).map(([valeur, libelle]) => ({ valeur, libelle })),
]

/**
 * Recherche dans les comptes du personnel par nom / e-mail, rôle et statut.
 * @param {{ filtres: { q: string, role: string, statut: string },
 *   onRechercher: (filtres: { q: string, role: string, statut: string }) => void }} props
 */
export default function AgentsFiltres({ filtres, onRechercher }) {
  const [valeurs, setValeurs] = useState(filtres)

  function modifierChamp(event) {
    const { name, value } = event.target
    setValeurs((precedentes) => ({ ...precedentes, [name]: value }))
  }

  function soumettre(event) {
    event.preventDefault()
    onRechercher({ ...valeurs, q: valeurs.q.trim() })
  }

  return (
    <form className="agents-filtres" role="search" onSubmit={soumettre}>
      <Input
        label="Rechercher (nom, prénom ou e-mail)"
        type="search"
        name="q"
        value={valeurs.q}
        onChange={modifierChamp}
      />
      <Select label="Rôle" name="role" options={OPTIONS_ROLE} value={valeurs.role} onChange={modifierChamp} />
      <Select
        label="Statut"
        name="statut"
        options={OPTIONS_STATUT}
        value={valeurs.statut}
        onChange={modifierChamp}
      />
      <Button type="submit">Rechercher</Button>
    </form>
  )
}
