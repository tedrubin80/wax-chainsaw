import React from 'react';
import './CharacterCard.css';

const CLASS_NAMES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

const RACE_NAMES = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn',
  'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'
];

const RARITY_NAMES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
const RARITY_COLORS = ['#9ca3af', '#22c55e', '#3b82f6', '#a855f7', '#eab308'];

function CharacterCard({ character, onGainExp }) {
  const getAbilityModifier = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
  };

  return (
    <div className="character-card" style={{borderColor: RARITY_COLORS[character.rarity_level]}}>
      <div className="card-header">
        <h3>{character.name}</h3>
        <span className="rarity" style={{color: RARITY_COLORS[character.rarity_level]}}>
          {RARITY_NAMES[character.rarity_level]}
        </span>
      </div>

      <div className="char-info">
        <div className="info-row">
          <span>Level {character.level}</span>
          <span>{CLASS_NAMES[character.char_class]}</span>
        </div>
        <div className="info-row">
          <span>{RACE_NAMES[character.char_race]}</span>
          <span>HP: {character.combat.current_hp}/{character.combat.max_hp}</span>
        </div>
        <div className="info-row">
          <span>AC: {character.combat.armor_class}</span>
          <span>Prof: +{character.combat.proficiency_bonus}</span>
        </div>
      </div>

      <div className="xp-bar">
        <div className="xp-label">XP: {character.experience}</div>
      </div>

      <div className="ability-scores">
        <div className="ability">
          <div className="ability-name">STR</div>
          <div className="ability-score">{character.ability_scores.strength}</div>
          <div className="ability-mod">{getAbilityModifier(character.ability_scores.strength)}</div>
        </div>
        <div className="ability">
          <div className="ability-name">DEX</div>
          <div className="ability-score">{character.ability_scores.dexterity}</div>
          <div className="ability-mod">{getAbilityModifier(character.ability_scores.dexterity)}</div>
        </div>
        <div className="ability">
          <div className="ability-name">CON</div>
          <div className="ability-score">{character.ability_scores.constitution}</div>
          <div className="ability-mod">{getAbilityModifier(character.ability_scores.constitution)}</div>
        </div>
        <div className="ability">
          <div className="ability-name">INT</div>
          <div className="ability-score">{character.ability_scores.intelligence}</div>
          <div className="ability-mod">{getAbilityModifier(character.ability_scores.intelligence)}</div>
        </div>
        <div className="ability">
          <div className="ability-name">WIS</div>
          <div className="ability-score">{character.ability_scores.wisdom}</div>
          <div className="ability-mod">{getAbilityModifier(character.ability_scores.wisdom)}</div>
        </div>
        <div className="ability">
          <div className="ability-name">CHA</div>
          <div className="ability-score">{character.ability_scores.charisma}</div>
          <div className="ability-mod">{getAbilityModifier(character.ability_scores.charisma)}</div>
        </div>
      </div>

      <div className="combat-record">
        <span>Wins: {character.wins}</span>
        <span>Losses: {character.losses}</span>
      </div>

      <button
        className="gain-exp-btn"
        onClick={() => onGainExp(character.id, 100)}
      >
        Train (+100 XP)
      </button>
    </div>
  );
}

export default CharacterCard;
