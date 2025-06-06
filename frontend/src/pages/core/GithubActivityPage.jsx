import { useState, useEffect } from 'react';
import { FaTimes, FaGithub } from 'react-icons/fa';
import { GITHUB_USERNAME } from './local_config/userConfig';

const GithubActivityPage = () => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch GitHub activity
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/events/public`,
                    {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            'X-GitHub-Api-Version': '2022-11-28',
                        },
                    }
                );
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('User not found. Please check the GitHub username.');
                    } else if (response.status === 403) {
                        throw new Error('API rate limit exceeded. Try again later or use a personal access token.');
                    } else {
                        throw new Error('Failed to fetch activity. Please try again.');
                    }
                }
                const data = await response.json();
                setActivity(data.slice(0, 10));
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (GITHUB_USERNAME) {
            fetchActivity();
        } else {
            setError('GitHub username not configured.');
            setLoading(false);
        }
    }, []);

    // Format event into readable description
    const formatEvent = (event) => {
        const repoName = event.repo.name;
        const repoUrl = `https://github.com/${repoName}`;
        const createdAt = new Date(event.created_at).toLocaleString();
        let refType;

        switch (event.type) {
            case 'PushEvent':
                const commitCount = event.payload.commits?.length || 0;
                return {
                    description: `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to `,
                    linkText: repoName,
                    linkUrl: repoUrl,
                    time: createdAt,
                };
            case 'IssuesEvent':
                const action = event.payload.action;
                const issueNumber = event.payload.issue.number;
                const issueUrl = `${repoUrl}/issues/${issueNumber}`;
                return {
                    description: `${action.charAt(0).toUpperCase() + action.slice(1)} issue #${issueNumber} in `,
                    linkText: repoName,
                    linkUrl: issueUrl,
                    time: createdAt,
                };
            case 'PullRequestEvent':
                const prAction = event.payload.action;
                const prNumber = event.payload.pull_request.number;
                const prUrl = `${repoUrl}/pull/${prNumber}`;
                return {
                    description: `${prAction.charAt(0).toUpperCase() + prAction.slice(1)} pull request #${prNumber} in `,
                    linkText: repoName,
                    linkUrl: prUrl,
                    time: createdAt,
                };
            case 'WatchEvent':
                return {
                    description: `Starred `,
                    linkText: repoName,
                    linkUrl: repoUrl,
                    time: createdAt,
                };
            case 'CreateEvent':
                refType = event.payload.ref_type;
                return {
                    description: `Created ${refType} in `,
                    linkText: repoName,
                    linkUrl: repoUrl,
                    time: createdAt,
                };
            case 'DeleteEvent':
                refType = event.payload.ref_type;
                return {
                    description: `Deleted ${refType} in `,
                    linkText: repoName,
                    linkUrl: repoUrl,
                    time: createdAt,
                };
            default:
                return {
                    description: `${event.type.replace('Event', '')} in `,
                    linkText: repoName,
                    linkUrl: repoUrl,
                    time: createdAt,
                };
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center">
                <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
                    <div className="text-6xl mb-4">😓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
            {/* Close Button */}
            <div className="absolute top-6 left-6 z-50 w-full">
                <a
                    href="/"
                    className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.location.href = '/';
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.location.href = '/';
                    }}
                >
                    <FaTimes className="text-xl" />
                </a>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        GitHub Activity
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FaGithub className="text-blue-600 mr-3" />
                        Recent Activity for {GITHUB_USERNAME}
                    </h2>
                    {activity.length === 0 ? (
                        <p className="text-gray-600 text-center">No recent activity found.</p>
                    ) : (
                        <div className="space-y-4">
                            {activity.map((event) => {
                                const formattedEvent = formatEvent(event);
                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <FaGithub className="text-gray-500 mr-3 mt-1" />
                                        <div>
                                            <p className="text-gray-800">
                                                {formattedEvent.description}
                                                <a
                                                    href={formattedEvent.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline font-semibold"
                                                >
                                                    {formattedEvent.linkText}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">{formattedEvent.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Credits */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        Activity fetched from GitHub API •
                        Visit my{' '}
                        <a
                            href={`https://github.com/${GITHUB_USERNAME}`}
                            className="text-blue-600 hover:underline"
                        >
                            profile
                        </a>{' '}
                        for more information
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GithubActivityPage;