import { useState, useCallback, Suspense } from 'react'
import { Switch, Route, Redirect, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { PATScreen } from './auth/PATScreen'
import { OrgPicker } from './orgs/OrgPicker'
import { ProjectList } from './projects/ProjectList'
import { KanbanBoard } from './board/KanbanBoard'
import './App.css'

function Loading() {
  return (
    <div className="loading">
      <div className="loading__spinner" />
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('github_token'))

  const handleAuth = useCallback((newToken: string) => {
    localStorage.setItem('github_token', newToken)
    setToken(newToken)
  }, [])

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('github_token')
    setToken(null)
  }, [])

  if (!token) {
    return <PATScreen onSuccess={handleAuth} />
  }

  return (
    <Router hook={useHashLocation}>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/orgs">
          <OrgPicker onSignOut={handleSignOut} />
        </Route>
        <Route path="/orgs/:org/projects/:number">
          {(params) => (
            <KanbanBoard org={params.org!} projectNumber={parseInt(params.number!, 10)} />
          )}
        </Route>
        <Route path="/orgs/:org/projects">
          {(params) => <ProjectList org={params.org!} />}
        </Route>
        <Route>
          <Redirect to="/orgs" />
        </Route>
      </Switch>
    </Suspense>
    </Router>
  )
}
