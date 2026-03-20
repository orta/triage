import { useState, useCallback } from 'react'
import './DeviceFlowScreen.css'

const TOKEN_URL =
  'https://github.com/settings/tokens/new?description=Triage&scopes=read%3Aorg%2Crepo%2Cproject'

interface Props {
  onSuccess: (token: string) => void
}

export function PATScreen({ onSuccess }: Props) {
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)

  const submit = useCallback(async () => {
    const t = token.trim()
    if (!t) return

    setValidating(true)
    setError(null)

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `bearer ${t}` },
      })
      if (!res.ok) {
        setError('Token rejected by GitHub — check the scopes and try again.')
        return
      }
    } catch {
      setError('Could not reach GitHub — check your connection.')
      return
    } finally {
      setValidating(false)
    }

    onSuccess(t)
  }, [token, onSuccess])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') submit()
    },
    [submit]
  )

  return (
    <div className="device-flow">
      <div className="device-flow__card">
        <GitHubMark />
        <h1>Sign in to GitHub</h1>

        <p>
          Create a{' '}
          <a href={TOKEN_URL} target="_blank" rel="noreferrer">
            Personal Access Token
          </a>{' '}
          with <code>read:org</code>, <code>repo</code>, and <code>project</code> scopes, then
          paste it below.
        </p>

        <p className="device-flow__hint">Your token is only stored in your browser — it never leaves your machine.</p>

        <input
          className="device-flow__input"
          type="password"
          placeholder="github_pat_…"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />

        {error && <p className="device-flow__error">{error}</p>}

        <button
          className="device-flow__btn"
          onClick={submit}
          disabled={!token.trim() || validating}
        >
          {validating ? 'Checking…' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}

function GitHubMark() {
  return (
    <svg className="device-flow__logo" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  )
}
