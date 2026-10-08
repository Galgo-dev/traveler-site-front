import './Checkbox.css'

/**
 * Case à cocher agrandie, cliquable sur tout son libellé.
 * @param {{ label: string }} props
 */
export default function Checkbox({ label, ...props }) {
  return (
    <label className="case-a-cocher">
      <input type="checkbox" {...props} />
      {label}
    </label>
  )
}
