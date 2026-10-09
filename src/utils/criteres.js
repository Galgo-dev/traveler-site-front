// Critères de recherche du catalogue (mot-clé, catégorie d'activité, budget maximum) : passage entre
// l'adresse de la page (?q=…&categorie=…&budgetMax=…), le formulaire et les paramètres de l'API.

export const CRITERES_VIDES = { q: '', categorie: '', budgetMax: '' }

/**
 * Critères lus dans l'adresse de la page : une recherche se partage et se retrouve avec « Précédent ».
 * @param {URLSearchParams} parametresUrl
 * @param {string[]} [noms] critères à lire (tous par défaut)
 */
export function lireCriteres(parametresUrl, noms = Object.keys(CRITERES_VIDES)) {
  return Object.fromEntries(noms.map((nom) => [nom, parametresUrl.get(nom) ?? '']))
}

/** Ne garde que les critères renseignés, pour l'adresse de la page. */
export function criteresRenseignes(criteres) {
  return Object.fromEntries(
    Object.entries(criteres)
      .map(([nom, valeur]) => [nom, String(valeur).trim()])
      .filter(([, valeur]) => valeur !== ''),
  )
}

/** Critères renseignés, au format attendu par l'API (budget en nombre). */
export function versCriteresApi(criteres) {
  const renseignes = criteresRenseignes(criteres)
  if (renseignes.budgetMax !== undefined) renseignes.budgetMax = Number(renseignes.budgetMax)
  return renseignes
}
