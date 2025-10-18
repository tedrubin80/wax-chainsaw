import React, { useState } from 'react';
import './MintCharacter.css';

const CLASS_NAMES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

const RACE_NAMES = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn',
  'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'
];

const RARITY_NAMES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

const CLASS_DESCRIPTIONS = {
  0: 'A fierce warrior who can enter a battle rage. High HP, melee focused (d12 hit die)',
  1: 'A charismatic performer and spellcaster. Jack of all trades (d8 hit die)',
  2: 'A divine spellcaster who channels the power of a deity (d8 hit die)',
  3: 'A nature-based spellcaster who can wild shape into animals (d8 hit die)',
  4: 'A master of martial combat with many fighting styles (d10 hit die)',
  5: 'A martial artist who harnesses ki energy for special abilities (d8 hit die)',
  6: 'A holy warrior who combines divine magic with combat (d10 hit die)',
  7: 'A wilderness warrior skilled in tracking and archery (d10 hit die)',
  8: 'A stealthy specialist skilled in sneak attacks and tricks (d8 hit die)',
  9: 'A natural spellcaster with innate magical abilities (d6 hit die)',
  10: 'A spellcaster who made a pact with an otherworldly being (d8 hit die)',
  11: 'A scholarly magic-user who studies arcane arts (d6 hit die)'
};

const RACE_DESCRIPTIONS = {
  0: 'Versatile and adaptable. +1 to all ability scores',
  1: 'Graceful and long-lived. +2 DEX',
  2: 'Sturdy and resilient. +2 CON',
  3: 'Small and lucky. +2 DEX',
  4: 'Draconic heritage and breath weapon. +2 STR, +1 CHA',
  5: 'Small and inventive. +2 INT',
  6: 'Diplomatic and versatile. +2 CHA, +1 to two other stats',
  7: 'Strong and savage. +2 STR, +1 CON',
  8: 'Infernal heritage and fire resistance. +2 CHA, +1 INT'
};

function MintCharacter({ onMint }) {
  const [charName, setCharName] = useState('');
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedRace, setSelectedRace] = useState(0);
  const [selectedRarity, setSelectedRarity] = useState(0);

  const handleMint = () => {
    if (charName.trim()) {
      onMint(charName, selectedClass, selectedRace, selectedRarity);
      setCharName('');
    } else {
      alert('Please enter a character name');
    }
  };

  return (
    <div className="mint-character">
      <h2>Mint New Character</h2>
      <p>Create your D&D 5e character NFT!</p>

      <div className="mint-form">
        <div className="form-section">
          <label>Character Name</label>
          <input
            type="text"
            value={charName}
            onChange={(e) => setCharName(e.target.value)}
            placeholder="Enter character name..."
            maxLength={32}
          />
        </div>

        <div className="form-section">
          <label>Race</label>
          <div className="option-grid">
            {RACE_NAMES.map((race, idx) => (
              <div
                key={idx}
                className={`option-card ${selectedRace === idx ? 'selected' : ''}`}
                onClick={() => setSelectedRace(idx)}
              >
                <div className="option-name">{race}</div>
                <div className="option-desc">{RACE_DESCRIPTIONS[idx]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Class</label>
          <div className="option-grid">
            {CLASS_NAMES.map((className, idx) => (
              <div
                key={idx}
                className={`option-card ${selectedClass === idx ? 'selected' : ''}`}
                onClick={() => setSelectedClass(idx)}
              >
                <div className="option-name">{className}</div>
                <div className="option-desc">{CLASS_DESCRIPTIONS[idx]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Rarity (affects starting ability scores)</label>
          <div className="rarity-options">
            {RARITY_NAMES.map((rarity, idx) => (
              <div
                key={idx}
                className={`rarity-card ${selectedRarity === idx ? 'selected' : ''}`}
                onClick={() => setSelectedRarity(idx)}
              >
                <div className="rarity-name">{rarity}</div>
                <div className="rarity-bonus">+{idx} to all stats</div>
              </div>
            ))}
          </div>
        </div>

        <button className="mint-btn" onClick={handleMint}>
          Mint Character NFT
        </button>
      </div>

      <div className="mint-info">
        <h3>Character Creation Info</h3>
        <ul>
          <li>Characters use D&D 5e standard array: 15, 14, 13, 12, 10, 8</li>
          <li>Stats are automatically optimized for your chosen class</li>
          <li>Racial bonuses are applied to ability scores</li>
          <li>Rarity adds bonus points to all ability scores</li>
          <li>Level cap is 20 with full D&D 5e progression</li>
          <li>Ability Score Improvements at levels 4, 8, 12, 16, 19</li>
        </ul>
      </div>
    </div>
  );
}

export default MintCharacter;
