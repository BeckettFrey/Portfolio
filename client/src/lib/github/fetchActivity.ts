import type { GitHubEvent } from './types';

export async function fetchGitHubActivity(username: string, limit = 10): Promise<GitHubEvent[]> {
  const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: 1000 }, // Cache for 1 minute
  });

  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? 'User not found.'
        : res.status === 403
        ? 'Rate limit exceeded.'
        : 'Failed to fetch GitHub activity.'
    );
  }

  const data: GitHubEvent[] = await res.json();
  return data.slice(0, limit);
}
