import { graphql } from 'relay-runtime'

export const closeIssueMutation = graphql`
  mutation CloseIssueMutation($id: ID!) {
    closeIssue(input: { issueId: $id }) {
      issue {
        id
        issueState: state
      }
    }
  }
`
