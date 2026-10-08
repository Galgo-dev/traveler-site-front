import Champ from './Champ'

export default function Input({ label, aide, erreur, ...props }) {
  return (
    <Champ label={label} aide={aide} erreur={erreur}>
      {(attributs) => <input {...attributs} {...props} />}
    </Champ>
  )
}
