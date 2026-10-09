import { useState } from 'react'
import { LIBELLES_STATUT_CATALOGUE } from '../../utils/constants'
import Button from '../ui/Button'
import Confirmation from '../ui/Confirmation'
import ErrorMessage from '../ui/ErrorMessage'
import Loader from '../ui/Loader'
import Modal from '../ui/Modal'
import Pagination from '../ui/Pagination'
import SuccessMessage from '../ui/SuccessMessage'
import CarteGestion from './CarteGestion'
import FiltresGestion from './FiltresGestion'

const ACTIONS = {
  CREATION: 'creation',
  MODIFICATION: 'modification',
  STATUT: 'statut',
  SUPPRESSION: 'suppression',
}

// Ne transmet à l'API que les filtres renseignés.
function versParametresApi(filtres, page) {
  const renseignes = Object.entries(filtres).filter(([, valeur]) => valeur !== '')
  return { page, ...Object.fromEntries(renseignes) }
}

/** Accorde un participe passé avec le type d'élément : « masqué » / « masquée ». */
function accorder(participe, { feminin }) {
  return feminin ? `${participe}e` : participe
}

function titreModale({ type, element }, typeElement) {
  switch (type) {
    case ACTIONS.CREATION:
      return typeElement.titreCreation
    case ACTIONS.MODIFICATION:
      return `Modifier « ${element.nom} »`
    case ACTIONS.STATUT:
      return element.actif ? `Masquer « ${element.nom} » ?` : `Réactiver « ${element.nom} » ?`
    default:
      return `Supprimer « ${element.nom} » ?`
  }
}

function messageStatut(element, typeElement) {
  const pronom = typeElement.feminin ? 'Elle' : 'Il'
  return element.actif
    ? `« ${element.nom} » ne sera plus visible par les clients. ${pronom} reste ${accorder('conservé', typeElement)} et pourra être ${accorder('réactivé', typeElement)}.`
    : `« ${element.nom} » sera de nouveau visible par les clients.`
}

function messageSuppression(element, typeElement) {
  return [
    `« ${element.nom} » sera ${accorder('supprimé', typeElement)} définitivement.`,
    typeElement.avertissementSuppression,
    'Pour le retirer du catalogue sans perdre ses informations, préférez « Masquer ».',
  ]
    .filter(Boolean)
    .join(' ')
}

function ListeElements({ elements, decrire, onAction }) {
  if (elements.length === 0) {
    return <p>Aucun élément ne correspond à votre recherche.</p>
  }

  return (
    <ul className="grille-cartes">
      {elements.map((element) => (
        <li key={element.id}>
          <CarteGestion
            titre={element.nom}
            infos={decrire(element)}
            statut={{
              actif: element.actif,
              libelle: element.actif ? LIBELLES_STATUT_CATALOGUE.visible : LIBELLES_STATUT_CATALOGUE.masque,
            }}
            actions={
              <>
                <Button variante="secondaire" onClick={() => onAction(ACTIONS.MODIFICATION, element)}>
                  Modifier
                </Button>
                <Button variante="secondaire" onClick={() => onAction(ACTIONS.STATUT, element)}>
                  {element.actif ? 'Masquer' : 'Réactiver'}
                </Button>
                <Button variante="danger" onClick={() => onAction(ACTIONS.SUPPRESSION, element)}>
                  Supprimer
                </Button>
              </>
            }
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * Écran de gestion d'un type d'élément du catalogue : recherche, liste paginée (masqués compris),
 * création, modification, masquage / réactivation et suppression.
 * @param {{
 *   typeElement: { designation: string, feminin: boolean, titre: string, introduction: string, libelleAjout: string,
 *     titreCreation: string, avertissementSuppression?: string },
 *   useGestion: (filtres: object) => ReturnType<typeof import('../../hooks/useGestionCatalogue').useGestionCatalogue>,
 *   recherche: { libelle: string, filtresInitiaux: Record<string, string>,
 *     listes?: { name: string, label: string, options: { valeur: string, libelle: string }[] }[] },
 *   decrire: (element: object) => { libelle: string, valeur: React.ReactNode }[],
 *   Formulaire: React.ComponentType<{ element?: object, onEnregistrer: Function, onSucces: () => void }>
 * }} props
 *   useGestion : hook stable déclaré hors d'un composant (ex. useGestionPays)
 */
export default function GestionCatalogue({ typeElement, useGestion, recherche, decrire, Formulaire }) {
  const [filtres, setFiltres] = useState(recherche.filtresInitiaux)
  const [page, setPage] = useState(1)
  const [action, setAction] = useState(null)
  const [succes, setSucces] = useState(null)
  const { elements, pagination, chargement, erreur, creer, modifier, changerStatut, supprimer } = useGestion(
    versParametresApi(filtres, page),
  )

  function rechercher(nouveauxFiltres) {
    setFiltres(nouveauxFiltres)
    setPage(1)
  }

  function ouvrirAction(typeAction, element = null) {
    setSucces(null)
    setAction({ type: typeAction, element })
  }

  function terminerAction(message) {
    setAction(null)
    setSucces(message)
  }

  function contenuModale() {
    const { type: typeAction, element } = action
    const fermer = () => setAction(null)

    switch (typeAction) {
      case ACTIONS.CREATION:
        return (
          <Formulaire
            onEnregistrer={creer}
            onSucces={() => terminerAction(`${typeElement.designation} a été ${accorder('ajouté', typeElement)}.`)}
          />
        )
      case ACTIONS.MODIFICATION:
        return (
          <Formulaire
            element={element}
            onEnregistrer={(champs) => modifier(element.id, champs)}
            onSucces={() => terminerAction(`« ${element.nom} » a été ${accorder('modifié', typeElement)}.`)}
          />
        )
      case ACTIONS.STATUT:
        return (
          <Confirmation
            message={messageStatut(element, typeElement)}
            libelleConfirmer={element.actif ? 'Oui, masquer' : 'Oui, réactiver'}
            onConfirmer={() => changerStatut(element.id, !element.actif)}
            onSucces={() =>
              terminerAction(
                `« ${element.nom} » a été ${accorder(element.actif ? 'masqué' : 'réactivé', typeElement)}.`,
              )
            }
            onAnnuler={fermer}
          />
        )
      default:
        return (
          <Confirmation
            message={messageSuppression(element, typeElement)}
            libelleConfirmer="Oui, supprimer définitivement"
            variante="danger"
            onConfirmer={() => supprimer(element.id)}
            onSucces={() => terminerAction(`« ${element.nom} » a été ${accorder('supprimé', typeElement)}.`)}
            onAnnuler={fermer}
          />
        )
    }
  }

  return (
    <main>
      <div className="entete-gestion">
        <h1>{typeElement.titre}</h1>
        <Button onClick={() => ouvrirAction(ACTIONS.CREATION)}>{typeElement.libelleAjout}</Button>
      </div>
      <p>{typeElement.introduction}</p>

      {succes && <SuccessMessage message={succes} />}

      <FiltresGestion
        libelleRecherche={recherche.libelle}
        listes={recherche.listes}
        filtres={filtres}
        onRechercher={rechercher}
      />

      {chargement && <Loader message="Chargement…" />}
      {!chargement && erreur && <ErrorMessage message={erreur.message} />}
      {!chargement && !erreur && (
        <>
          <ListeElements elements={elements} decrire={decrire} onAction={ouvrirAction} />
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChanger={setPage} />}
        </>
      )}

      {action && (
        <Modal titre={titreModale(action, typeElement)} onFermer={() => setAction(null)}>
          {contenuModale()}
        </Modal>
      )}
    </main>
  )
}
