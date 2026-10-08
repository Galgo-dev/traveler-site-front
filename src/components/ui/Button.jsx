import './Button.css'

export default function Button({ type = 'button', variante = 'primaire', className = '', ...props }) {
  return <button type={type} className={`bouton bouton--${variante} ${className}`.trim()} {...props} />
}
