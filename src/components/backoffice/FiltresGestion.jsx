import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import './FiltresGestion.css'

const TOUS = { valeur: '', libelle: 'Tous' }

/**
 * Recherche par mot-clé (champ `q`) complétée de listes déroulantes, chacune avec le choix « Tous »,
 * et éventuellement de dates (ex. période de départ). Les filtres ne sont appliqués qu'au clic sur « Rechercher ».
 * @param {{ libelleRecherche: string,
 *   listes?: { name: string, label: string, options: { valeur: string, libelle: string }[] }[],
 *   dates?: { name: string, label: string }[],
 *   filtres: Record<string, string>, onRechercher: (filtres: Record<string, string>) => void }} props
 */
export default function FiltresGestion({ libelleRecherche, listes = [], dates = [], filtres, onRechercher }) {
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
    <form className="filtres-gestion" role="search" onSubmit={soumettre}>
      <Input label={libelleRecherche} type="search" name="q" value={valeurs.q} onChange={modifierChamp} />
      {listes.map(({ name, label, options }) => (
        <Select
          key={name}
          label={label}
          name={name}
          options={[TOUS, ...options]}
          value={valeurs[name]}
          onChange={modifierChamp}
        />
      ))}
      {dates.map(({ name, label }) => (
        <Input key={name} label={label} type="date" name={name} value={valeurs[name]} onChange={modifierChamp} />
      ))}
      <Button type="submit">Rechercher</Button>
    </form>
  )
}
