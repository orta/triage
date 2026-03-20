import { useLazyLoadQuery, useMutation } from 'react-relay'
import { graphql } from 'relay-runtime'
import { useLocation } from 'wouter'
import { useState, useCallback, useRef } from 'react'
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard, type CardData } from './KanbanCard'
import { CardSidebar, type ColumnOption } from './CardSidebar'
import { moveCardMutation } from './MoveCardMutation'
import type { KanbanBoardQuery as KanbanBoardQueryType } from '../__generated__/KanbanBoardQuery.graphql'
import type { MoveCardMutation as MoveCardMutationType } from '../__generated__/MoveCardMutation.graphql'
import './KanbanBoard.css'

const query = graphql`
  query KanbanBoardQuery($org: String!, $number: Int!) {
    organization(login: $org) {
      projectV2(number: $number) {
        id
        title
        fields(first: 20) {
          nodes {
            __typename
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                id
                name
                color
              }
            }
          }
        }
        items(first: 100) {
          nodes {
            id
            fieldValues(first: 10) {
              nodes {
                __typename
                ... on ProjectV2ItemFieldSingleSelectValue {
                  optionId
                  field {
                    ... on ProjectV2FieldCommon {
                      id
                    }
                  }
                }
              }
            }
            content {
              __typename
              ... on Issue {
                id
                title
                number
                url
                bodyHTML
                issueState: state
                author {
                  login
                  avatarUrl
                }
                labels(first: 5) {
                  nodes {
                    name
                    color
                  }
                }
                assignees(first: 3) {
                  nodes {
                    login
                    avatarUrl
                  }
                }
              }
              ... on PullRequest {
                id
                title
                number
                url
                bodyHTML
                prState: state
              }
              ... on DraftIssue {
                title
                bodyHTML
              }
            }
          }
        }
      }
    }
  }
`

interface Props {
  org: string
  projectNumber: number
}

