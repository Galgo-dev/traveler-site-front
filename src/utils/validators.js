import { ROLES_PERSONNEL } from './constants'

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

function validerConfirmation(motDePasse, confirmation) {
  return confirmation === motDePasse ? null : 'Les deux mots de passe ne sont pas identiques.'
}

function sansChampsValides(erreurs) {
  return Object.fromEntries(Object.entries(erreurs).filter(([, message]) => message))
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
    confirmation: validerConfirmation(champs.motDePasse, champs.confirmation),
  }

  return sansChampsValides(erreurs)
}

/**
 * Valide le choix d'un nouveau mot de passe et de sa confirmation.
 * @param {{ motDePasse: string, confirmation: string }} champs
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerNouveauMotDePasse({ motDePasse, confirmation }) {
  return sansChampsValides({
    motDePasse: validerMotDePasse(motDePasse),
    confirmation: validerConfirmation(motDePasse, confirmation),
  })
}

/**
 * Valide le formulaire de création ou de modification d'un compte du personnel.
 * Le mot de passe n'est demandé qu'à la création.
 * @param {{ nom: string, prenom: string, email: string, numeroEmploye: string, role: string,
 *   motDePasse?: string, confirmation?: string }} champs
 * @param {{ creation: boolean }} options
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerAgent(champs, { creation }) {
  const erreurs = {
    nom: champs.nom.trim() ? null : 'Indiquez le nom.',
    prenom: champs.prenom.trim() ? null : 'Indiquez le prénom.',
    email: FORMAT_EMAIL.test(champs.email.trim())
      ? null
      : "Indiquez l'adresse e-mail professionnelle, par exemple prenom.nom@agence.be.",
    numeroEmploye: champs.numeroEmploye.trim() ? null : "Indiquez le numéro d'employé.",
    role: ROLES_PERSONNEL.includes(champs.role) ? null : 'Choisissez un rôle.',
  }

  return {
    ...sansChampsValides(erreurs),
    ...(creation ? validerNouveauMotDePasse(champs) : {}),
  }
}
