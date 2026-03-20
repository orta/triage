/**
 * @generated SignedSource<<a1f408d8f054729fbdbac1b3a72b6783>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddAssigneeMutation$variables = {
  assignableId: string;
  assigneeIds: ReadonlyArray<string>;
};
export type AddAssigneeMutation$data = {
  readonly addAssigneesToAssignable: {
    readonly assignable: {
      readonly assignees?: {
        readonly nodes: ReadonlyArray<{
          readonly avatarUrl: string;
          readonly login: string;
        } | null | undefined> | null | undefined;
      };
      readonly id?: string;
    } | null | undefined;
  } | null | undefined;
};
export type AddAssigneeMutation = {
  response: AddAssigneeMutation$data;
  variables: AddAssigneeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "assignableId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "assigneeIds"
  }
],
v1 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "assignableId",
        "variableName": "assignableId"
      },
      {
        "kind": "Variable",
        "name": "assigneeIds",
        "variableName": "assigneeIds"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": (v3/*: any*/),
    "concreteType": "UserConnection",
    "kind": "LinkedField",
    "name": "assignees",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": "assignees(first:10)"
  }
],
v7 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": (v3/*: any*/),
    "concreteType": "UserConnection",
    "kind": "LinkedField",
    "name": "assignees",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": "assignees(first:10)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddAssigneeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssigneesToAssignablePayload",
        "kind": "LinkedField",
        "name": "addAssigneesToAssignable",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "assignable",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": (v6/*: any*/),
                "type": "Issue",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v6/*: any*/),
                "type": "PullRequest",
                "abstractKey": null
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddAssigneeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AddAssigneesToAssignablePayload",
        "kind": "LinkedField",
        "name": "addAssigneesToAssignable",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "assignable",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v7/*: any*/),
                "type": "Issue",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v7/*: any*/),
                "type": "PullRequest",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/)
                ],
                "type": "Node",
                "abstractKey": "__isNode"
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
    "cacheID": "06e31f7702700244544d8d1f4e851abd",
    "id": null,
    "metadata": {},
    "name": "AddAssigneeMutation",
    "operationKind": "mutation",
    "text": "mutation AddAssigneeMutation(\n  $assignableId: ID!\n  $assigneeIds: [ID!]!\n) {\n  addAssigneesToAssignable(input: {assignableId: $assignableId, assigneeIds: $assigneeIds}) {\n    assignable {\n      __typename\n      ... on Issue {\n        id\n        assignees(first: 10) {\n          nodes {\n            login\n            avatarUrl\n            id\n          }\n        }\n      }\n      ... on PullRequest {\n        id\n        assignees(first: 10) {\n          nodes {\n            login\n            avatarUrl\n            id\n          }\n        }\n      }\n      ... on Node {\n        __isNode: __typename\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "09971f9902fa8db517a82da9f92f0311";

export default node;
