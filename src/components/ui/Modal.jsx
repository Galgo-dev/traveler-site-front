import { useEffect, useId, useRef } from 'react'
import Button from './Button'
import './Modal.css'

/**
 * Fenêtre modale accessible basée sur <dialog> : focus piégé, fermeture avec Échap.
 * @param {{ titre: string, onFermer: () => void, children: React.ReactNode }} props
 */
export default function Modal({ titre, onFermer, children }) {
  const dialogRef = useRef(null)
  const idTitre = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  function annulerFermetureNative(event) {
    event.preventDefault()
    onFermer()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modale"
      aria-labelledby={idTitre}
      onCancel={annulerFermetureNative}
    >
      <div className="modale__entete">
        <h2 id={idTitre}>{titre}</h2>
        <Button variante="secondaire" onClick={onFermer}>
          Fermer
        </Button>
      </div>
      {children}
    </dialog>
  )
}
