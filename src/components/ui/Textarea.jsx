import Champ from './Champ'
import './Textarea.css'

/**
 * Zone de texte sur plusieurs lignes (même présentation que Input).
 * @param {{ label: string, aide?: string, erreur?: string }} props
 */
export default function Textarea({ label, aide, erreur, rows = 4, ...props }) {
  return (
    <Champ label={label} aide={aide} erreur={erreur}>
      {(attributs) => <textarea rows={rows} {...attributs} {...props} />}
    </Champ>
  )
}
