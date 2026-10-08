import Button from './Button'
import './Pagination.css'

/**
 * Navigation « Page précédente / Page suivante ».
 * @param {{ page: number, pages: number, onChanger: (page: number) => void }} props
 */
export default function Pagination({ page, pages, onChanger }) {
  if (pages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variante="secondaire" disabled={page <= 1} onClick={() => onChanger(page - 1)}>
        Page précédente
      </Button>
      <span>
        Page {page} sur {pages}
      </span>
      <Button variante="secondaire" disabled={page >= pages} onClick={() => onChanger(page + 1)}>
        Page suivante
      </Button>
    </nav>
  )
}
