import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export interface CardData {
  id: string
  contentId?: string  // issue/PR node ID — needed for posting comments
  title: string
  number?: number
  url?: string
  state?: string
  bodyHTML?: string
  typename: string
  labels: Array<{ name: string; color: string }>
  assignees: Array<{ login: string; avatarUrl: string }>
  author?: { login: string; avatarUrl: string }
}

interface Props {
  card: CardData
  columnId: string
  onSelect: (card: CardData) => void
}

function repoFromUrl(url?: string) {
  const match = url?.match(/github\.com\/[^/]+\/([^/]+)\//)
  return match ? match[1] : null
}

export function KanbanCard({ card, columnId, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card, fromColumnId: columnId },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  const repo = repoFromUrl(card.url)
  const showState = card.state && card.state.toUpperCase() !== 'OPEN'

  return (
    <div
      ref={setNodeRef}
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}`}
      style={style}
      onClick={() => onSelect(card)}
      {...listeners}
      {...attributes}
    >
      <div className="kanban-card__top">
        <div className="kanban-card__title">{card.title}</div>
        {card.assignees.length > 0 && (
          <div className="kanban-card__assignees">
            {card.assignees.map((a) => (
              <img key={a.login} src={a.avatarUrl} alt={a.login} title={a.login} className="kanban-card__avatar" />
            ))}
          </div>
        )}
      </div>

      {(card.number !== undefined || showState || card.labels.length > 0) && (
        <div className="kanban-card__meta">
          {card.number !== undefined && (
            <span className="kanban-card__number">
              {repo ? `${repo}#${card.number}` : `#${card.number}`}
            </span>
          )}
          {showState && (
            <span className={`kanban-card__state kanban-card__state--${card.state!.toLowerCase()}`}>
              {card.state}
            </span>
          )}
          {card.labels.map((label) => (
            <span
              key={label.name}
              className="kanban-card__label"
              style={{ background: `#${label.color}22`, color: `#${label.color}`, borderColor: `#${label.color}44` }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
