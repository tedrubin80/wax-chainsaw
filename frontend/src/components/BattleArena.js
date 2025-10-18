import React, { useState } from 'react';
import './BattleArena.css';

const CLASS_NAMES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

function BattleArena({ characters, onBattle }) {
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [selectedDefender, setSelectedDefender] = useState(null);

  const handleBattle = () => {
    if (selectedAttacker && selectedDefender) {
      onBattle(selectedAttacker, selectedDefender);
      setSelectedAttacker(null);
      setSelectedDefender(null);
    }
  };

  return (
    <div className="battle-arena">
      <h2>Battle Arena</h2>
      <p>Select your character and an opponent to battle!</p>

      <div className="battle-selection">
        <div className="selection-panel">
          <h3>Your Character</h3>
          <div className="character-list">
            {characters.length === 0 ? (
              <p>No characters available</p>
            ) : (
              characters.map(char => (
                <div
                  key={char.id}
                  className={`char-option ${selectedAttacker === char.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAttacker(char.id)}
                >
                  <div className="char-name">{char.name}</div>
                  <div className="char-details">
                    Level {char.level} {CLASS_NAMES[char.char_class]}
                  </div>
                  <div className="char-stats">
                    HP: {char.combat.current_hp}/{char.combat.max_hp} | AC: {char.combat.armor_class}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="battle-button-container">
          <button
            className="battle-btn"
            onClick={handleBattle}
            disabled={!selectedAttacker || !selectedDefender}
          >
            ⚔️ BATTLE ⚔️
          </button>
        </div>

        <div className="selection-panel">
          <h3>Opponent</h3>
          <div className="character-list">
            {characters.length === 0 ? (
              <p>No opponents available</p>
            ) : (
              characters.map(char => (
                <div
                  key={char.id}
                  className={`char-option ${selectedDefender === char.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDefender(char.id)}
                >
                  <div className="char-name">{char.name}</div>
                  <div className="char-details">
                    Level {char.level} {CLASS_NAMES[char.char_class]}
                  </div>
                  <div className="char-stats">
                    HP: {char.combat.current_hp}/{char.combat.max_hp} | AC: {char.combat.armor_class}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="battle-info">
        <h3>How Combat Works</h3>
        <ul>
          <li>D&D 5e turn-based combat simulation</li>
          <li>Attack rolls: d20 + ability modifier vs target AC</li>
          <li>Natural 20 always hits, Natural 1 always misses</li>
          <li>Winner gains XP based on opponent's level</li>
          <li>Combat lasts up to 3 rounds</li>
        </ul>
      </div>
    </div>
  );
}

export default BattleArena;
