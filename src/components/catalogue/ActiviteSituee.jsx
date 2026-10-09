import ActiviteCard from './ActiviteCard'
import LieuActivite from './LieuActivite'
import './ActiviteSituee.css'

/**
 * Carte d'activité précédée de son lieu, pour les listes qui mélangent plusieurs pays ou destinations
 * (recherche, favoris, page d'un pays).
 * @param {{ activite: object, avecPays?: boolean }} props
 */
export default function ActiviteSituee({ activite, avecPays }) {
  return (
    <div className="activite-situee">
      <LieuActivite activite={activite} avecPays={avecPays} />
      <ActiviteCard activite={activite} />
    </div>
  )
}
