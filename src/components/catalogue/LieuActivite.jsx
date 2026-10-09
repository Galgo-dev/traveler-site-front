import { Link } from 'react-router-dom'
import { routeDestinationDetail, routePaysDetail } from '../../utils/constants'
import './LieuActivite.css'

/**
 * Situe une activité affichée hors de sa fiche destination : « Pérou · Lima », avec des liens.
 * @param {{ activite: { pays?: object, destination?: object }, avecPays?: boolean }} props
 *   avecPays : faux sur la page d'un pays, où le pays est déjà connu
 */
export default function LieuActivite({ activite, avecPays = true }) {
  const { pays, destination } = activite
  const morceaux = [
    avecPays && pays && <Link key="pays" to={routePaysDetail(pays.id)}>{pays.nom}</Link>,
    destination && (
      <Link key="destination" to={routeDestinationDetail(destination.id)}>
        {destination.nom}
      </Link>
    ),
  ].filter(Boolean)

  if (morceaux.length === 0) return null

  return (
    <p className="lieu-activite">
      {morceaux.flatMap((morceau, index) => (index === 0 ? [morceau] : [' · ', morceau]))}
    </p>
  )
}
