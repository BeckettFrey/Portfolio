import type { ReactNode } from 'react';

export type MainProps = {
  fallbackError?: string;
};

export type ParsedGitHubEvent = {
  id: string;
  icon: string;
  title: string;
  details: ReactNode | null;
  repoName: string;
  repoUrl: string;
  createdAt: string;
};
