import './CarteGestion.css'

/**
 * Carte d'un élément géré dans le back-office : titre, caractéristiques, statut et actions.
 * @param {{ titre: React.ReactNode, infos: { libelle: string, valeur: React.ReactNode }[],
 *   statut: { actif: boolean, libelle: string }, actions: React.ReactNode }} props
 */
export default function CarteGestion({ titre, infos, statut, actions }) {
  const classeStatut = statut.actif ? 'actif' : 'desactive'

  return (
    <article className={`carte-gestion carte-gestion--${classeStatut}`}>
      <h3 className="carte-gestion__titre">{titre}</h3>

      <dl className="liste-infos">
        {infos.map(({ libelle, valeur }) => (
          <div key={libelle} className="carte-gestion__info">
            <dt>{libelle}</dt>
            <dd>{valeur}</dd>
          </div>
        ))}
        <div className="carte-gestion__info">
          <dt>Statut</dt>
          <dd>
            <span className={`etiquette etiquette--${classeStatut}`}>{statut.libelle}</span>
          </dd>
        </div>
      </dl>

      <div className="carte-gestion__actions">{actions}</div>
    </article>
  )
}
