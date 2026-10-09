import {
  CONTINENTS,
  LIBELLES_CATEGORIE,
  LIBELLES_DIFFICULTE,
  ROLES_PERSONNEL,
  UNITES_DUREE,
} from './constants'

const LONGUEUR_MIN_MOT_DE_PASSE = 10
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FORMAT_TELEPHONE = /^\+?[\d\s./-]{8,20}$/
const FORMAT_URL = /^https?:\/\/\S+$/i
const DECALAGE_HORAIRE_MIN = -12
const DECALAGE_HORAIRE_MAX = 14

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
  if (!dateNaissance) return 'Indiquez la date de naissance.'
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

function estRenseigne(valeur) {
  return String(valeur ?? '').trim() !== ''
}

function exiger(valeur, message) {
  return estRenseigne(valeur) ? null : message
}

/**
 * Vérifie un nombre saisi dans un champ texte ou numérique.
 * @param {string|number} valeur
 * @param {{ min?: number, max?: number, positif?: boolean, entier?: boolean, facultatif?: boolean }} regles
 *   positif : strictement supérieur à zéro
 * @param {string} message
 */
function validerNombre(valeur, regles, message) {
  const { min = -Infinity, max = Infinity, positif = false, entier = false, facultatif = false } = regles
  if (!estRenseigne(valeur)) return facultatif ? null : message

  const nombre = Number(valeur)
  const estValide =
    Number.isFinite(nombre) &&
    nombre >= min &&
    nombre <= max &&
    (!positif || nombre > 0) &&
    (!entier || Number.isInteger(nombre))

  return estValide ? null : message
}

function validerValeurAutorisee(valeur, valeursAutorisees, message) {
  return valeursAutorisees.includes(valeur) ? null : message
}

/**
 * Valide le formulaire d'un pays.
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerPays(champs) {
  return sansChampsValides({
    nom: exiger(champs.nom, 'Indiquez le nom du pays.'),
    continent: validerValeurAutorisee(champs.continent, CONTINENTS, 'Choisissez un continent.'),
    languePrincipale: exiger(champs.languePrincipale, 'Indiquez la langue principale.'),
    monnaie: exiger(champs.monnaie, 'Indiquez la monnaie.'),
    decalageHoraire: validerNombre(
      champs.decalageHoraire,
      { min: DECALAGE_HORAIRE_MIN, max: DECALAGE_HORAIRE_MAX, facultatif: true },
      `Indiquez un décalage en heures entre ${DECALAGE_HORAIRE_MIN} et +${DECALAGE_HORAIRE_MAX}, par exemple 2 ou -5.5.`,
    ),
  })
}

/**
 * Valide le formulaire d'une destination.
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerDestination(champs) {
  return sansChampsValides({
    paysId: exiger(champs.paysId, 'Choisissez le pays de la destination.'),
    nom: exiger(champs.nom, 'Indiquez le nom de la destination.'),
    prixAPartirDe: validerNombre(
      champs.prixAPartirDe,
      { min: 0, facultatif: true },
      'Indiquez un prix en euros, par exemple 850.',
    ),
    photoUrl:
      !estRenseigne(champs.photoUrl) || FORMAT_URL.test(champs.photoUrl.trim())
        ? null
        : 'Indiquez une adresse web complète, commençant par https://',
  })
}

/**
 * Valide le formulaire d'une activité.
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerActivite(champs) {
  return sansChampsValides({
    paysId: exiger(champs.paysId, "Choisissez le pays de l'activité."),
    nom: exiger(champs.nom, "Indiquez le nom de l'activité."),
    categorie: validerValeurAutorisee(
      champs.categorie,
      Object.keys(LIBELLES_CATEGORIE),
      'Choisissez une catégorie.',
    ),
    duree: validerNombre(champs.duree, { positif: true }, 'Indiquez une durée supérieure à zéro.'),
    dureeUnite: validerValeurAutorisee(champs.dureeUnite, Object.keys(UNITES_DUREE), 'Choisissez une unité.'),
    prixParPersonne: validerNombre(
      champs.prixParPersonne,
      { min: 0 },
      'Indiquez un prix par personne en euros, par exemple 45.',
    ),
    niveauDifficulte: validerValeurAutorisee(
      champs.niveauDifficulte,
      ['', ...Object.keys(LIBELLES_DIFFICULTE)],
      'Choisissez un niveau de difficulté.',
    ),
    ageMinimum: validerNombre(
      champs.ageMinimum,
      { min: 0, max: 120, entier: true, facultatif: true },
      'Indiquez un âge en années entières, par exemple 12.',
    ),
  })
}

/**
 * Valide la correction des informations d'un client par le personnel (jamais son mot de passe).
 * @param {{ nom: string, prenom: string, email: string, telephone: string, dateNaissance: string }} champs
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerClient(champs) {
  return sansChampsValides({
    nom: exiger(champs.nom, 'Indiquez le nom.'),
    prenom: exiger(champs.prenom, 'Indiquez le prénom.'),
    email: FORMAT_EMAIL.test(champs.email.trim())
      ? null
      : 'Indiquez une adresse e-mail valide, par exemple nom@exemple.be.',
    telephone: FORMAT_TELEPHONE.test(champs.telephone.trim())
      ? null
      : 'Indiquez un numéro de téléphone valide, par exemple 0470 12 34 56.',
    dateNaissance: validerDateNaissance(champs.dateNaissance),
  })
}

/**
 * Valide le changement de son propre mot de passe.
 * @param {{ motDePasseActuel: string, nouveauMotDePasse: string, confirmation: string }} champs
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerChangementMotDePasse({ motDePasseActuel, nouveauMotDePasse, confirmation }) {
  const { motDePasse, ...autresErreurs } = validerNouveauMotDePasse({ motDePasse: nouveauMotDePasse, confirmation })

  return sansChampsValides({
    motDePasseActuel: motDePasseActuel ? null : 'Indiquez votre mot de passe actuel.',
    nouveauMotDePasse:
      motDePasse ??
      (nouveauMotDePasse === motDePasseActuel ? "Choisissez un mot de passe différent de l'actuel." : null),
    ...autresErreurs,
  })
}

const FORMAT_JETON_REINITIALISATION = /^[0-9a-f]{64}$/i

/** Le lien reçu par e-mail contient un jeton de 64 caractères hexadécimaux. */
export function estJetonReinitialisationValide(jeton) {
  return FORMAT_JETON_REINITIALISATION.test(jeton ?? '')
}

/**
 * Valide la demande de lien de réinitialisation.
 * @param {{ email: string }} champs
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerDemandeReinitialisation({ email }) {
  return sansChampsValides({
    email: FORMAT_EMAIL.test(email.trim())
      ? null
      : 'Indiquez une adresse e-mail valide, par exemple nom@exemple.be.',
  })
}

/**
 * Valide la demande de suppression de son compte : le mot de passe confirme qu'il s'agit du titulaire.
 * @param {{ motDePasse: string }} champs
 * @returns {Record<string, string>} message d'erreur par champ (vide si tout est valide)
 */
export function validerDemandeSuppression({ motDePasse }) {
  return sansChampsValides({
    motDePasse: motDePasse ? null : 'Indiquez votre mot de passe pour confirmer votre demande.',
  })
}
