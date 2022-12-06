export interface DeploymentResponse {
  deployments: Deployment[];
  pagination: {
    count: number;
    next: number;
    prev: number;
  };
}

export interface Deployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  source: string;
  state: State;
  type: string;
  creator: Creator;
  inspectorUrl: string;
  meta: Meta;
  target: string;
  aliasError: null;
  aliasAssigned: number;
  isRollbackCandidate: boolean;
  createdAt: number;
  buildingAt: number;
  ready: number;
}

export interface Creator {
  uid: string;
  email: string;
  username: string;
  githubLogin: string;
}

export interface Meta {
  githubCommitAuthorName: string;
  githubCommitMessage: string;
  githubCommitOrg: string;
  githubCommitRef: string;
  githubCommitRepo: string;
  githubCommitSha: string;
  githubDeployment: string;
  githubOrg: string;
  githubRepo: string;
  githubRepoOwnerType: string;
  githubCommitRepoId: string;
  githubRepoId: string;
  githubCommitAuthorLogin: string;
}

export type State =
  | "QUEUED"
  | "INITIALIZING"
  | "BUILDING"
  | "READY"
  | "ERROR"
  | "CANCELED";

export enum StateEnum {
  "BUILDING" = "BUILDING",
  "ERROR" = "ERROR",
  "INITIALIZING" = "INITIALIZING",
  "QUEUED" = "QUEUED",
  "READY" = "READY",
  "CANCELED" = "CANCELED",
}
