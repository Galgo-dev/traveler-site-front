import ErrorMessage from '../ui/ErrorMessage'
import Loader from '../ui/Loader'
import './FavorisClient.css'

function ListeFavoris({ titre, elements }) {
  return (
    <section>
      <h3>{titre}</h3>
      {elements.length === 0 ? (
        <p>Aucune.</p>
      ) : (
        <ul className="favoris-client__liste">
          {elements.map((element) => (
            <li key={element.id}>
              <strong>{element.nom}</strong>
              {element.pays?.nom && <span> — {element.pays.nom}</span>}
              {!element.actif && <span className="etiquette etiquette--desactive">Masquée du catalogue</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * Destinations et activités mises en favori par un client, éléments masqués compris.
 * @param {{ favoris: { destinations: object[], activites: object[] } | null, chargement: boolean, erreur: Error|null }} props
 */
export default function FavorisClient({ favoris, chargement, erreur }) {
  if (chargement) return <Loader message="Chargement des favoris…" />
  if (erreur) return <ErrorMessage message={erreur.message} />

  return (
    <div className="favoris-client">
      <ListeFavoris titre="Destinations" elements={favoris?.destinations ?? []} />
      <ListeFavoris titre="Activités" elements={favoris?.activites ?? []} />
    </div>
  )
}
