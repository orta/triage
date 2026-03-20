import { graphql } from 'relay-runtime'

export const moveCardMutation = graphql`
  mutation MoveCardMutation(
    $projectId: ID!
    $itemId: ID!
    $fieldId: ID!
    $optionId: String!
  ) {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { singleSelectOptionId: $optionId }
      }
    ) {
      projectV2Item {
        id
        fieldValues(first: 10) {
          nodes {
            __typename
            ... on ProjectV2ItemFieldSingleSelectValue {
              optionId
              field {
                ... on ProjectV2FieldCommon {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`