export function KanbanBoard({ org, projectNumber }: Props) {
  const data = useLazyLoadQuery<KanbanBoardQueryType>(query, { org, number: projectNumber })
  const [, navigate] = useLocation()
  const [commitMove] = useMutation<MoveCardMutationType>(moveCardMutation)
  const [activeCard, setActiveCard] = useState<CardData | null>(null)
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [pending, setPending] = useState<Record<string, string>>({})

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const columnsRef = useRef<HTMLDivElement>(null)

  const onColumnsWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // already horizontal scroll
    e.preventDefault()
    columnsRef.current?.scrollBy({ left: e.deltaY })
  }, [])

  const project = data.organization?.projectV2
  if (!project) return <div className="page"><p>Project not found.</p></div>

  const statusField = project.fields.nodes?.find(
    (f) => f?.__typename === 'ProjectV2SingleSelectField' && f.name === 'Status'
  ) ?? project.fields.nodes?.find((f) => f?.__typename === 'ProjectV2SingleSelectField')

  if (!statusField || statusField.__typename !== 'ProjectV2SingleSelectField') {
    return <div className="page"><p>No status field found in this project.</p></div>
  }

  const columns = statusField.options

  const allCards: CardData[] = (project.items.nodes ?? []).flatMap((item) => {
    if (!item?.content) return []
    const content = item.content
    let title = ''
    let contentId: string | undefined
    let number: number | undefined
    let url: string | undefined
    let state: string | undefined
    let bodyHTML: string | undefined
    let labels: CardData['labels'] = []
    let assignees: CardData['assignees'] = []
    let author: CardData['author']

    if (content.__typename === 'Issue') {
      contentId = content.id
      title = content.title
      number = content.number
      url = content.url
      state = content.issueState
      bodyHTML = content.bodyHTML ?? undefined
      author = content.author ? { login: content.author.login, avatarUrl: content.author.avatarUrl } : undefined
      labels = (content.labels?.nodes ?? []).filter(Boolean).map((l) => ({ name: l!.name, color: l!.color }))
      assignees = (content.assignees?.nodes ?? []).filter(Boolean).map((a) => ({ login: a!.login, avatarUrl: a!.avatarUrl }))
    } else if (content.__typename === 'PullRequest') {
      contentId = content.id
      title = content.title
      number = content.number
      url = content.url
      state = content.prState
      bodyHTML = content.bodyHTML ?? undefined
    } else if (content.__typename === 'DraftIssue') {
      title = content.title
      bodyHTML = content.bodyHTML ?? undefined
    } else {
      return []
    }

    return [{ id: item.id, contentId, title, number, url, state, bodyHTML, typename: content.__typename, labels, assignees, author }]
  })

  const itemColumnMap: Record<string, string | null> = {}
  for (const item of project.items.nodes ?? []) {
    if (!item) continue
    const statusValue = item.fieldValues.nodes?.find(
      (fv) => fv?.__typename === 'ProjectV2ItemFieldSingleSelectValue' &&
        fv.field && 'id' in fv.field && fv.field.id === statusField.id
    )
    const optionId = statusValue?.__typename === 'ProjectV2ItemFieldSingleSelectValue'
      ? statusValue.optionId ?? null : null
    itemColumnMap[item.id] = pending[item.id] ?? optionId
  }

  const cardsByColumn: Record<string, CardData[]> = {}
  for (const col of columns) {
    if (col) cardsByColumn[col.id] = []
  }
  for (const card of allCards) {
    const colId = itemColumnMap[card.id]
    if (colId && cardsByColumn[colId]) cardsByColumn[colId].push(card)
  }

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveCard(active.data.current?.card ?? null)
  }, [])

  const handleMove = useCallback((itemId: string, toColumnId: string) => {
    // Immediately show the card in the target column via pending state.
    // The mutation response returns the updated fieldValues so the Relay store
    // is correct once it lands — clearing pending then reads the right value.
    setPending((prev) => ({ ...prev, [itemId]: toColumnId }))

    commitMove({
      variables: { projectId: project.id, itemId, fieldId: statusField.id, optionId: toColumnId },
      onCompleted() {
        setPending((prev) => { const next = { ...prev }; delete next[itemId]; return next })
      },
      onError() {
        // Revert — snap card back to its real column
        setPending((prev) => { const next = { ...prev }; delete next[itemId]; return next })
      },
    })
  }, [commitMove, project.id, statusField.id])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveCard(null)
    if (!over || active.id === over.id) return
    const fromColumnId = active.data.current?.fromColumnId as string
    const toColumnId = over.id as string
    if (fromColumnId === toColumnId) return
    handleMove(active.id as string, toColumnId)
  }, [handleMove])

  const handleSelect = useCallback((card: CardData) => {
    setSelectedCard((prev) => prev?.id === card.id ? null : card)
  }, [])

  return (
    <div className="board-page">
      <div className="board-header">
        <button className="back-link" onClick={() => navigate(`/orgs/${org}/projects`)}>
          ← {org}
        </button>
        <h1 className="board-title">{project.title}</h1>
      </div>

      <div className="board-body">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="board-columns" ref={columnsRef} onWheel={onColumnsWheel}>
            {columns.map((col) => {
              if (!col) return null
              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.name}
                  color={col.color}
                  cards={cardsByColumn[col.id] ?? []}
                  onSelect={handleSelect}
                />
              )
            })}
          </div>

          <DragOverlay>
            {activeCard && <KanbanCard card={activeCard} columnId="" onSelect={() => {}} />}
          </DragOverlay>
        </DndContext>

        {selectedCard && (
          <CardSidebar
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            columns={columns.filter(Boolean) as ColumnOption[]}
            currentColumnId={itemColumnMap[selectedCard.id]}
            onMove={handleMove}
            org={org}
            allCards={allCards}
          />
        )}
      </div>
    </div>
  )
}
