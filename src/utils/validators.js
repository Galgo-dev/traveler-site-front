const LONGUEUR_MIN_MOT_DE_PASSE = 10
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FORMAT_TELEPHONE = /^\+?[\d\s./-]{8,20}$/

export const REGLE_MOT_DE_PASSE =
  'Au moins 10 caractères, dont une majuscule, une minuscule et un chiffre.'

/**
 * Vérifie la complexité minimale exigée par l'API.
 * Les mots de passe trop courants sont refusés par l'API elle-même.
 * @param {string} motDePasse
 * @returns {string|null} message d'erreur, ou null si valide
 */
export function validerMotDePasse(motDePasse) {
  const estValide =
    motDePasse.length >= LONGUEUR_MIN_MOT_DE_PASSE &&
    /[A-Z]/.test(motDePasse) &&
    /[a-z]/.test(motDePasse) &&
    /\d/.test(motDePasse)

  return estValide ? null : `Le mot de passe doit comporter ${REGLE_MOT_DE_PASSE.toLowerCase()}`
}

function validerDateNaissance(dateNaissance) {
  if (!dateNaissance) return 'Indiquez votre date de naissance.'
  const aujourdhui = new Date().toISOString().slice(0, 10)
  return dateNaissance < aujourdhui ? null : 'La date de naissance doit être dans le passé.'
}

/**
 * Valide le formulaire d'inscription d'un client.
 * @param {{ nom: string, prenom: string, email: string, telephone: string,
 *   dateNaissance: string, motDePasse: string, confirmation: string }} champs
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerInscription(champs) {
  const erreurs = {
    nom: champs.nom.trim() ? null : 'Indiquez votre nom.',
    prenom: champs.prenom.trim() ? null : 'Indiquez votre prénom.',
    email: FORMAT_EMAIL.test(champs.email.trim())
      ? null
      : 'Indiquez une adresse e-mail valide, par exemple nom@exemple.be.',
    telephone: FORMAT_TELEPHONE.test(champs.telephone.trim())
      ? null
      : 'Indiquez un numéro de téléphone valide, par exemple 0470 12 34 56.',
    dateNaissance: validerDateNaissance(champs.dateNaissance),
    motDePasse: validerMotDePasse(champs.motDePasse),
    confirmation:
      champs.confirmation === champs.motDePasse ? null : 'Les deux mots de passe ne sont pas identiques.',
  }

  return Object.fromEntries(Object.entries(erreurs).filter(([, message]) => message))
}
