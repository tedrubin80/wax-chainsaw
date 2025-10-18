import React, { useState, useEffect } from 'react';
import * as wax from '@waxio/waxjs/dist';
import './App.css';
import CharacterCard from './components/CharacterCard';
import BattleArena from './components/BattleArena';
import MintCharacter from './components/MintCharacter';

const waxEndpoint = 'https://wax-testnet.eosphere.io';
const contractName = 'qugxubmytjyw'; // Admin account: qugxub-mytjyw-gamPo8

function App() {
  const [waxUser, setWaxUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [activeTab, setActiveTab] = useState('collection'); // collection, battle, mint

  const waxjs = new wax.WaxJS({
    rpcEndpoint: waxEndpoint,
    tryAutoLogin: false
  });

  const login = async () => {
    try {
      const userAccount = await waxjs.login();
      setWaxUser(userAccount);
      await loadCharacters(userAccount);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const loadCharacters = async (account) => {
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

  const mintCharacter = async (name, charClass, charRace, rarity) => {
    try {
      const result = await waxjs.api.transact({
        actions: [{
          account: contractName,
          name: 'mintchar',
          authorization: [{
            actor: waxUser,
            permission: 'active',
          }],
          data: {
            owner: waxUser,
            char_name: name,
            char_class: charClass,
            char_race: charRace,
            rarity_level: rarity
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      console.log('Character minted!', result);
      await loadCharacters(waxUser);
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  const gainExperience = async (characterId, amount) => {
    try {
      await waxjs.api.transact({
        actions: [{
          account: contractName,
          name: 'gainexp',
          authorization: [{
            actor: waxUser,
            permission: 'active',
          }],
          data: {
            character_id: characterId,
            exp_amount: amount
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      await loadCharacters(waxUser);
    } catch (error) {
      console.error('Gain exp failed:', error);
    }
  };

  const battle = async (attackerId, defenderId) => {
    try {
      await waxjs.api.transact({
        actions: [{
          account: contractName,
          name: 'battle',
          authorization: [{
            actor: waxUser,
            permission: 'active',
          }],
          data: {
            attacker_id: attackerId,
            defender_id: defenderId
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      await loadCharacters(waxUser);
    } catch (error) {
      console.error('Battle failed:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WAX RPG Collection</h1>
        {!waxUser ? (
          <button className="login-btn" onClick={login}>
            Connect WAX Wallet
          </button>
        ) : (
          <div className="user-info">
            <span>Connected: {waxUser}</span>
          </div>
        )}
      </header>

      {waxUser && (
        <>
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
            {activeTab === 'collection' && (
              <div className="character-grid">
                {characters.length === 0 ? (
                  <p>No characters yet. Mint your first character!</p>
                ) : (
                  characters.map(char => (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      onGainExp={gainExperience}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'battle' && (
              <BattleArena
                characters={characters}
                onBattle={battle}
              />
            )}

            {activeTab === 'mint' && (
              <MintCharacter onMint={mintCharacter} />
            )}
          </main>
        </>
      )}

      {!waxUser && (
        <div className="welcome">
          <h2>Welcome to WAX RPG Collection!</h2>
          <p>Collect unique characters, level them up, and battle other players!</p>
          <ul>
            <li>12 D&D 5e Classes: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard</li>
            <li>9 D&D Races: Human, Elf, Dwarf, Halfling, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling</li>
            <li>5 Rarity Levels: Common, Uncommon, Rare, Epic, Legendary</li>
            <li>Level up to 20 with full D&D 5e progression</li>
            <li>Turn-based combat with d20 attack rolls</li>
          </ul>
          <p>Connect your WAX wallet to get started!</p>
        </div>
      )}
    </div>
  );
}

export default App;
