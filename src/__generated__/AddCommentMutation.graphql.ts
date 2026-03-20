/**
 * @generated SignedSource<<47254e14a42294343911e9e5a5876c9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddCommentMutation$variables = {
  body: string;
  subjectId: string;
};
export type AddCommentMutation$data = {
  readonly addComment: {
    readonly commentEdge: {
      readonly node: {
        readonly id: string;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type AddCommentMutation = {
  response: AddCommentMutation$data;
  variables: AddCommentMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "body"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "subjectId"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "body",
            "variableName": "body"
          },
          {
            "kind": "Variable",
            "name": "subjectId",
            "variableName": "subjectId"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "AddCommentPayload",
    "kind": "LinkedField",
    "name": "addComment",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "IssueCommentEdge",
        "kind": "LinkedField",
        "name": "commentEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IssueComment",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AddCommentMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AddCommentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "52c34e172261691d3be6fc7129871808",
    "id": null,
    "metadata": {},
    "name": "AddCommentMutation",
    "operationKind": "mutation",
    "text": "mutation AddCommentMutation(\n  $subjectId: ID!\n  $body: String!\n) {\n  addComment(input: {subjectId: $subjectId, body: $body}) {\n    commentEdge {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ac9d26a31313b0f02bec0a3d8ca595eb";

export default node;
