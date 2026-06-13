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
    <div>
      <h1 className="app-title">GitHub User Dashboard</h1>

    <div>
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

    {userError && <p style={{ color: 'red' }}> {userError}</p>}

    {userLoading && <p>Loading user...</p>}

    {user && (
      <div>
        <img src={user.avatar_url} alt={user.login} width={100} />
        <h2>{user.name || user.login}</h2>
        <p style={{ color: '#222' }}>{user.bio}</p>
        <p style={{ color: '#222' }}>Followers: {user.followers} | Following: {user.following}</p>
        <p style={{ color: '#222' }}>Public Repos: {user.public_repos}</p>
      </div>
    )}

    {user && (
    <>
      <h2>Repositories</h2>

      {reposLoading && <p>Loading repositories...</p>}
      {reposError && <p style={{ color: 'red' }}> {reposError}</p>}

      {!reposLoading && !reposError && repos.length === 0 && (
        <p>No repositories found.</p>
      )}

      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            {repo.description && <p>{repo.description}</p>}
            {repo.language && <span> .{repo.language} </span>}
            {repo.stargazers_count > 0 && <span>☆ {repo.stargazers_count}</span>}
          </li>
        ))}
      </ul>
    </>
    )}
    </div>
  );
}

export default App;
