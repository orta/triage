import { graphql } from 'relay-runtime'

export const addCommentMutation = graphql`
  mutation AddCommentMutation($subjectId: ID!, $body: String!) {
    addComment(input: { subjectId: $subjectId, body: $body }) {
      commentEdge {
        node {
          id
        }
      }
    }
  }
`
