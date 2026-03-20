import { useLazyLoadQuery, useMutation } from 'react-relay'
import { graphql } from 'relay-runtime'
import { useLocation } from 'wouter'
import { useState, useCallback, useRef, useEffect } from 'react'
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
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
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

type RawItem = {
  id: string
  fieldValues: { nodes: Array<{ __typename: string; optionId?: string | null; field?: { id?: string } } | null> | null }
  content: {
    __typename: string
    id?: string
    title?: string
    number?: number
    url?: string
    bodyHTML?: string
    issueState?: string
    prState?: string
    author?: { login: string; avatarUrl: string } | null
    labels?: { nodes: Array<{ name: string; color: string } | null> | null } | null
    assignees?: { nodes: Array<{ login: string; avatarUrl: string } | null> | null } | null
  } | null
}

const itemsPageQuery = `
  query($org: String!, $number: Int!, $cursor: String!) {
    organization(login: $org) {
      projectV2(number: $number) {
        items(first: 100, after: $cursor) {
          pageInfo { endCursor hasNextPage }
          nodes {
            id
            fieldValues(first: 10) {
              nodes {
                __typename
                ... on ProjectV2ItemFieldSingleSelectValue {
                  optionId
                  field { ... on ProjectV2FieldCommon { id } }
                }
              }
            }
            content {
              __typename
              ... on Issue {
                id title number url bodyHTML
                issueState: state
                author { login avatarUrl }
                labels(first: 5) { nodes { name color } }
                assignees(first: 3) { nodes { login avatarUrl } }
              }
              ... on PullRequest { id title number url bodyHTML prState: state }
              ... on DraftIssue { title bodyHTML }
            }
          }
        }
      }
    }
  }
`

function rawItemToCard(item: RawItem): CardData | null {
  if (!item.content) return null
  const content = item.content
  let title = '', contentId: string | undefined, number: number | undefined
  let url: string | undefined, state: string | undefined, bodyHTML: string | undefined
  let labels: CardData['labels'] = [], assignees: CardData['assignees'] = []
  let author: CardData['author']

  if (content.__typename === 'Issue') {
    contentId = content.id; title = content.title ?? ''; number = content.number; url = content.url
    state = content.issueState; bodyHTML = content.bodyHTML ?? undefined
    author = content.author ? { login: content.author.login, avatarUrl: content.author.avatarUrl } : undefined
    labels = (content.labels?.nodes ?? []).filter(Boolean).map((l) => ({ name: l!.name, color: l!.color }))
    assignees = (content.assignees?.nodes ?? []).filter(Boolean).map((a) => ({ login: a!.login, avatarUrl: a!.avatarUrl }))
  } else if (content.__typename === 'PullRequest') {
    contentId = content.id; title = content.title ?? ''; number = content.number; url = content.url
    state = content.prState; bodyHTML = content.bodyHTML ?? undefined
  } else if (content.__typename === 'DraftIssue') {
    title = content.title ?? ''; bodyHTML = content.bodyHTML ?? undefined
  } else {
    return null
  }
  return { id: item.id, contentId, title, number, url, state, bodyHTML, typename: content.__typename as CardData['typename'], labels, assignees, author }
}

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
  const [extraItems, setExtraItems] = useState<RawItem[]>([])
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const columnsRef = useRef<HTMLDivElement>(null)

  const onColumnsWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return // already horizontal scroll
    // Don't intercept if scrolling inside a vertically scrollable column
    let el = e.target as HTMLElement | null
    while (el && el !== e.currentTarget) {
      if (el.scrollHeight > el.clientHeight && el.style.overflowY !== 'hidden') {
        const atTop = el.scrollTop === 0 && e.deltaY < 0
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0
        if (!atTop && !atBottom) return
      }
      el = el.parentElement
    }
    e.preventDefault()
    columnsRef.current?.scrollBy({ left: e.deltaY })
  }, [])

  const pageInfo = data.organization?.projectV2?.items.pageInfo
  useEffect(() => {
    setExtraItems([])
    if (!pageInfo?.hasNextPage) return
    setIsFetchingMore(true)
    const token = localStorage.getItem('github_token')
    let cancelled = false
    async function fetchAllPages() {
      let cursor = pageInfo!.endCursor
      let hasNext = pageInfo!.hasNextPage
      while (hasNext && cursor) {
        const res = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `bearer ${token}` },
          body: JSON.stringify({ query: itemsPageQuery, variables: { org, number: projectNumber, cursor } }),
        })
        const json = await res.json()
        const page = json.data?.organization?.projectV2?.items
        if (!page || cancelled) break
        const newItems = (page.nodes ?? []).filter(Boolean) as RawItem[]
        setExtraItems((prev) => [...prev, ...newItems])
        hasNext = page.pageInfo.hasNextPage
        cursor = page.pageInfo.endCursor
      }
      if (!cancelled) setIsFetchingMore(false)
    }
    fetchAllPages()
    return () => { cancelled = true }
  }, [org, projectNumber, pageInfo?.hasNextPage, pageInfo?.endCursor])

  const project = data.organization?.projectV2
  if (!project) return <div className="page"><p>Project not found.</p></div>

  const statusField = project.fields.nodes?.find(
    (f) => f?.__typename === 'ProjectV2SingleSelectField' && f.name === 'Status'
  ) ?? project.fields.nodes?.find((f) => f?.__typename === 'ProjectV2SingleSelectField')

  if (!statusField || statusField.__typename !== 'ProjectV2SingleSelectField') {
    return <div className="page"><p>No status field found in this project.</p></div>
  }

  const columns = statusField.options

  const allRawItems: RawItem[] = [
    ...((project.items.nodes ?? []).filter(Boolean) as unknown as RawItem[]),
    ...extraItems,
  ]

  const allCards: CardData[] = allRawItems.flatMap((item) => {
    const card = rawItemToCard(item)
    return card ? [card] : []
  })

  const itemColumnMap: Record<string, string | null> = {}
  for (const item of allRawItems) {
    const statusValue = item.fieldValues.nodes?.find(
      (fv) => fv?.__typename === 'ProjectV2ItemFieldSingleSelectValue' &&
        fv.field && 'id' in fv.field && fv.field.id === statusField.id
    )
    const optionId = statusValue?.__typename === 'ProjectV2ItemFieldSingleSelectValue'
      ? statusValue.optionId ?? null : null
    itemColumnMap[item.id] = pending[item.id] ?? optionId
  }

  const noStatusCards: CardData[] = []
  const cardsByColumn: Record<string, CardData[]> = {}
  for (const col of columns) {
    if (col) cardsByColumn[col.id] = []
  }
  for (const card of allCards) {
    const colId = itemColumnMap[card.id]
    if (colId && cardsByColumn[colId]) cardsByColumn[colId].push(card)
    else if (!colId) noStatusCards.push(card)
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
        <h1 className="board-title">
          {project.title}
          {isFetchingMore && (
            <span className="board-title-loading">
              {' '}({allRawItems.length}/{project.items.totalCount})
            </span>
          )}
        </h1>
      </div>

      <div className="board-body">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="board-columns" ref={columnsRef} onWheel={onColumnsWheel}>
            {noStatusCards.length > 0 && (
              <KanbanColumn
                id="__no_status__"
                title="No Status"
                color="GRAY"
                cards={noStatusCards}
                onSelect={handleSelect}
                droppable={false}
              />
            )}
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
