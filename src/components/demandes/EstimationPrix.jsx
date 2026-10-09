import ErrorMessage from '../ui/ErrorMessage'
import WarningMessage from '../ui/WarningMessage'
import DetailPrix from './DetailPrix'
import './EstimationPrix.css'

/**
 * Prix estimé de la demande en cours de saisie, recalculé à chaque changement (§7), avec l'avertissement
 * de doublon éventuel (R14, non bloquant).
 * @param {{ saisieComplete: boolean, estimation: object|null, chargement: boolean, erreur: Error|null,
 *   nbAdultes: number, nbEnfants: number }} props
 */
export default function EstimationPrix({ saisieComplete, estimation, chargement, erreur, nbAdultes, nbEnfants }) {
  return (
    <section className="estimation-prix" aria-labelledby="titre-estimation" aria-live="polite">
      <h2 id="titre-estimation">Prix estimé</h2>

      {!saisieComplete && (
        <p>Choisissez la destination, les dates et le nombre de voyageurs pour voir le prix estimé.</p>
      )}
      {saisieComplete && erreur && <ErrorMessage message={erreur.message} />}
      {saisieComplete && !erreur && !estimation && chargement && <p>Calcul du prix en cours…</p>}
      {saisieComplete && !erreur && estimation && (
        <>
          <DetailPrix {...estimation} nbAdultes={nbAdultes} nbEnfants={nbEnfants} />
          {estimation.avertissement && <WarningMessage message={estimation.avertissement} />}
        </>
      )}
    </section>
  )
}
