/**
 * @generated SignedSource<<64848c9cca1fcd5b2cb5ad65b00e5160>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type IssueState = "CLOSED" | "OPEN" | "%future added value";
export type ProjectV2SingleSelectFieldOptionColor = "BLUE" | "GRAY" | "GREEN" | "ORANGE" | "PINK" | "PURPLE" | "RED" | "YELLOW" | "%future added value";
export type PullRequestState = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
export type KanbanBoardQuery$variables = {
  number: number;
  org: string;
};
export type KanbanBoardQuery$data = {
  readonly organization: {
    readonly projectV2: {
      readonly fields: {
        readonly nodes: ReadonlyArray<{
          readonly __typename: "ProjectV2SingleSelectField";
          readonly id: string;
          readonly name: string;
          readonly options: ReadonlyArray<{
            readonly color: ProjectV2SingleSelectFieldOptionColor;
            readonly id: string;
            readonly name: string;
          }>;
        } | {
          // This will never be '%other', but we need some
          // value in case none of the concrete values match.
          readonly __typename: "%other";
        } | null | undefined> | null | undefined;
      };
      readonly id: string;
      readonly items: {
        readonly nodes: ReadonlyArray<{
          readonly content: {
            readonly __typename: "DraftIssue";
            readonly bodyHTML: string;
            readonly title: string;
          } | {
            readonly __typename: "Issue";
            readonly assignees: {
              readonly nodes: ReadonlyArray<{
                readonly avatarUrl: string;
                readonly login: string;
              } | null | undefined> | null | undefined;
            };
            readonly author: {
              readonly avatarUrl: string;
              readonly login: string;
            } | null | undefined;
            readonly bodyHTML: string;
            readonly id: string;
            readonly issueState: IssueState;
            readonly labels: {
              readonly nodes: ReadonlyArray<{
                readonly color: string;
                readonly name: string;
              } | null | undefined> | null | undefined;
            } | null | undefined;
            readonly number: number;
            readonly title: string;
            readonly url: string;
          } | {
            readonly __typename: "PullRequest";
            readonly bodyHTML: string;
            readonly id: string;
            readonly number: number;
            readonly prState: PullRequestState;
            readonly title: string;
            readonly url: string;
          } | {
            // This will never be '%other', but we need some
            // value in case none of the concrete values match.
            readonly __typename: "%other";
          } | null | undefined;
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
        } | null | undefined> | null | undefined;
      };
      readonly title: string;
    } | null | undefined;
  } | null | undefined;
};
export type KanbanBoardQuery = {
  response: KanbanBoardQuery$data;
  variables: KanbanBoardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "number"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "org"
},
v2 = [
  {
    "kind": "Variable",
    "name": "login",
    "variableName": "org"
  }
],
v3 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "number"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
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
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": [
    (v4/*: any*/),
    (v8/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "ProjectV2SingleSelectFieldOption",
      "kind": "LinkedField",
      "name": "options",
      "plural": true,
      "selections": [
        (v4/*: any*/),
        (v8/*: any*/),
        (v9/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ProjectV2SingleSelectField",
  "abstractKey": null
},
v11 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v12 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "optionId",
  "storageKey": null
},
v14 = [
  (v4/*: any*/)
],
v15 = {
  "kind": "InlineFragment",
  "selections": (v14/*: any*/),
  "type": "ProjectV2FieldCommon",
  "abstractKey": "__isProjectV2FieldCommon"
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodyHTML",
  "storageKey": null
},
v19 = {
  "alias": "issueState",
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v22 = [
  (v20/*: any*/),
  (v21/*: any*/)
],
v23 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  }
],
v24 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 3
  }
],
v25 = {
  "kind": "InlineFragment",
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/),
    (v16/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    {
      "alias": "prState",
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    }
  ],
  "type": "PullRequest",
  "abstractKey": null
},
v26 = {
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/),
    (v18/*: any*/)
  ],
  "type": "DraftIssue",
  "abstractKey": null
},
v27 = {
  "kind": "InlineFragment",
  "selections": (v14/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "KanbanBoardQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "ProjectV2",
            "kind": "LinkedField",
            "name": "projectV2",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "ProjectV2FieldConfigurationConnection",
                "kind": "LinkedField",
                "name": "fields",
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
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "fields(first:20)"
              },
              {
                "alias": null,
                "args": (v11/*: any*/),
                "concreteType": "ProjectV2ItemConnection",
                "kind": "LinkedField",
                "name": "items",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ProjectV2Item",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": (v12/*: any*/),
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
                                  (v13/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "field",
                                    "plural": false,
                                    "selections": [
                                      (v15/*: any*/)
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
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v4/*: any*/),
                              (v5/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "author",
                                "plural": false,
                                "selections": (v22/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": (v23/*: any*/),
                                "concreteType": "LabelConnection",
                                "kind": "LinkedField",
                                "name": "labels",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Label",
                                    "kind": "LinkedField",
                                    "name": "nodes",
                                    "plural": true,
                                    "selections": [
                                      (v8/*: any*/),
                                      (v9/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "labels(first:5)"
                              },
                              {
                                "alias": null,
                                "args": (v24/*: any*/),
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
                                    "selections": (v22/*: any*/),
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "assignees(first:3)"
                              }
                            ],
                            "type": "Issue",
                            "abstractKey": null
                          },
                          (v25/*: any*/),
                          (v26/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "items(first:100)"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "KanbanBoardQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "ProjectV2",
            "kind": "LinkedField",
            "name": "projectV2",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": "ProjectV2FieldConfigurationConnection",
                "kind": "LinkedField",
                "name": "fields",
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
                      (v10/*: any*/),
                      (v27/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "fields(first:20)"
              },
              {
                "alias": null,
                "args": (v11/*: any*/),
                "concreteType": "ProjectV2ItemConnection",
                "kind": "LinkedField",
                "name": "items",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ProjectV2Item",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": (v12/*: any*/),
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
                                  (v13/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "field",
                                    "plural": false,
                                    "selections": [
                                      (v7/*: any*/),
                                      (v15/*: any*/),
                                      (v27/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "type": "ProjectV2ItemFieldSingleSelectValue",
                                "abstractKey": null
                              },
                              (v27/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "fieldValues(first:10)"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "content",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v4/*: any*/),
                              (v5/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "author",
                                "plural": false,
                                "selections": [
                                  (v7/*: any*/),
                                  (v20/*: any*/),
                                  (v21/*: any*/),
                                  (v27/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": (v23/*: any*/),
                                "concreteType": "LabelConnection",
                                "kind": "LinkedField",
                                "name": "labels",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Label",
                                    "kind": "LinkedField",
                                    "name": "nodes",
                                    "plural": true,
                                    "selections": [
                                      (v8/*: any*/),
                                      (v9/*: any*/),
                                      (v4/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "labels(first:5)"
                              },
                              {
                                "alias": null,
                                "args": (v24/*: any*/),
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
                                      (v20/*: any*/),
                                      (v21/*: any*/),
                                      (v4/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "assignees(first:3)"
                              }
                            ],
                            "type": "Issue",
                            "abstractKey": null
                          },
                          (v25/*: any*/),
                          (v26/*: any*/),
                          (v27/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "items(first:100)"
              }
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d801272e1ff99681239c38cf17ebbcf3",
    "id": null,
    "metadata": {},
    "name": "KanbanBoardQuery",
    "operationKind": "query",
    "text": "query KanbanBoardQuery(\n  $org: String!\n  $number: Int!\n) {\n  organization(login: $org) {\n    projectV2(number: $number) {\n      id\n      title\n      fields(first: 20) {\n        nodes {\n          __typename\n          ... on ProjectV2SingleSelectField {\n            id\n            name\n            options {\n              id\n              name\n              color\n            }\n          }\n          ... on Node {\n            __isNode: __typename\n            id\n          }\n        }\n      }\n      items(first: 100) {\n        nodes {\n          id\n          fieldValues(first: 10) {\n            nodes {\n              __typename\n              ... on ProjectV2ItemFieldSingleSelectValue {\n                optionId\n                field {\n                  __typename\n                  ... on ProjectV2FieldCommon {\n                    __isProjectV2FieldCommon: __typename\n                    id\n                  }\n                  ... on Node {\n                    __isNode: __typename\n                    id\n                  }\n                }\n              }\n              ... on Node {\n                __isNode: __typename\n                id\n              }\n            }\n          }\n          content {\n            __typename\n            ... on Issue {\n              id\n              title\n              number\n              url\n              bodyHTML\n              issueState: state\n              author {\n                __typename\n                login\n                avatarUrl\n                ... on Node {\n                  __isNode: __typename\n                  id\n                }\n              }\n              labels(first: 5) {\n                nodes {\n                  name\n                  color\n                  id\n                }\n              }\n              assignees(first: 3) {\n                nodes {\n                  login\n                  avatarUrl\n                  id\n                }\n              }\n            }\n            ... on PullRequest {\n              id\n              title\n              number\n              url\n              bodyHTML\n              prState: state\n            }\n            ... on DraftIssue {\n              title\n              bodyHTML\n            }\n            ... on Node {\n              __isNode: __typename\n              id\n            }\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "38904ec310d184ad8c037dd377b98742";

export default node;
