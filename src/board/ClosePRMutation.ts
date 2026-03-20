import { graphql } from 'relay-runtime'

export const closePRMutation = graphql`
  mutation ClosePRMutation($id: ID!) {
    closePullRequest(input: { pullRequestId: $id }) {
      pullRequest {
        id
        prState: state
      }
    }
  }
`
