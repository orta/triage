import { useLazyLoadQuery } from 'react-relay'
import { graphql } from 'relay-runtime'
import { useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import type { OrgPickerQuery as OrgPickerQueryType } from '../__generated__/OrgPickerQuery.graphql'
import './OrgPicker.css'

const query = graphql`
  query OrgPickerQuery {
    viewer {
      login
      avatarUrl
    }
  }
`

interface Org {
  login: string
  avatar_url: string
  description: string | null
}

interface Props {
  onSignOut: () => void
}

export function OrgPicker({ onSignOut }: Props) {
  const data = useLazyLoadQuery<OrgPickerQueryType>(query, {})
  const [, navigate] = useLocation()
  const [orgs, setOrgs] = useState<Org[]>([])
  const [lastOrg, setLastOrg] = useState(() => localStorage.getItem('last_org'))

  useEffect(() => {
    localStorage.setItem('github_viewer_login', data.viewer.login)
    localStorage.setItem('github_viewer_avatar', data.viewer.avatarUrl)
  }, [data.viewer.login, data.viewer.avatarUrl])

  useEffect(() => {
    const token = localStorage.getItem('github_token')
    fetch('https://api.github.com/user/orgs?per_page=100', {
      headers: { Authorization: `bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: Org[]) =>
        setOrgs(data.sort((a, b) => {
          if (a.login === lastOrg) return -1
          if (b.login === lastOrg) return 1
          return 0
        }))
      )
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Organizations</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={data.viewer.avatarUrl}
            alt={data.viewer.login}
            style={{ width: 28, height: 28, borderRadius: '50%' }}
          />
          <span style={{ color: '#8b949e', fontSize: 13 }}>{data.viewer.login}</span>
          <button className="btn-ghost" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="org-grid">
        {orgs.map((org) => (
          <button
            key={org.login}
            className={`org-card${org.login === lastOrg ? ' org-card--last' : ''}`}
            onClick={() => {
              localStorage.setItem('last_org', org.login)
              setLastOrg(org.login)
              navigate(`/orgs/${org.login}/projects`)
            }}
          >
            <img src={org.avatar_url} alt={org.login} className="org-card__avatar" />
            <span className="org-card__name">{org.login}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
