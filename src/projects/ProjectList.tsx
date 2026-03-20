import { useLazyLoadQuery } from 'react-relay'
import { graphql } from 'relay-runtime'
import { useLocation } from 'wouter'
import { useState } from 'react'
import type { ProjectListQuery as ProjectListQueryType } from '../__generated__/ProjectListQuery.graphql'
import './ProjectList.css'

const query = graphql`
  query ProjectListQuery($org: String!) {
    organization(login: $org) {
      name
      avatarUrl
      projectsV2(first: 20) {
        nodes {
          id
          number
          title
          shortDescription
          closed
          updatedAt
          items {
            totalCount
          }
        }
      }
    }
  }
`

interface Props {
  org: string
}

export function ProjectList({ org }: Props) {
  const data = useLazyLoadQuery<ProjectListQueryType>(query, { org })
  const [, navigate] = useLocation()
  const [lastProject, setLastProject] = useState(() =>
    localStorage.getItem(`last_project_${org}`)
  )

  const projects = (data.organization?.projectsV2.nodes ?? [])
    .filter((p) => p && !p.closed)
    .sort((a, b) => {
      if (String(a?.number) === lastProject) return -1
      if (String(b?.number) === lastProject) return 1
      return new Date(b?.updatedAt ?? 0).getTime() - new Date(a?.updatedAt ?? 0).getTime()
    })

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {data.organization?.avatarUrl && (
            <img
              src={data.organization.avatarUrl}
              alt={org}
              style={{ width: 28, height: 28, borderRadius: 6 }}
            />
          )}
          <h1>{data.organization?.name ?? org}</h1>
        </div>
        <button className="back-link" onClick={() => navigate('/orgs')}>
          ← All organizations
        </button>
      </div>

      {projects.length === 0 && (
        <p style={{ color: '#6e7681' }}>No open projects found.</p>
      )}

      <div className="project-grid">
        {projects.map((project) => {
          if (!project) return null
          return (
            <button
              key={project.id}
              className={`project-card${String(project.number) === lastProject ? ' project-card--last' : ''}`}
              onClick={() => {
                localStorage.setItem(`last_project_${org}`, String(project.number))
                setLastProject(String(project.number))
                navigate(`/orgs/${org}/projects/${project.number}`)
              }}
            >
              <div className="project-card__title">{project.title}</div>
              {project.shortDescription && (
                <div className="project-card__desc">{project.shortDescription}</div>
              )}
              <div className="project-card__meta">
                <span>{project.items.totalCount} items</span>
                <span>Updated {formatDate(project.updatedAt)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
