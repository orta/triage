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
  widthRef.current = width

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
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [localAssignees, setLocalAssignees] = useState(card.assignees)
  const [showPopover, setShowPopover] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([])
  const [isFetchingMembers, setIsFetchingMembers] = useState(false)
  const [bodyScrolled, setBodyScrolled] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const isClosing = isCloseIssueFlight || isClosePRFlight
  const canClose = card.contentId && (card.typename === 'Issue' || card.typename === 'PullRequest') && card.state === 'OPEN'

  // Sync local assignees when switching cards
  useEffect(() => {
    setLocalAssignees(card.assignees)
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

  const submitComment = useCallback((andClose = false) => {
    if (!card.contentId) return
    setCommentError(null)
    const body = commentBody.trim()
    if (body) {
      commitComment({
        variables: { subjectId: card.contentId, body },
        onCompleted() {
          setCommentBody('')
          if (andClose) {
            doClose()
          } else {
            setCommentSuccess(true)
            setTimeout(() => setCommentSuccess(false), 3000)
          }
        },
        onError() {
          setCommentError('Failed to post comment — check your token has write access.')
        },
      })
    } else if (andClose) {
      doClose()
    }
  }, [card.contentId, commentBody, commitComment, doClose])

  const onCommentKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitComment(false)
  }, [submitComment])

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
            <span className="card-sidebar__header-title">{card.title}</span>
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

        <div className="card-sidebar__section">
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

        {card.contentId && (
          <div className="card-sidebar__section">
            <div className="card-sidebar__section-label">Leave a comment</div>
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
            {commentError && <p className="card-sidebar__comment-error">{commentError}</p>}
            {commentSuccess && <p className="card-sidebar__comment-success">Comment posted!</p>}
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
