import { useState, useEffect } from 'react';
import { FaGithub, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Adicionando modo noturno
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleSearch = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('Nenhum perfil encontrado com esse nome de usuário. Tente novamente.');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1 className="title">
          <FaGithub className="github-logo" />
          Perfil GitHub
        </h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Digite um nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading} className="search-button">
          <FaSearch className="search-icon" />
        </button>
      </div>
      
      {loading && <div className="loading">Carregando...</div>}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      {profile && (
        <div className="profile-container">
          <div className="profile-header">
            <img src={profile.avatar_url} alt={profile.name} className="avatar" />
            <div>
              <h2>{profile.name || profile.login}</h2>
              <p className="bio">{profile.bio || 'Sem biografia disponível'}</p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{profile.public_repos}</span>
              <span className="stat-label">Repositórios</span>
            </div>
            <div className="stat">
              <span className="stat-number">{profile.followers}</span>
              <span className="stat-label">Seguidores</span>
            </div>
            <div className="stat">
              <span className="stat-number">{profile.following}</span>
              <span className="stat-label">Seguindo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;