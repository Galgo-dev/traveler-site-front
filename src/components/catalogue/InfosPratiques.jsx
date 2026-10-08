import { formaterDecalageHoraire } from '../../utils/formatters'
import './InfosPratiques.css'

function MentionVisa({ visaRequis }) {
  return visaRequis ? (
    <span className="infos-pratiques__visa infos-pratiques__visa--requis">
      ⚠ Visa obligatoire pour les ressortissants belges
    </span>
  ) : (
    <span className="infos-pratiques__visa infos-pratiques__visa--libre">
      ✓ Pas de visa requis pour les ressortissants belges
    </span>
  )
}

export default function InfosPratiques({ pays }) {
  const { languePrincipale, monnaie, decalageHoraire, visaRequis } = pays

  return (
    <div className="infos-pratiques">
      <div className="infos-pratiques__bloc">
        <h3>Formalités d'entrée</h3>
        <MentionVisa visaRequis={visaRequis} />
        <p className="infos-pratiques__avertissement">
          Informations données à titre indicatif. Avant de partir, vérifiez les conditions d'entrée
          dans ce pays (passeport, carte d'identité, vaccins) auprès du SPF Affaires étrangères ou
          de votre conseiller.
        </p>
      </div>

      <div className="infos-pratiques__bloc">
        <h3>Sur place</h3>
        <dl className="liste-infos">
          {languePrincipale && (
            <div>
              <dt>Langue principale</dt>
              <dd>{languePrincipale}</dd>
            </div>
          )}
          {monnaie && (
            <div>
              <dt>Monnaie</dt>
              <dd>{monnaie}</dd>
            </div>
          )}
          {decalageHoraire != null && (
            <div>
              <dt>Décalage horaire</dt>
              <dd>{formaterDecalageHoraire(decalageHoraire)}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
