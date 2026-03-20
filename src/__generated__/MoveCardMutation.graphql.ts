/**
 * @generated SignedSource<<63fc285c87188cb3cffa6e3977c62d66>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MoveCardMutation$variables = {
  fieldId: string;
  itemId: string;
  optionId: string;
  projectId: string;
};
export type MoveCardMutation$data = {
  readonly updateProjectV2ItemFieldValue: {
    readonly projectV2Item: {
      readonly fieldValues: {
        readonly nodes: ReadonlyArray<{
          readonly __typename: "ProjectV2ItemFieldSingleSelectValue";
          readonly field: {
            readonly id?: string;
          };
          readonly optionId: string | null | undefined;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        } | null | undefined> | null | undefined;
      };
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type MoveCardMutation = {
  response: MoveCardMutation$data;
  variables: MoveCardMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fieldId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "itemId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "optionId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "projectId"
},
v4 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "fieldId",
        "variableName": "fieldId"
      },
      {
        "kind": "Variable",
        "name": "itemId",
        "variableName": "itemId"
      },
      {
        "kind": "Variable",
        "name": "projectId",
        "variableName": "projectId"
      },
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "singleSelectOptionId",
            "variableName": "optionId"
          }
        ],
        "kind": "ObjectValue",
        "name": "value"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "optionId",
  "storageKey": null
},
v9 = [
  (v5/*: any*/)
],
v10 = {
  "kind": "InlineFragment",
  "selections": (v9/*: any*/),
  "type": "ProjectV2FieldCommon",
  "abstractKey": "__isProjectV2FieldCommon"
},
v11 = {
  "kind": "InlineFragment",
  "selections": (v9/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MoveCardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "UpdateProjectV2ItemFieldValuePayload",
        "kind": "LinkedField",
        "name": "updateProjectV2ItemFieldValue",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ProjectV2Item",
            "kind": "LinkedField",
            "name": "projectV2Item",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "ProjectV2ItemFieldValueConnection",
                "kind": "LinkedField",
                "name": "fieldValues",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      (v7/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "field",
                            "plural": false,
                            "selections": [
                              (v10/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "ProjectV2ItemFieldSingleSelectValue",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "fieldValues(first:10)"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "MoveCardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "UpdateProjectV2ItemFieldValuePayload",
        "kind": "LinkedField",
        "name": "updateProjectV2ItemFieldValue",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ProjectV2Item",
            "kind": "LinkedField",
            "name": "projectV2Item",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "ProjectV2ItemFieldValueConnection",
                "kind": "LinkedField",
                "name": "fieldValues",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      (v7/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "field",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "ProjectV2ItemFieldSingleSelectValue",
                        "abstractKey": null
                      },
                      (v11/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "fieldValues(first:10)"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e9005df77c46a10ca52230c3aba68207",
    "id": null,
    "metadata": {},
    "name": "MoveCardMutation",
    "operationKind": "mutation",
    "text": "mutation MoveCardMutation(\n  $projectId: ID!\n  $itemId: ID!\n  $fieldId: ID!\n  $optionId: String!\n) {\n  updateProjectV2ItemFieldValue(input: {projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: {singleSelectOptionId: $optionId}}) {\n    projectV2Item {\n      id\n      fieldValues(first: 10) {\n        nodes {\n          __typename\n          ... on ProjectV2ItemFieldSingleSelectValue {\n            optionId\n            field {\n              __typename\n              ... on ProjectV2FieldCommon {\n                __isProjectV2FieldCommon: __typename\n                id\n              }\n              ... on Node {\n                __isNode: __typename\n                id\n              }\n            }\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cc9c14135a6484c55b8362794f40945f";

export default node;
