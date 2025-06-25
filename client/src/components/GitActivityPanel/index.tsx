import { FaGithub } from 'react-icons/fa';
import { GITHUB_USERNAME } from '@config/identity';
import { fetchGitHubActivity, formatGitHubEvent } from '@/lib/github';
import type { GitHubEvent } from '@/lib/github/types';

export default async function Main() {
  let activity: GitHubEvent[] = [];
  let error: string | null = null;

  try {
    activity = await fetchGitHubActivity(GITHUB_USERNAME);
  } catch (err: any) {
    error = err.message;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (!activity.length) {
    return <p className="text-gray-300 text-center">No recent activity found.</p>;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaGithub className="text-blue-400 mr-3" />
        GitHub Activity — {GITHUB_USERNAME}
      </h2>
      <ul className="space-y-4">
        {activity.map((event) => {
          const { id, type, repo, payload, created_at } = event;

          // Event description
          let title = '';
          let details: React.ReactNode = null;

          switch (type) {
            case 'PushEvent':
              const branch = payload.ref?.split('/').pop();
              const commits = payload.commits ?? [];
              title = `📦 Pushed ${commits.length} commit${commits.length > 1 ? 's' : ''} to \`${branch}\``;
              details = (
                <ul className="mt-2 pl-4 list-disc space-y-1">
                  {commits.map((c, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      <a
                        href={c.url.replace('api.', '').replace('repos/', '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-white"
                      >
                        {c.message.trim()}
                      </a>
                    </li>
                  ))}
                </ul>
              );
              break;
            case 'CreateEvent':
              title = `📁 Created ${payload.ref_type} \`${payload.ref}\` in`;
              break;
            case 'ForkEvent':
              title = `🍴 Forked`;
              break;
            case 'WatchEvent':
              title = `⭐ Starred`;
              break;
            case 'PullRequestEvent':
              title = `🔀 ${payload.action} pull request #${payload.number}`;
              break;
            default:
              title = `📌 ${type.replace(/Event$/, '')}`;
          }

          return (
            <li
              key={id}
              className="flex items-start bg-white/5 p-4 rounded-xl hover:bg-white/10 border border-white/10 transition-colors"
            >
              <FaGithub className="text-blue-400 mr-3 mt-1" />
              <div className="flex flex-col">
                <p className="text-white font-medium mb-1">
                  {title}{' '}
                  <a
                    href={`https://github.com/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                  >
                    {repo.name}
                  </a>
                </p>
                {details}
                <p className="text-xs text-gray-400 mt-2">{new Date(created_at).toLocaleString()}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
