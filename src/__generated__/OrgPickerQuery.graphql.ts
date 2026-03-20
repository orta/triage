/**
 * @generated SignedSource<<5798fa99f1441443c7a660186a602a4e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrgPickerQuery$variables = Record<PropertyKey, never>;
export type OrgPickerQuery$data = {
  readonly viewer: {
    readonly avatarUrl: string;
    readonly login: string;
  };
};
export type OrgPickerQuery = {
  response: OrgPickerQuery$data;
  variables: OrgPickerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrgPickerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrgPickerQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "8ffa5cadc90cbdec8f3423f6ac2278c5",
    "id": null,
    "metadata": {},
    "name": "OrgPickerQuery",
    "operationKind": "query",
    "text": "query OrgPickerQuery {\n  viewer {\n    login\n    avatarUrl\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f4a72da521e73c2039cd4de82d5e8e8f";

export default node;
