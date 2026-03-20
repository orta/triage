import { graphql } from 'relay-runtime'

export const addAssigneeMutation = graphql`
  mutation AddAssigneeMutation($assignableId: ID!, $assigneeIds: [ID!]!) {
    addAssigneesToAssignable(input: { assignableId: $assignableId, assigneeIds: $assigneeIds }) {
      assignable {
        ... on Issue {
          id
          assignees(first: 10) {
            nodes {
              login
              avatarUrl
            }
          }
        }
        ... on PullRequest {
          id
          assignees(first: 10) {
            nodes {
              login
              avatarUrl
            }
          }
        }
      }
    }
  }
`
