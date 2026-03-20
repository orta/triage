import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useMutation } from 'react-relay'
import type { CardData } from './KanbanCard'
import { addCommentMutation } from './AddCommentMutation'
import { addAssigneeMutation } from './AddAssigneeMutation'
import { closeIssueMutation } from './CloseIssueMutation'
import { closePRMutation } from './ClosePRMutation'
import type { AddCommentMutation as AddCommentMutationType } from '../__generated__/AddCommentMutation.graphql'
import type { AddAssigneeMutation as AddAssigneeMutationType } from '../__generated__/AddAssigneeMutation.graphql'
import type { CloseIssueMutation as CloseIssueMutationType } from '../__generated__/CloseIssueMutation.graphql'
import type { ClosePRMutation as ClosePRMutationType } from '../__generated__/ClosePRMutation.graphql'
import './CardSidebar.css'

interface RawTimelineEvent {
  id?: number
  event: string
  actor?: { login: string; avatar_url: string }
  created_at: string
  body_html?: string
  body?: string
  html_url?: string
  assignee?: { login: string; avatar_url: string }
  label?: { name: string; color: string }
  project_card?: { column_name: string; previous_column_name?: string; project_name?: string }
  rename?: { from: string; to: string }
  source?: { type: string; issue?: { number: number; title: string; html_url: string; pull_request?: object } }
}

const RELEVANT_EVENTS = new Set([
  'commented', 'assigned', 'unassigned', 'labeled', 'unlabeled',
  'moved_columns_in_project', 'added_to_project', 'closed', 'reopened', 'renamed',
  'cross-referenced',
])

function parseRepoFromUrl(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2], number: parseInt(match[4]) }
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDay = Math.floor(diffMs / 86400000)
  if (diffDay > 30) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (diffDay > 0) return `${diffDay}d ago`
  const diffHour = Math.floor(diffMs / 3600000)
  if (diffHour > 0) return `${diffHour}h ago`
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin > 0) return `${diffMin}m ago`
  return 'just now'
}

type CrossRef = { number: number; title: string; html_url: string; isPR: boolean }
type DisplayEvent =
  | (RawTimelineEvent & { _type: 'single' })
  | { _type: 'labels'; actor?: { login: string; avatar_url: string }; created_at: string; added: Array<{ name: string; color: string }>; removed: Array<{ name: string; color: string }> }
  | { _type: 'cross-refs'; actor?: { login: string; avatar_url: string }; created_at: string; refs: CrossRef[] }

function processTimelineEvents(events: RawTimelineEvent[]): DisplayEvent[] {
  // Deduplicate consecutive project moves (keep only last)
  const deduped = events.filter((event, i) => {
    if (event.event !== 'moved_columns_in_project') return true
    const next = events[i + 1]
    return !next || next.event !== 'moved_columns_in_project'
  })

  // Consolidate consecutive labeled/unlabeled and cross-referenced events from the same actor
  const result: DisplayEvent[] = []
  let i = 0
  while (i < deduped.length) {
    const event = deduped[i]

    if (event.event === 'cross-referenced' && event.source?.issue) {
      const actorLogin = event.actor?.login
      const refs: CrossRef[] = []
      while (i < deduped.length && deduped[i].event === 'cross-referenced' && deduped[i].actor?.login === actorLogin) {
        const e = deduped[i]
        if (e.source?.issue) {
          refs.push({ number: e.source.issue.number, title: e.source.issue.title, html_url: e.source.issue.html_url, isPR: !!e.source.issue.pull_request })
        }
        i++
      }
      result.push({ _type: 'cross-refs', actor: event.actor, created_at: event.created_at, refs })
      continue
    }

    if (event.event !== 'labeled' && event.event !== 'unlabeled') {
      result.push({ ...event, _type: 'single' })
      i++
      continue
    }
    const actorLogin = event.actor?.login
    const added: Array<{ name: string; color: string }> = []
    const removed: Array<{ name: string; color: string }> = []
    let lastCreatedAt = event.created_at
    while (
      i < deduped.length &&
      (deduped[i].event === 'labeled' || deduped[i].event === 'unlabeled') &&
      deduped[i].actor?.login === actorLogin
    ) {
      const e = deduped[i]
      if (e.label) {
        if (e.event === 'labeled') added.push(e.label)
        else removed.push(e.label)
      }
      lastCreatedAt = e.created_at
      i++
    }
    result.push({ _type: 'labels', actor: event.actor, created_at: lastCreatedAt, added, removed })
  }
  return result
}

