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

/** Ex. : 0 → « Même heure qu'en Belgique » ; 8 → « +8 h » ; -5.5 → « −5 h 30 ». */
export function formaterDecalageHoraire(heures) {
  if (!heures) return "Même heure qu'en Belgique"

  const signe = heures > 0 ? '+' : '−'
  const totalMinutes = Math.round(Math.abs(heures) * 60)
  const h = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const libelle = minutes ? `${h} h ${String(minutes).padStart(2, '0')}` : `${h} h`

  return `${signe}${libelle} par rapport à la Belgique`
}

const formateurDate = new Intl.DateTimeFormat('fr-BE', { dateStyle: 'long', timeZone: 'UTC' })

/** Ex. : '1965-03-14' → « 14 mars 1965 ». */
export function formaterDate(dateIso) {
  return formateurDate.format(new Date(dateIso))
}

const formateurPrixCentimes = new Intl.NumberFormat('fr-BE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Prix d'une demande de voyage (l'API renvoie des chaînes comme « 2462.50 »).
 * Les centimes ne sont affichés que s'il y en a : 2462.5 → « 2 462,50 € », 950 → « 950 € ».
 */
export function formaterPrixEstime(montant) {
  const nombre = Number(montant)
  return Number.isInteger(nombre) ? formaterPrix(nombre) : formateurPrixCentimes.format(nombre)
}

/** Ex. : (2, 1) → « 2 adultes, 1 enfant » ; (1, 0) → « 1 adulte ». */
export function formaterVoyageurs(nbAdultes, nbEnfants = 0) {
  const pluriel = (nombre, mot) => `${nombre} ${mot}${nombre > 1 ? 's' : ''}`
  return [pluriel(nbAdultes, 'adulte'), nbEnfants > 0 && pluriel(nbEnfants, 'enfant')].filter(Boolean).join(', ')
}

const formateurDateHeure = new Intl.DateTimeFormat('fr-BE', { dateStyle: 'long', timeStyle: 'short' })

/** Ex. : « 9 octobre 2026 à 14:32 » (date de commande, historique d'une demande). */
export function formaterDateHeure(dateIso) {
  return formateurDateHeure.format(new Date(dateIso))
}

/** Nom sous lequel un avis est publié (R17) : « Julie D. ». */
export function formaterNomPublic({ prenom, nom }) {
  return `${prenom} ${nom.charAt(0).toUpperCase()}.`
}
