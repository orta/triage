/**
 * @generated SignedSource<<dff7db6c6d68824564e29ca52703912b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PullRequestState = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
export type ClosePRMutation$variables = {
  id: string;
};
export type ClosePRMutation$data = {
  readonly closePullRequest: {
    readonly pullRequest: {
      readonly id: string;
      readonly prState: PullRequestState;
    } | null | undefined;
  } | null | undefined;
};
export type ClosePRMutation = {
  response: ClosePRMutation$data;
  variables: ClosePRMutation$variables;
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
            "name": "pullRequestId",
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "ClosePullRequestPayload",
    "kind": "LinkedField",
    "name": "closePullRequest",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PullRequest",
        "kind": "LinkedField",
        "name": "pullRequest",
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
            "alias": "prState",
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
    "name": "ClosePRMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ClosePRMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "97cdb043d6f7b814d3f3d626ae94f2dd",
    "id": null,
    "metadata": {},
    "name": "ClosePRMutation",
    "operationKind": "mutation",
    "text": "mutation ClosePRMutation(\n  $id: ID!\n) {\n  closePullRequest(input: {pullRequestId: $id}) {\n    pullRequest {\n      id\n      prState: state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2d21ec23c631d1a973ba3fd0339f3862";

export default node;
