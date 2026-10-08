import Champ from './Champ'

/**
 * Liste déroulante avec libellé, aide et message d'erreur (même présentation que Input).
 * @param {{ label: string, options: { valeur: string, libelle: string }[], aide?: string, erreur?: string }} props
 */
export default function Select({ label, options, aide, erreur, ...props }) {
  return (
    <Champ label={label} aide={aide} erreur={erreur}>
      {(attributs) => (
        <select {...attributs} {...props}>
          {options.map(({ valeur, libelle }) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>
      )}
    </Champ>
  )
}
