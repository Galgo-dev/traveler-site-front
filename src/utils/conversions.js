// Conversions entre les valeurs des champs de formulaire (toujours des chaînes) et celles attendues par l'API.

/** Champ vide → null ; sinon le texte sans espaces superflus. */
export function texteOuNull(valeur) {
  const texte = String(valeur ?? '').trim()
  return texte === '' ? null : texte
}

/** Champ vide → null ; sinon le nombre saisi. */
export function nombreOuNull(valeur) {
  const texte = String(valeur ?? '').trim()
  return texte === '' ? null : Number(texte)
}

/** Valeur de l'API (nombre ou null) → valeur de champ (chaîne). */
export function versChamp(valeur) {
  return valeur === null || valeur === undefined ? '' : String(valeur)
}
