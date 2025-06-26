import { FaGithub, FaUserCircle } from 'react-icons/fa';
import { GITHUB_USERNAME } from '@config/identity';
import { fetchGitHubActivity } from '@/lib/github';
import FormattedTimestamp from '@/components/FormattedTimestamp';
import type {
  GitHubEvent,
  PushEventPayload,
  CreateEventPayload,
  PullRequestEventPayload,
} from '@/lib/github/types';

const panel = `
  group
  flex flex-col gap-4
  p-6 
  rounded-2xl 
  bg-white/10 
  backdrop-blur-md 
  border border-white/20 
  transition-all duration-300 ease-out
  relative 
  overflow-hidden
  break-inside-avoid
  mb-4
`;


const getEventIcon = (type: string) => {
  switch (type) {
    case 'PushEvent':
      return '📦';
    case 'CreateEvent':
      return '📁';
    case 'ForkEvent':
      return '🍴';
    case 'WatchEvent':
      return '⭐';
    case 'PullRequestEvent':
      return '🔀';
    default:
      return '📌';
  }
};

export default async function Main() {
  let activity: GitHubEvent[] = [];
  let error: string | null = null;

  try {
    activity = await fetchGitHubActivity(GITHUB_USERNAME);
  } catch {
    error = 'Failed to fetch GitHub activity. Please try again later.';
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-300 text-lg">No recent activity found.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="columns-1 lg:columns-2 space-y-4">
        {activity.map((event) => {
          const { id, type, repo, payload, created_at } = event;

          let title = '';
          let details: React.ReactNode = null;

          switch (type) {
            case 'PushEvent': {
              const pushPayload = payload as PushEventPayload;
              const branch = pushPayload.ref?.split('/').pop();
              const commits = pushPayload.commits ?? [];
              title = `Pushed ${commits.length} commit${commits.length > 1 ? 's' : ''} to`;
              details = (
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-3">
                    <span>📝</span>
                    <span>{branch}</span>
                  </div>
                  <div className="space-y-2">
                    {commits.slice(0, 3).map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <a
  href={c.url.replace('api.', '').replace('repos/', '')}
  target="_blank"
  rel="noopener noreferrer"
  className="text-white hover:text-gray-300 no-underline transition-colors duration-200 font-medium line-clamp-2"
>
                            {c.message.trim()}
                          </a>
                        </div>
                      </div>
                    ))}
                    {commits.length > 3 && (
                      <div className="text-sm text-gray-400 text-center py-2">
                        +{commits.length - 3} more commits
                      </div>
                    )}
                  </div>
                </div>
              );
              break;
            }

            case 'CreateEvent': {
              const createPayload = payload as CreateEventPayload;
              title = `Created ${createPayload.ref_type}`;
              details = createPayload.ref && (
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                    <span>🌿</span>
                    <span>{createPayload.ref}</span>
                  </div>
                </div>
              );
              break;
            }

            case 'ForkEvent':
              title = 'Forked repository';
              break;

            case 'WatchEvent':
              title = 'Starred repository';
              break;

            case 'PullRequestEvent': {
              const prPayload = payload as PullRequestEventPayload;
              title = `${prPayload.action.charAt(0).toUpperCase() + prPayload.action.slice(1)} pull request`;
              details = (
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    <span>#</span>
                    <span>{prPayload.number}</span>
                  </div>
                </div>
              );
              break;
            }

            default:
              title = type.replace(/Event$/, '');
              break;
          }

          return (
            <div key={id} className={panel}>
              {/* Header with Icon and Content */}
              <div className="flex items-start gap-4">
                {/* Icon Section */}
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl shrink-0 transition-colors duration-300">
                  <span className="text-2xl">{getEventIcon(type)}</span>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-lg leading-tight mb-1">
                        {title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <FaGithub className="text-gray-400 w-4 h-4 shrink-0" />
                        <a
                          href={`https://github.com/${repo.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-400 no-underline font-medium transition-colors duration-200 truncate"
                        >
                          {repo.name}
                        </a>
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <FormattedTimestamp date={created_at} />
                  </div>
                </div>
              </div>

              {/* Details Section */}
              {details && (
                <div className="pl-16 lg:pl-0">
                  {details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}