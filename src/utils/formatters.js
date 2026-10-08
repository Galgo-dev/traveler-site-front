import { UNITES_DUREE } from './constants'

const formateurPrix = new Intl.NumberFormat('fr-BE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const formateurNombre = new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 1 })

export function formaterPrix(montant) {
  return formateurPrix.format(montant)
}

/** Ex. : (1.5, 'heures') → « 1,5 heure » ; (3, 'jours') → « 3 jours ». */
export function formaterDuree(duree, unite = 'heures') {
  const libelles = UNITES_DUREE[unite] ?? UNITES_DUREE.heures
  // En français, une quantité inférieure à 2 reste au singulier.
  const libelle = duree < 2 ? libelles.singulier : libelles.pluriel
  return `${formateurNombre.format(duree)} ${libelle}`
}
