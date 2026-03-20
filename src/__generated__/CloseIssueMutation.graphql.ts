/**
 * @generated SignedSource<<803ee304ba25b34f1e5da228569e0387>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IssueState = "CLOSED" | "OPEN" | "%future added value";
export type CloseIssueMutation$variables = {
  id: string;
};
export type CloseIssueMutation$data = {
  readonly closeIssue: {
    readonly issue: {
      readonly id: string;
      readonly issueState: IssueState;
    } | null | undefined;
  } | null | undefined;
};
export type CloseIssueMutation = {
  response: CloseIssueMutation$data;
  variables: CloseIssueMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "issueId",
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "CloseIssuePayload",
    "kind": "LinkedField",
    "name": "closeIssue",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Issue",
        "kind": "LinkedField",
        "name": "issue",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": "issueState",
            "args": null,
            "kind": "ScalarField",
            "name": "state",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CloseIssueMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CloseIssueMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f3da4b2da8244d21e21ea630feb197f9",
    "id": null,
    "metadata": {},
    "name": "CloseIssueMutation",
    "operationKind": "mutation",
    "text": "mutation CloseIssueMutation(\n  $id: ID!\n) {\n  closeIssue(input: {issueId: $id}) {\n    issue {\n      id\n      issueState: state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1420baf1c9e1a89afebc2412ce84abc2";

export default node;