const STORAGE_KEY = 'sidebar_width_fraction'
const DEFAULT_FRACTION = 0.3
const MIN_WIDTH = 240
const MAX_FRACTION = 0.65

function useResizableWidth() {
  const [width, setWidth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const fraction = stored ? parseFloat(stored) : DEFAULT_FRACTION
    return Math.round(window.innerWidth * fraction)
  })
  const widthRef = useRef(width)
  useEffect(() => { widthRef.current = width }, [width])

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = widthRef.current

    const onMove = (e: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, Math.min(window.innerWidth * MAX_FRACTION, startWidth + startX - e.clientX))
      setWidth(Math.round(newWidth))
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      localStorage.setItem(STORAGE_KEY, String(widthRef.current / window.innerWidth))
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  return { width, startResize }
}

interface OrgMember {
  login: string
  avatarUrl: string
  nodeId: string
}

export interface ColumnOption {
  id: string
  name: string
  color: string
}

interface Props {
  card: CardData
  onClose: () => void
  columns: ColumnOption[]
  currentColumnId: string | null
  onMove: (itemId: string, toColumnId: string) => void
  org: string
  allCards: CardData[]
}

export function CardSidebar({ card, onClose, columns, currentColumnId, onMove, org, allCards }: Props) {
  const { width, startResize } = useResizableWidth()
  const [commitComment, isCommentInFlight] = useMutation<AddCommentMutationType>(addCommentMutation)
  const [commitAddAssignee] = useMutation<AddAssigneeMutationType>(addAssigneeMutation)
  const [commitCloseIssue, isCloseIssueFlight] = useMutation<CloseIssueMutationType>(closeIssueMutation)
  const [commitClosePR, isClosePRFlight] = useMutation<ClosePRMutationType>(closePRMutation)
  const [commentBody, setCommentBody] = useState('')
  const [commentError, setCommentError] = useState<string | null>(null)
  const [optimisticComment, setOptimisticComment] = useState<string | null>(null)
  const [localAssignees, setLocalAssignees] = useState(card.assignees)
  const [showPopover, setShowPopover] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([])
  const [isFetchingMembers, setIsFetchingMembers] = useState(false)
  const [bodyScrolled, setBodyScrolled] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState<DisplayEvent[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionResults, setMentionResults] = useState<Array<{ number: number; title: string; pull_request?: unknown }>>([])
  const [mentionIndex, setMentionIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const mentionDropdownRef = useRef<HTMLDivElement>(null)

  const isClosing = isCloseIssueFlight || isClosePRFlight
  const canClose = card.contentId && (card.typename === 'Issue' || card.typename === 'PullRequest') && card.state === 'OPEN'

  // Sync local assignees when switching cards
  useEffect(() => {
    setLocalAssignees(card.assignees)
  }, [card.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch timeline events when card changes
  useEffect(() => {
    if (!card.url) { setTimelineEvents([]); return }
    const repoInfo = parseRepoFromUrl(card.url)
    if (!repoInfo) { setTimelineEvents([]); return }
    const token = localStorage.getItem('github_token')
    setTimelineLoading(true)
    setTimelineEvents([])
    fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/issues/${repoInfo.number}/timeline?per_page=100`,
      { headers: { Authorization: `bearer ${token}`, Accept: 'application/vnd.github.full+json' } }
    )
      .then((res) => res.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) return
        const filtered = (data as RawTimelineEvent[]).filter((e) => RELEVANT_EVENTS.has(e.event))
        setTimelineEvents(processTimelineEvents(filtered))
      })
      .finally(() => setTimelineLoading(false))
  }, [card.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close popover on outside click
  useEffect(() => {
    if (!showPopover) return
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false)
        setMemberSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPopover])

  // Focus search when popover opens
  useEffect(() => {
    if (showPopover) searchRef.current?.focus()
  }, [showPopover])

  const assigneeCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of allCards) {
      for (const a of c.assignees) {
        counts.set(a.login, (counts.get(a.login) ?? 0) + 1)
      }
    }
    return counts
  }, [allCards])

  const openPopover = useCallback(async () => {
    setShowPopover(true)
    if (orgMembers.length > 0 || isFetchingMembers) return
    setIsFetchingMembers(true)
    try {
      const token = localStorage.getItem('github_token')
      const res = await fetch(`https://api.github.com/orgs/${org}/members?per_page=100`, {
        headers: { Authorization: `bearer ${token}` },
      })
      const data = await res.json()
      setOrgMembers(
        Array.isArray(data)
          ? data.map((m: { login: string; avatar_url: string; node_id: string }) => ({
              login: m.login,
              avatarUrl: m.avatar_url,
              nodeId: m.node_id,
            }))
          : []
      )
    } finally {
      setIsFetchingMembers(false)
    }
  }, [org, orgMembers.length, isFetchingMembers])

  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase()
    return orgMembers
      .filter((m) => !localAssignees.some((a) => a.login === m.login))
      .filter((m) => !q || m.login.toLowerCase().includes(q))
      .sort((a, b) => {
        const ca = assigneeCounts.get(a.login) ?? 0
        const cb = assigneeCounts.get(b.login) ?? 0
        if (cb !== ca) return cb - ca
        return a.login.localeCompare(b.login)
      })
  }, [orgMembers, memberSearch, localAssignees, assigneeCounts])

  const addAssignee = useCallback((member: OrgMember) => {
    if (!card.contentId) return
    setShowPopover(false)
    setMemberSearch('')
    setLocalAssignees((prev) => [...prev, { login: member.login, avatarUrl: member.avatarUrl }])
    commitAddAssignee({
      variables: { assignableId: card.contentId, assigneeIds: [member.nodeId] },
      onError() {
        setLocalAssignees((prev) => prev.filter((a) => a.login !== member.login))
        setCommentError('Failed to add assignee — check your token has write access.')
      },
    })
  }, [card.contentId, commitAddAssignee])

  const doClose = useCallback(() => {
    if (!card.contentId) return
    const onError = () => setCommentError('Failed to close — check your token has write access.')
    if (card.typename === 'Issue') {
      commitCloseIssue({ variables: { id: card.contentId }, onError })
    } else {
      commitClosePR({ variables: { id: card.contentId }, onError })
    }
  }, [card.contentId, card.typename, commitCloseIssue, commitClosePR])

  const pollForComment = useCallback(async (commentedCountBefore: number) => {
    if (!card.url) return
    const repoInfo = parseRepoFromUrl(card.url)
    if (!repoInfo) return
    const token = localStorage.getItem('github_token')
    let lastFiltered: RawTimelineEvent[] = []
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const res = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/issues/${repoInfo.number}/timeline?per_page=100`,
        { headers: { Authorization: `bearer ${token}`, Accept: 'application/vnd.github.full+json' } }
      )
      const data = await res.json()
      if (!Array.isArray(data)) break
      lastFiltered = (data as RawTimelineEvent[]).filter((e) => RELEVANT_EVENTS.has(e.event))
      const commentedCount = lastFiltered.filter((e) => e.event === 'commented').length
      if (commentedCount > commentedCountBefore) {
        setTimelineEvents(processTimelineEvents(lastFiltered))
        setOptimisticComment(null)
        return
      }
    }
    // Gave up waiting — show whatever we have and clear the ghost
    if (lastFiltered.length > 0) setTimelineEvents(processTimelineEvents(lastFiltered))
    setOptimisticComment(null)
  }, [card.url])

  const submitComment = useCallback((andClose = false) => {
    if (!card.contentId) return
    setCommentError(null)
    const body = commentBody.trim()
    if (body) {
      const commentedCountBefore = timelineEvents.filter((e) => e._type === 'single' && e.event === 'commented').length
      setOptimisticComment(body)
      setCommentBody('')
      commitComment({
        variables: { subjectId: card.contentId, body },
        onCompleted() {
          if (andClose) {
            doClose()
          } else {
            pollForComment(commentedCountBefore)
          }
        },
        onError() {
          setOptimisticComment(null)
          setCommentBody(body)
          setCommentError('Failed to post comment — check your token has write access.')
        },
      })
    } else if (andClose) {
      doClose()
    }
  }, [card.contentId, commentBody, commitComment, doClose, pollForComment, timelineEvents])

  // Detect #query at cursor and fetch matching issues/PRs
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || !card.url) return
    const repoInfo = parseRepoFromUrl(card.url)
    if (!repoInfo) return

    const cursor = textarea.selectionStart
    const textBefore = commentBody.slice(0, cursor)
    const match = textBefore.match(/#(\w*)$/)
    if (!match) { setMentionQuery(null); setMentionResults([]); return }

    const q = match[1]
    setMentionQuery(q)
    setMentionIndex(0)

    const token = localStorage.getItem('github_token')
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const url = q
          ? `https://api.github.com/search/issues?q=${encodeURIComponent(q)}+repo:${repoInfo.owner}/${repoInfo.repo}&per_page=7`
          : `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/issues?state=open&per_page=7`
        const res = await fetch(url, { headers: { Authorization: `bearer ${token}` }, signal: controller.signal })
        const data = await res.json()
        const items = q ? (data.items ?? []) : data
        setMentionResults(Array.isArray(items) ? items.slice(0, 7) : [])
      } catch { /* aborted or failed */ }
    }, 150)

    return () => { clearTimeout(timer); controller.abort() }
  }, [commentBody, card.url]) // eslint-disable-line react-hooks/exhaustive-deps

  const insertMention = useCallback((number: number) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const cursor = textarea.selectionStart
    const before = commentBody.slice(0, cursor)
    const after = commentBody.slice(cursor)
    const replaced = before.replace(/#(\w*)$/, `#${number}`)
    setCommentBody(replaced + after)
    setMentionQuery(null)
    setMentionResults([])
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = replaced.length
    })
  }, [commentBody])

  const onCommentKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (mentionResults.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex((i) => (i + 1) % mentionResults.length); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setMentionIndex((i) => (i - 1 + mentionResults.length) % mentionResults.length); return }
      if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); insertMention(mentionResults[mentionIndex].number); return }
      if (e.key === 'Escape') { setMentionQuery(null); setMentionResults([]); return }
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitComment(false)
  }, [submitComment, mentionResults, mentionIndex, insertMention])

  useEffect(() => {
    if (card.contentId) textareaRef.current?.focus()
  }, [card.id, card.contentId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const onScroll = () => setBodyScrolled(el.scrollTop > 40)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <aside className="card-sidebar" style={{ width }}>
      <div className="card-sidebar__resize-handle" onMouseDown={startResize} />

      <div className="card-sidebar__header">
        <div className="card-sidebar__meta">
          {card.number !== undefined && (
            <span className="card-sidebar__number">
              {card.typename === 'PullRequest' ? 'PR' : '#'}{card.number}
            </span>
          )}
          {card.state && (
            <span className={`card-sidebar__state card-sidebar__state--${card.state.toLowerCase()}`}>
              {card.state}
            </span>
          )}
          {bodyScrolled && (
            card.url
              ? <a className="card-sidebar__header-title" href={card.url} target="_blank" rel="noreferrer">{card.title}</a>
              : <span className="card-sidebar__header-title">{card.title}</span>
          )}
        </div>
        <button className="card-sidebar__close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="card-sidebar__body" ref={bodyRef}>
        <h2 className="card-sidebar__title">
          {card.url ? (
            <a href={card.url} target="_blank" rel="noreferrer">{card.title}</a>
          ) : (
            card.title
          )}
        </h2>

        {(card.labels.length > 0 || card.author) && (
          <div className="card-sidebar__meta-row">
            <div className="card-sidebar__labels">
              {card.labels.map((label) => (
                <span
                  key={label.name}
                  className="card-sidebar__label"
                  style={{
                    background: `#${label.color}22`,
                    color: `#${label.color}`,
                    borderColor: `#${label.color}44`,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
            {card.author && (
              <div className="card-sidebar__author">
                <span className="card-sidebar__author-label">by</span>
                <img src={card.author.avatarUrl} alt={card.author.login} />
                <span>{card.author.login}</span>
              </div>
            )}
          </div>
        )}

        <div className={`card-sidebar__section${card.labels.length === 0 && card.author ? ' card-sidebar__section--pull-up' : ''}`}>
          <div className="card-sidebar__section-label">
            Assignees
            {card.contentId && (
              <div className="card-sidebar__assignee-add" ref={popoverRef}>
                <button
                  className="card-sidebar__add-btn"
                  onClick={openPopover}
                  aria-label="Add assignee"
                >
                  +
                </button>
                {showPopover && (
                  <div className="card-sidebar__popover">
                    <input
                      ref={searchRef}
                      className="card-sidebar__popover-search"
                      placeholder="Filter members…"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && filteredMembers.length > 0) addAssignee(filteredMembers[0])
                      }}
                    />
                    <div className="card-sidebar__popover-list">
                      {isFetchingMembers ? (
                        <div className="card-sidebar__popover-empty">Loading…</div>
                      ) : filteredMembers.length === 0 ? (
                        <div className="card-sidebar__popover-empty">No members found</div>
                      ) : (
                        filteredMembers.map((m) => (
                          <button
                            key={m.login}
                            className="card-sidebar__popover-item"
                            onClick={() => addAssignee(m)}
                          >
                            <img src={m.avatarUrl} alt={m.login} />
                            <span className="card-sidebar__popover-login">{m.login}</span>
                            {(assigneeCounts.get(m.login) ?? 0) > 0 && (
                              <span className="card-sidebar__popover-count">
                                {assigneeCounts.get(m.login)}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {localAssignees.length > 0 ? (
            <div className="card-sidebar__assignees">
              {localAssignees.map((a) => (
                <div key={a.login} className="card-sidebar__assignee">
                  <img src={a.avatarUrl} alt={a.login} />
                  <span>{a.login}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="card-sidebar__empty">No assignee</span>
          )}
        </div>

        {card.bodyHTML ? (
          <div className="card-sidebar__section">
            <div className="card-sidebar__section-label">Description</div>
            <div
              className="card-sidebar__content"
              dangerouslySetInnerHTML={{ __html: card.bodyHTML }}
            />
          </div>
        ) : (
          <p className="card-sidebar__empty">No description.</p>
        )}

        {(timelineLoading || timelineEvents.length > 0 || optimisticComment) && (
          <div className="card-sidebar__section">
            <div className="card-sidebar__section-label">Activity</div>
            {timelineLoading && timelineEvents.length === 0 && !optimisticComment && (
              <span className="card-sidebar__empty">Loading…</span>
            )}
            <div className="card-sidebar__timeline">
              {timelineEvents.map((event, i) => {
                if (event._type === 'labels') {
                  const labelChip = (l: { name: string; color: string }) => (
                    <span key={l.name} className="card-sidebar__label card-sidebar__label--inline" style={{ background: `#${l.color}22`, color: `#${l.color}`, borderColor: `#${l.color}44` }}>
                      {l.name}
                    </span>
                  )
                  const text = (
                    <>
                      <strong>{event.actor?.login}</strong>
                      {event.added.length > 0 && <> added {event.added.map(labelChip)}</>}
                      {event.added.length > 0 && event.removed.length > 0 && ', '}
                      {event.removed.length > 0 && <> removed {event.removed.map(labelChip)}</>}
                    </>
                  )
                  return (
                    <div key={i} className="card-sidebar__timeline-event">
                      {event.actor && <img src={event.actor.avatar_url} alt={event.actor.login} />}
                      <span className="card-sidebar__timeline-event-text">{text}</span>
                      <span className="card-sidebar__timeline-time">{formatRelativeTime(event.created_at)}</span>
                    </div>
                  )
                }

                if (event._type === 'cross-refs') {
                  const prCount = event.refs.filter((r) => r.isPR).length
                  const issueCount = event.refs.length - prCount
                  const parts = [prCount > 0 && `${prCount} pull request${prCount > 1 ? 's' : ''}`, issueCount > 0 && `${issueCount} issue${issueCount > 1 ? 's' : ''}`].filter(Boolean).join(' and ')
                  return (
                    <div key={i} className="card-sidebar__timeline-event card-sidebar__timeline-event--cross-refs">
                      {event.actor && <img src={event.actor.avatar_url} alt={event.actor.login} />}
                      <span className="card-sidebar__timeline-event-text">
                        <strong>{event.actor?.login}</strong> mentioned this in {parts}
                        <span className="card-sidebar__cross-refs">
                          {event.refs.map((ref) => (
                            <a key={ref.html_url} href={ref.html_url} target="_blank" rel="noreferrer" className="card-sidebar__cross-ref-link">
                              <span className="card-sidebar__cross-ref-icon">{ref.isPR ? '⎇' : '#'}</span>
                              {ref.title} <span className="card-sidebar__cross-ref-number">#{ref.number}</span>
                            </a>
                          ))}
                        </span>
                      </span>
                      <span className="card-sidebar__timeline-time">{formatRelativeTime(event.created_at)}</span>
                    </div>
                  )
                }

                // event._type === 'single' from here
                if (event.event === 'commented') {
                  return (
                    <div key={event.id ?? i} className="card-sidebar__timeline-comment">
                      <div className="card-sidebar__timeline-comment-header">
                        {event.actor && <img src={event.actor.avatar_url} alt={event.actor.login} />}
                        <span className="card-sidebar__timeline-actor">{event.actor?.login}</span>
                        <span className="card-sidebar__timeline-time">{formatRelativeTime(event.created_at)}</span>
                      </div>
                      {(event.body_html || event.body) && (
                        <div
                          className="card-sidebar__timeline-comment-body card-sidebar__content"
                          dangerouslySetInnerHTML={{ __html: event.body_html ?? event.body ?? '' }}
                        />
                      )}
                    </div>
                  )
                }

                let text: React.ReactNode = null
                if (event.event === 'assigned') {
                  text = <><strong>{event.actor?.login}</strong> assigned <strong>{event.assignee?.login}</strong></>
                } else if (event.event === 'unassigned') {
                  text = <><strong>{event.actor?.login}</strong> unassigned <strong>{event.assignee?.login}</strong></>
                } else if (event.event === 'moved_columns_in_project') {
                  text = <><strong>{event.actor?.login}</strong> moved this from <em>{event.project_card?.previous_column_name ?? '?'}</em> to <em>{event.project_card?.column_name}</em>{event.project_card?.project_name && <> in {event.project_card.project_name}</>}</>
                } else if (event.event === 'added_to_project') {
                  text = <><strong>{event.actor?.login}</strong> added to <em>{event.project_card?.column_name}</em></>
                } else if (event.event === 'closed') {
                  text = <><strong>{event.actor?.login}</strong> closed this</>
                } else if (event.event === 'reopened') {
                  text = <><strong>{event.actor?.login}</strong> reopened this</>
                } else if (event.event === 'renamed') {
                  text = <><strong>{event.actor?.login}</strong> renamed from <em>{event.rename?.from}</em> to <em>{event.rename?.to}</em></>
                } else {
                  return null
                }

                return (
                  <div key={i} className="card-sidebar__timeline-event">
                    {event.actor && <img src={event.actor.avatar_url} alt={event.actor.login} />}
                    <span className="card-sidebar__timeline-event-text">{text}</span>
                    <span className="card-sidebar__timeline-time">{formatRelativeTime(event.created_at)}</span>
                  </div>
                )
              })}
              {optimisticComment && (
                <div className="card-sidebar__timeline-comment card-sidebar__timeline-comment--optimistic">
                  <div className="card-sidebar__timeline-comment-header">
                    {localStorage.getItem('github_viewer_avatar') && (
                      <img src={localStorage.getItem('github_viewer_avatar')!} alt="you" />
                    )}
                    <span className="card-sidebar__timeline-actor">{localStorage.getItem('github_viewer_login') ?? 'you'}</span>
                    <span className="card-sidebar__timeline-time">just now</span>
                  </div>
                  <div className="card-sidebar__timeline-comment-body card-sidebar__content card-sidebar__timeline-comment-body--pending">
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{optimisticComment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {card.contentId && (
          <div className="card-sidebar__section">
            <div className="card-sidebar__section-label">Leave a comment</div>
            <div className="card-sidebar__comment-wrap">
              <textarea
                ref={textareaRef}
                className="card-sidebar__comment-input"
                placeholder={`Write a comment… (${navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}+↵ to submit)`}
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                onKeyDown={onCommentKeyDown}
                disabled={isCommentInFlight}
                rows={4}
              />
              {mentionResults.length > 0 && (
                <div className="card-sidebar__mention-dropdown" ref={mentionDropdownRef}>
                  {mentionResults.map((item, i) => (
                    <button
                      key={item.number}
                      className={`card-sidebar__mention-item${i === mentionIndex ? ' card-sidebar__mention-item--active' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); insertMention(item.number) }}
                    >
                      <span className="card-sidebar__mention-number">#{item.number}</span>
                      <span className="card-sidebar__mention-title">{item.title}</span>
                      <span className="card-sidebar__mention-type">{item.pull_request ? 'PR' : 'Issue'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {commentError && <p className="card-sidebar__comment-error">{commentError}</p>}

            <div className="card-sidebar__comment-actions">
              {canClose && (
                <button
                  className="card-sidebar__comment-btn card-sidebar__comment-btn--close"
                  onClick={() => submitComment(true)}
                  disabled={!commentBody.trim() || isCommentInFlight || isClosing}
                >
                  {isClosing ? 'Closing…' : 'Comment & close'}
                </button>
              )}
              <button
                className="card-sidebar__comment-btn"
                onClick={() => submitComment(false)}
                disabled={!commentBody.trim() || isCommentInFlight || isClosing}
              >
                {isCommentInFlight ? 'Posting…' : 'Comment'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card-sidebar__toolbar">
        <label className="card-sidebar__toolbar-label" htmlFor="move-to">Move to</label>
        <select
          id="move-to"
          className="card-sidebar__select"
          value={currentColumnId ?? ''}
          onChange={(e) => onMove(card.id, e.target.value)}
        >
          {columns.map((col) => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
      </div>
    </aside>
  )
}
