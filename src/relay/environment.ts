import { Environment, Network, RecordSource, Store, type FetchFunction } from 'relay-runtime'

const fetchFn: FetchFunction = (operation, variables) => {
  const token = localStorage.getItem('github_token')
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query: operation.text, variables }),
  }).then((r) => r.json())
}

export const environment = new Environment({
  network: Network.create(fetchFn),
  store: new Store(new RecordSource()),
})
