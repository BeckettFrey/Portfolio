import type { GitHubEvent, FormattedEvent } from './types';

export function formatGitHubEvent(event: GitHubEvent): FormattedEvent {
  const { type, repo, payload, created_at } = event;

  let description: string;
  let linkText = repo.name;
  let linkUrl = `https://github.com/${repo.name}`;

  if (type === 'PushEvent' && payload.commits?.length) {
    const commitMessages = payload.commits
      .map((commit) => `- ${commit.message.trim()}`)
      .join('\n');

    description = `Pushed ${payload.commits.length} commit(s):\n${commitMessages}`;
  } else {
    description = `Activity: ${type.replace(/Event$/, '')}`; // fallback with event type
  }

  return {
    description,
    linkText,
    linkUrl,
    time: new Date(created_at).toLocaleString(),
  };
}
