export interface GitHubRepo {
  name: string;
}

export interface GitHubIssue {
  number: number;
}

export interface GitHubPullRequest {
  number: number;
}

export interface GitHubPayload {
  action?: string;
  commits?: { message: string }[];
  issue?: GitHubIssue;
  pull_request?: GitHubPullRequest;
  ref_type?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: GitHubRepo;
  payload: GitHubPayload;
  created_at: string;
}

export interface FormattedEvent {
  description: string;
  linkText: string;
  linkUrl: string;
  time: string;
}

export interface PushEventPayload {
  ref?: string;
  commits?: {
    message: string;
    url: string;
  }[];
}

export interface CreateEventPayload {
  ref: string;
  ref_type: string;
}

export interface PullRequestEventPayload {
  action: string;
  number: number;
}

