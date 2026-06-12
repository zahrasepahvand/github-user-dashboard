import { useState } from 'react'
import './App.css'

function UserCard({user}){
  return(
    <div>
      <h2>{user.name}</h2>
      <p>@{user.login}</p>
      <p>{user.followers} followers</p>
    </div>
  )
}

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  async function handleSearch() {
    if (!username.trim()) return;
    const response = await fetch(
      `https://api.github.com/users/${username}`
    );
    if (!response.ok) {
      alert("User not found");
      return;
    }
    
    const data = await response.json();
    setUser(data);
  }
 
  return (
    <div>
      <h1 className="app-title">GitHub User Dashboard</h1>

    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username."
      />
      <button onClick={handleSearch}>Search</button>
    </div>      

      <p>You typed: {username}</p>

      {user && <UserCard user={user} />
      }
    </div>
  )
}

export default App
