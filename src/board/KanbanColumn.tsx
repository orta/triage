import { useDroppable } from '@dnd-kit/core'
import { KanbanCard, type CardData } from './KanbanCard'

// GitHub's ProjectV2 option colors
const COLOR_MAP: Record<string, string> = {
  RED: '#f85149',
  ORANGE: '#e3b341',
  YELLOW: '#d29922',
  GREEN: '#3fb950',
  BLUE: '#58a6ff',
  PURPLE: '#bc8cff',
  PINK: '#ff7b72',
  GRAY: '#8b949e',
}

interface Props {
  id: string
  title: string
  color: string
  cards: CardData[]
  onSelect: (card: CardData) => void
  droppable?: boolean
}

export function KanbanColumn({ id, title, color, cards, onSelect, droppable = true }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: !droppable })

  const accentColor = COLOR_MAP[color] ?? '#8b949e'

  const isEmpty = cards.length === 0

  return (
    <div
      className={`kanban-column${isOver ? ' kanban-column--over' : ''}${isEmpty ? ' kanban-column--empty' : ''}`}
      ref={setNodeRef}
    >
      <div className="kanban-column__header">
        <span className="kanban-column__dot" style={{ background: accentColor }} />
        {!isEmpty && <span className="kanban-column__title">{title}</span>}
        {!isEmpty && <span className="kanban-column__count">{cards.length}</span>}
      </div>

      {isEmpty ? (
        <div className="kanban-column__empty-label">
          <span style={{ color: accentColor }}>{title}</span>
        </div>
      ) : (
        <div className="kanban-column__cards">
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} columnId={id} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
