import { useState } from 'react';
import './App.css';
import { useGitHubUser } from './hooks/useGitHubUser';
import { useGitHubRepos } from './hooks/useGitHubRepos';

function App() {
  const [usernameInput, setUsernameInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { user, loading: userLoading, error: userError } = useGitHubUser(searchTerm);
  const { repos, loading: reposLoading, error: reposError } = useGitHubRepos(searchTerm);

  function handleSearch() {
    if (!usernameInput.trim()) return;
    setSearchTerm(usernameInput.trim());
  }

  return (
    <div className="user-profile-container">
      <h1 className="app-title">GitHub User Dashboard</h1>

      <div className="search-area">
        <input
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Enter username."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={userLoading}>
          {userLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {userError && <p style={{ color: 'red' }}>{userError}</p>}
      {userLoading && <p>Loading user...</p>}

      {user && (
        <div className="profile-card">
          <img src={user.avatar_url} alt={user.login} />
          <h2 className="user-name">{user.name || user.login}</h2>
          <p>{user.bio}</p>
          <p>Followers: {user.followers} | Following: {user.following}</p>
          <p>Public Repos: {user.public_repos}</p>
        </div>
      )}

      {user && (
        <>
          <h2>Repositories</h2>
          <ul className="repo-grid">
            {repos.map(repo => (
              <li key={repo.id} className="repo-card">
                <div>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                  {repo.description && <p>{repo.description}</p>}
                </div>
                <div className="repo-meta">
                  {repo.language && <span>{repo.language}</span>}
                  {repo.stargazers_count > 0 && <span>⭐ {repo.stargazers_count}</span>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
