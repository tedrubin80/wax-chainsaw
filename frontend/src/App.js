import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import CharacterCard from './components/CharacterCard';
import BattleArena from './components/BattleArena';
import MintCharacter from './components/MintCharacter';

const waxEndpoint = 'https://wax-testnet.eosphere.io';
const contractName = 'qugxubmytjyw'; // Admin account: qugxub-mytjyw-gamPo8

function App() {
  const [view, setView] = useState('landing'); // landing, app
  const [waxUser, setWaxUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [activeTab, setActiveTab] = useState('collection');

  const login = async () => {
    try {
      const wax = await import('@waxio/waxjs/dist');
      const waxjs = new wax.WaxJS({
        rpcEndpoint: waxEndpoint,
        tryAutoLogin: false
      });
      const userAccount = await waxjs.login();
      setWaxUser(userAccount);
      await loadCharacters(userAccount, waxjs);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const loadCharacters = async (account, waxjs) => {
    try {
      const result = await waxjs.rpc.get_table_rows({
        json: true,
        code: contractName,
        scope: contractName,
        table: 'characters',
        lower_bound: account,
        upper_bound: account,
        index_position: 2,
        key_type: 'name',
        limit: 100
      });
      setCharacters(result.rows);
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  if (view === 'landing') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>WAX RPG Collection</h1>
          <button className="login-btn" onClick={() => setView('app')}>
            Launch App
          </button>
        </header>
        <LandingPage onEnterApp={() => setView('app')} />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="header-title-link" onClick={() => setView('landing')} style={{cursor: 'pointer'}}>
          WAX RPG Collection
        </h1>
        <div className="header-right">
          <button className="back-btn" onClick={() => setView('landing')}>
            Portfolio
          </button>
          {!waxUser ? (
            <button className="login-btn" onClick={login}>
              Connect WAX Wallet
            </button>
          ) : (
            <div className="user-info">
              <span>Connected: {waxUser}</span>
            </div>
          )}
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={activeTab === 'collection' ? 'active' : ''}
          onClick={() => setActiveTab('collection')}
        >
          My Collection
        </button>
        <button
          className={activeTab === 'battle' ? 'active' : ''}
          onClick={() => setActiveTab('battle')}
        >
          Battle Arena
        </button>
        <button
          className={activeTab === 'mint' ? 'active' : ''}
          onClick={() => setActiveTab('mint')}
        >
          Mint Character
        </button>
      </nav>

      <main className="main-content">
        {!waxUser && (
          <div className="welcome">
            <h2>Welcome to WAX RPG Collection!</h2>
            <p>Connect your WAX wallet to interact with the dApp, or explore the features from the portfolio page.</p>
            <div className="welcome-actions">
              <button className="login-btn" onClick={login}>Connect WAX Wallet</button>
              <button className="back-btn" onClick={() => setView('landing')}>View Portfolio</button>
            </div>
          </div>
        )}

        {waxUser && activeTab === 'collection' && (
          <div className="character-grid">
            {characters.length === 0 ? (
              <p>No characters yet. Mint your first character!</p>
            ) : (
              characters.map(char => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  onGainExp={() => {}}
                />
              ))
            )}
          </div>
        )}

        {waxUser && activeTab === 'battle' && (
          <BattleArena
            characters={characters}
            onBattle={() => {}}
          />
        )}

        {waxUser && activeTab === 'mint' && (
          <MintCharacter onMint={() => {}} />
        )}
      </main>
    </div>
  );
}

export default App;
