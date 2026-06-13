const BASE_URL = 'https://api.github.com';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const cache = new Map();

export async function fetchUserProfile(username, { signal } = {}) {
  const cacheKey = `user-${username}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const response = await fetch(`${BASE_URL}/users/${username}`, {
    signal,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) throw new Error(`User "${username}" not found`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const user = {
    id: data.id,
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    bio: data.bio,
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
    html_url: data.html_url,
  };
  
  cache.set(cacheKey, user);
  return user;
}

export async function fetchUserRepositories(username, { signal } = {}) {
  const cacheKey = `repos-${username}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const response = await fetch(
    `${BASE_URL}/users/${username}/repos?per_page=100`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  
  if (!Array.isArray(data)) throw new Error('Unexpected response');

  const repos = data.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    stargazers_count: repo.stargazers_count,
    language: repo.language,
  }));
  
  cache.set(cacheKey, repos);
  return repos;
}

export async function fetchUserFollowers(username, { signal } = {}) {
  const cacheKey = `followers-${username}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const response = await fetch(
    `${BASE_URL}/users/${username}/followers?per_page=100`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  const followers = data.map(f => ({
    id: f.id,
    login: f.login,
    avatar_url: f.avatar_url,
    html_url: f.html_url,
  }));
  
  cache.set(cacheKey, followers);
  return followers;
}