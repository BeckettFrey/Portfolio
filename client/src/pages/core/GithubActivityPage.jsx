import { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaGithub } from 'react-icons/fa';
import { GITHUB_USERNAME } from './config';

const GithubActivityPage = () => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch GitHub activity with caching
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const cacheKey = `github_activity_${GITHUB_USERNAME}`;
                const cachedData = localStorage.getItem(cacheKey);
                const cacheTime = localStorage.getItem(`${cacheKey}_time`);
                const cacheExpiry = 5 * 60 * 1000; // 5 minutes

                // Use cached data if available and not expired
                if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < cacheExpiry) {
                    setActivity(JSON.parse(cachedData));
                    setLoading(false);
                    return;
                }

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
                const slicedData = data.slice(0, 10);
                setActivity(slicedData);
                localStorage.setItem(cacheKey, JSON.stringify(slicedData));
                localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
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

    // Memoize event formatting
    const formatEvent = useMemo(() => {
        return (event) => {
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
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="relative min-h-screen text-white font-sans overflow-hidden">
                <style jsx>{`
                    body {
                        touch-action: none;
                        overscroll-behavior: none;
                    }
                    .animate-spin {
                        animation-duration: 0.5s;
                    }
                    @media (max-width: 767px) {
                        .container {
                            padding-left: 8px;
                            padding-right: 8px;
                            padding-top: 8px;
                            padding-bottom: 8px;
                        }
                    }
                `}</style>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <p className="text-xl text-gray-300">Loading GitHub Activity...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="relative min-h-screen text-white font-sans overflow-hidden">
                <style jsx>{`
                    body {
                        touch-action: none;
                        overscroll-behavior: none;
                    }
                    .error-container {
                        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
                    }
                    @media (max-width: 767px) {
                        .container {
                            padding-left: 8px;
                            padding-right: 8px;
                            padding-top: 8px;
                            padding-bottom: 8px;
                        }
                    }
                `}</style>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-md border border-white/10 error-container">
                        <div className="text-6xl mb-4">😓</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                        <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen text-white font-sans overflow-hidden">
            <style jsx>{`
                .activity-item {
                    transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
                }
                .close-button {
                    transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
                }
                .activity-container {
                    transition: opacity 0.2s ease-in-out;
                }
                @media (max-width: 767px) {
                    .container {
                        padding-left: 8px;
                        padding-right: 8px;
                        padding-top: 8px;
                        padding-bottom: 8px;
                    }
                }
            `}</style>

            {/* Close Button */}
            <div className="absolute top-2 left-2 z-50">
                <a
                    href="/"
                    className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg close-button hover:scale-110"
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
                    <FaTimes className="text-lg" />
                </a>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-4xl relative z-10 activity-container">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        GitHub Activity
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FaGithub className="text-blue-400 mr-3" />
                        Recent Activity for {GITHUB_USERNAME}
                    </h2>
                    {activity.length === 0 ? (
                        <p className="text-gray-300 text-center">No recent activity found.</p>
                    ) : (
                        <div className="space-y-4">
                            {activity.map((event) => {
                                const formattedEvent = formatEvent(event);
                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-start p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 border border-white/10 activity-item hover:scale-[1.02]"
                                    >
                                        <FaGithub className="text-blue-400 mr-3 mt-1" />
                                        <div>
                                            <p className="text-white">
                                                {formattedEvent.description}
                                                <a
                                                    href={formattedEvent.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors duration-200"
                                                >
                                                    {formattedEvent.linkText}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-300">{formattedEvent.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Credits */}
                <div className="text-center text-sm text-gray-300">
                    <p>
                        Activity fetched from GitHub API •
                        Visit my{' '}
                        <a
                            href={`https://github.com/${GITHUB_USERNAME}`}
                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
                        >
                            profile
                        </a>{' '}
                        for more
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GithubActivityPage;