import React, { useState, useEffect } from 'react';
import './LandingPage.css';

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

const MOCK_CHARACTERS = [
  {
    id: 1,
    name: 'Thorin Ironforge',
    level: 12,
    char_class: 0,
    char_race: 2,
    rarity_level: 3,
    experience: 100000,
    ability_scores: { strength: 20, dexterity: 14, constitution: 18, intelligence: 10, wisdom: 13, charisma: 8 },
    combat: { current_hp: 125, max_hp: 125, armor_class: 16, proficiency_bonus: 4 },
    wins: 47,
    losses: 12
  },
  {
    id: 2,
    name: 'Lyra Moonshadow',
    level: 8,
    char_class: 11,
    char_race: 1,
    rarity_level: 4,
    experience: 34000,
    ability_scores: { strength: 8, dexterity: 16, constitution: 14, intelligence: 20, wisdom: 15, charisma: 12 },
    combat: { current_hp: 42, max_hp: 42, armor_class: 13, proficiency_bonus: 3 },
    wins: 31,
    losses: 8
  },
  {
    id: 3,
    name: 'Kael Stormborn',
    level: 15,
    char_class: 6,
    char_race: 4,
    rarity_level: 2,
    experience: 195000,
    ability_scores: { strength: 18, dexterity: 12, constitution: 16, intelligence: 10, wisdom: 15, charisma: 17 },
    combat: { current_hp: 112, max_hp: 112, armor_class: 18, proficiency_bonus: 5 },
    wins: 63,
    losses: 15
  }
];

const MOCK_BATTLE_LOG = [
  { round: 1, attacker: 'Thorin Ironforge', roll: 18, hit: true, damage: 12, defenderHp: 100 },
  { round: 1, attacker: 'Kael Stormborn', roll: 14, hit: false, damage: 0, defenderHp: 125 },
  { round: 2, attacker: 'Thorin Ironforge', roll: 20, hit: true, damage: 16, defenderHp: 84 },
  { round: 2, attacker: 'Kael Stormborn', roll: 19, hit: true, damage: 14, defenderHp: 111 },
  { round: 3, attacker: 'Thorin Ironforge', roll: 11, hit: false, damage: 0, defenderHp: 84 },
  { round: 3, attacker: 'Kael Stormborn', roll: 17, hit: true, damage: 11, defenderHp: 100 },
];

function LandingPage({ onEnterApp }) {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeBattleRound, setActiveBattleRound] = useState(0);
  const [rollingDice, setRollingDice] = useState(false);
  const [diceValue, setDiceValue] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.landing-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBattleRound(prev => (prev + 1) % MOCK_BATTLE_LOG.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const rollDice = () => {
    setRollingDice(true);
    setDiceValue(null);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 20) + 1);
      rolls++;
      if (rolls >= 10) {
        clearInterval(interval);
        setDiceValue(Math.floor(Math.random() * 20) + 1);
        setRollingDice(false);
      }
    }, 80);
  };

  const getAbilityModifier = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Blockchain RPG Project</div>
          <h1 className="hero-title">WAX RPG Collection</h1>
          <p className="hero-subtitle">
            A full-stack blockchain RPG built on WAX, combining NFT collectible mechanics
            with authentic D&D 5th Edition tabletop rules
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">12</span>
              <span className="hero-stat-label">Character Classes</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">9</span>
              <span className="hero-stat-label">Playable Races</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">540+</span>
              <span className="hero-stat-label">Lines of C++</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">5</span>
              <span className="hero-stat-label">Rarity Tiers</span>
            </div>
          </div>
          <div className="hero-actions">
            <a href="#features" className="hero-btn primary">Explore Features</a>
            <a href="https://github.com" className="hero-btn secondary" target="_blank" rel="noopener noreferrer">View Source</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-glow"></div>
            <div className="mini-card" style={{borderColor: RARITY_COLORS[3]}}>
              <div className="mini-card-header">
                <span className="mini-card-name">Thorin Ironforge</span>
                <span style={{color: RARITY_COLORS[3], fontSize: '0.7rem', fontWeight: 'bold'}}>EPIC</span>
              </div>
              <div className="mini-card-info">Level 12 Barbarian</div>
              <div className="mini-card-info">Dwarf</div>
              <div className="mini-card-stats">
                <span>HP 125</span>
                <span>AC 16</span>
                <span>W/L 47/12</span>
              </div>
              <div className="mini-ability-grid">
                {Object.entries(MOCK_CHARACTERS[0].ability_scores).map(([key, val]) => (
                  <div key={key} className="mini-ability">
                    <div className="mini-ability-label">{key.substring(0,3).toUpperCase()}</div>
                    <div className="mini-ability-value">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className={`landing-section tech-section ${visibleSections.has('tech') ? 'visible' : ''}`}>
        <h2 className="section-title">Tech Stack</h2>
        <p className="section-subtitle">Built with modern blockchain and web technologies</p>
        <div className="tech-grid">
          <div className="tech-card">
            <div className="tech-icon">&#x2699;</div>
            <h3>Smart Contract</h3>
            <p>C++ on EOSIO/WAX blockchain with multi-index tables, secondary indexes, and on-chain game logic</p>
            <div className="tech-tags">
              <span className="tech-tag">C++</span>
              <span className="tech-tag">EOSIO</span>
              <span className="tech-tag">WAX CDT</span>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-icon">&#x269B;</div>
            <h3>Frontend</h3>
            <p>React 18 with hooks-based state management and WAX Cloud Wallet integration</p>
            <div className="tech-tags">
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">JavaScript</span>
              <span className="tech-tag">CSS3</span>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-icon">&#x1F517;</div>
            <h3>Blockchain</h3>
            <p>WAX blockchain for NFT minting, on-chain combat resolution, and decentralized character ownership</p>
            <div className="tech-tags">
              <span className="tech-tag">WAX</span>
              <span className="tech-tag">waxjs</span>
              <span className="tech-tag">eosjs</span>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-icon">&#x1F3B2;</div>
            <h3>Game Design</h3>
            <p>Faithful D&D 5e mechanics including standard array, proficiency scaling, and XP progression</p>
            <div className="tech-tags">
              <span className="tech-tag">D&D 5e</span>
              <span className="tech-tag">d20 System</span>
              <span className="tech-tag">NFT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Character System Section */}
      <section id="features" className={`landing-section features-section ${visibleSections.has('features') ? 'visible' : ''}`}>
        <h2 className="section-title">Character System</h2>
        <p className="section-subtitle">Full D&D 5e character creation with on-chain NFT minting</p>

        <div className="feature-showcase">
          <div className="showcase-cards">
            {MOCK_CHARACTERS.map((char) => (
              <div key={char.id} className="showcase-character" style={{borderColor: RARITY_COLORS[char.rarity_level]}}>
                <div className="showcase-header">
                  <h3>{char.name}</h3>
                  <span className="showcase-rarity" style={{color: RARITY_COLORS[char.rarity_level]}}>
                    {RARITY_NAMES[char.rarity_level]}
                  </span>
                </div>
                <div className="showcase-meta">
                  <span>Level {char.level} {CLASS_NAMES[char.char_class]}</span>
                  <span>{RACE_NAMES[char.char_race]}</span>
                </div>
                <div className="showcase-combat">
                  <span>HP: {char.combat.current_hp}/{char.combat.max_hp}</span>
                  <span>AC: {char.combat.armor_class}</span>
                  <span>Prof: +{char.combat.proficiency_bonus}</span>
                </div>
                <div className="showcase-abilities">
                  {Object.entries(char.ability_scores).map(([key, val]) => (
                    <div key={key} className="showcase-ability">
                      <span className="ability-label">{key.substring(0,3).toUpperCase()}</span>
                      <span className="ability-val">{val}</span>
                      <span className="ability-mod-small">{getAbilityModifier(val)}</span>
                    </div>
                  ))}
                </div>
                <div className="showcase-record">
                  <span>Wins: {char.wins}</span>
                  <span>Losses: {char.losses}</span>
                  <span>Win Rate: {Math.round(char.wins / (char.wins + char.losses) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="feature-details">
            <div className="feature-detail-card">
              <h4>12 Character Classes</h4>
              <div className="class-grid">
                {CLASS_NAMES.map((name, idx) => (
                  <span key={idx} className="class-chip">{name}</span>
                ))}
              </div>
            </div>
            <div className="feature-detail-card">
              <h4>9 Playable Races</h4>
              <div className="class-grid">
                {RACE_NAMES.map((name, idx) => (
                  <span key={idx} className="class-chip race-chip">{name}</span>
                ))}
              </div>
            </div>
            <div className="feature-detail-card">
              <h4>5 Rarity Tiers</h4>
              <div className="rarity-showcase">
                {RARITY_NAMES.map((name, idx) => (
                  <span key={idx} className="rarity-chip" style={{borderColor: RARITY_COLORS[idx], color: RARITY_COLORS[idx]}}>
                    {name} (+{idx})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battle System Section */}
      <section id="battle" className={`landing-section battle-section ${visibleSections.has('battle') ? 'visible' : ''}`}>
        <h2 className="section-title">Combat System</h2>
        <p className="section-subtitle">Turn-based PvP with authentic d20 mechanics, resolved entirely on-chain</p>

        <div className="battle-showcase">
          <div className="battle-demo">
            <div className="battle-combatants">
              <div className="combatant left">
                <div className="combatant-name">Thorin Ironforge</div>
                <div className="combatant-class">Lv.12 Barbarian</div>
                <div className="combatant-hp">
                  <div className="hp-bar">
                    <div className="hp-fill" style={{
                      width: `${(MOCK_BATTLE_LOG[activeBattleRound].attacker === 'Thorin Ironforge'
                        ? 125 : MOCK_BATTLE_LOG[activeBattleRound].defenderHp) / 125 * 100}%`
                    }}></div>
                  </div>
                  <span className="hp-text">
                    {MOCK_BATTLE_LOG[activeBattleRound].attacker === 'Thorin Ironforge'
                      ? 125 : MOCK_BATTLE_LOG[activeBattleRound].defenderHp}/125 HP
                  </span>
                </div>
              </div>

              <div className="vs-badge">VS</div>

              <div className="combatant right">
                <div className="combatant-name">Kael Stormborn</div>
                <div className="combatant-class">Lv.15 Paladin</div>
                <div className="combatant-hp">
                  <div className="hp-bar">
                    <div className="hp-fill paladin" style={{
                      width: `${(MOCK_BATTLE_LOG[activeBattleRound].attacker === 'Kael Stormborn'
                        ? 112 : MOCK_BATTLE_LOG[activeBattleRound].defenderHp) / 112 * 100}%`
                    }}></div>
                  </div>
                  <span className="hp-text">
                    {MOCK_BATTLE_LOG[activeBattleRound].attacker === 'Kael Stormborn'
                      ? 112 : MOCK_BATTLE_LOG[activeBattleRound].defenderHp}/112 HP
                  </span>
                </div>
              </div>
            </div>

            <div className="battle-log">
              {MOCK_BATTLE_LOG.map((entry, idx) => (
                <div key={idx} className={`log-entry ${idx === activeBattleRound ? 'active' : ''} ${idx < activeBattleRound ? 'past' : ''}`}>
                  <span className="log-round">R{entry.round}</span>
                  <span className="log-name">{entry.attacker}</span>
                  <span className="log-roll">d20: {entry.roll}</span>
                  <span className={`log-result ${entry.hit ? 'hit' : 'miss'}`}>
                    {entry.hit ? `HIT! ${entry.damage} dmg` : 'MISS'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="battle-mechanics">
            <h3>Combat Mechanics</h3>
            <div className="mechanic-list">
              <div className="mechanic-item">
                <div className="mechanic-icon">d20</div>
                <div>
                  <strong>Attack Rolls</strong>
                  <p>d20 + ability modifier + proficiency vs target Armor Class</p>
                </div>
              </div>
              <div className="mechanic-item">
                <div className="mechanic-icon">!</div>
                <div>
                  <strong>Critical Hits</strong>
                  <p>Natural 20 always hits. Natural 1 always misses.</p>
                </div>
              </div>
              <div className="mechanic-item">
                <div className="mechanic-icon">HP</div>
                <div>
                  <strong>Hit Points</strong>
                  <p>Class-specific hit dice (d6-d12) + CON modifier per level</p>
                </div>
              </div>
              <div className="mechanic-item">
                <div className="mechanic-icon">XP</div>
                <div>
                  <strong>Rewards</strong>
                  <p>Winner earns XP based on opponent level. Full D&D 5e progression to level 20.</p>
                </div>
              </div>
            </div>

            <div className="dice-roller">
              <button className={`roll-btn ${rollingDice ? 'rolling' : ''}`} onClick={rollDice} disabled={rollingDice}>
                {rollingDice ? 'Rolling...' : 'Roll a d20'}
              </button>
              {diceValue !== null && !rollingDice && (
                <div className={`dice-result ${diceValue === 20 ? 'crit' : diceValue === 1 ? 'fumble' : ''}`}>
                  <span className="dice-number">{diceValue}</span>
                  <span className="dice-label">
                    {diceValue === 20 ? 'CRITICAL HIT!' : diceValue === 1 ? 'CRITICAL MISS!' : `Rolled ${diceValue}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Smart Contract Section */}
      <section id="contract" className={`landing-section contract-section ${visibleSections.has('contract') ? 'visible' : ''}`}>
        <h2 className="section-title">Smart Contract Architecture</h2>
        <p className="section-subtitle">540+ lines of C++ powering on-chain game logic</p>

        <div className="contract-showcase">
          <div className="contract-actions">
            <h3>Contract Actions</h3>
            <div className="action-list">
              <div className="action-item">
                <code className="action-name">mintchar()</code>
                <span className="action-desc">Create a new character NFT with class, race, and rarity</span>
              </div>
              <div className="action-item">
                <code className="action-name">battle()</code>
                <span className="action-desc">PvP combat with d20 rolls resolved on-chain</span>
              </div>
              <div className="action-item">
                <code className="action-name">gainexp()</code>
                <span className="action-desc">Award XP with automatic level-up and stat recalculation</span>
              </div>
              <div className="action-item">
                <code className="action-name">equip()</code>
                <span className="action-desc">Equip weapons and armor to modify character stats</span>
              </div>
              <div className="action-item">
                <code className="action-name">rest()</code>
                <span className="action-desc">Long rest to restore character to full HP</span>
              </div>
            </div>
          </div>

          <div className="contract-tables">
            <h3>On-Chain Data</h3>
            <div className="table-card">
              <h4>characters</h4>
              <p>Multi-index table with secondary indexes by owner and level. Stores ability scores, combat stats, equipment slots, and battle records.</p>
              <div className="table-indexes">
                <span className="index-tag">Primary: id</span>
                <span className="index-tag">byowner</span>
                <span className="index-tag">bylevel</span>
              </div>
            </div>
            <div className="table-card">
              <h4>equipment</h4>
              <p>Weapons and armor NFTs with damage dice, AC bonuses, and stat modifiers. Linked to characters via equip slots.</p>
              <div className="table-indexes">
                <span className="index-tag">Primary: id</span>
                <span className="index-tag">byowner</span>
              </div>
            </div>
            <div className="table-card">
              <h4>config</h4>
              <p>Singleton storing global state: auto-incrementing IDs, mint pricing, and contract configuration.</p>
              <div className="table-indexes">
                <span className="index-tag">Singleton</span>
              </div>
            </div>
          </div>
        </div>

        <div className="code-preview">
          <div className="code-header">
            <span className="code-dot red"></span>
            <span className="code-dot yellow"></span>
            <span className="code-dot green"></span>
            <span className="code-filename">rpgcharacter.cpp</span>
          </div>
          <pre className="code-block"><code>{`// D&D 5e Character Classes
enum char_class : uint8_t {
    BARBARIAN = 0, BARD = 1, CLERIC = 2,
    DRUID = 3, FIGHTER = 4, MONK = 5,
    PALADIN = 6, RANGER = 7, ROGUE = 8,
    SORCERER = 9, WARLOCK = 10, WIZARD = 11
};

// Character NFT with full D&D 5e stats
TABLE character {
    uint64_t    id;
    name        owner;
    string      char_name;
    uint8_t     char_class;
    uint8_t     char_race;
    uint8_t     rarity_level;
    uint8_t     level;
    uint32_t    experience;
    stats       ability_scores;  // STR, DEX, CON, INT, WIS, CHA
    combat_stats combat;         // HP, AC, proficiency
    uint32_t    wins;
    uint32_t    losses;
    // ... secondary indexes for queries
};`}</code></pre>
        </div>
      </section>

      {/* Progression System */}
      <section id="progression" className={`landing-section progression-section ${visibleSections.has('progression') ? 'visible' : ''}`}>
        <h2 className="section-title">Progression System</h2>
        <p className="section-subtitle">D&D 5e experience tables, level-up mechanics, and ability score improvements</p>

        <div className="progression-showcase">
          <div className="xp-table">
            <h3>XP Thresholds</h3>
            <div className="xp-entries">
              {[
                { level: 1, xp: '0' },
                { level: 2, xp: '300' },
                { level: 3, xp: '900' },
                { level: 4, xp: '2,700', asi: true },
                { level: 5, xp: '6,500' },
                { level: 8, xp: '34,000', asi: true },
                { level: 10, xp: '64,000' },
                { level: 12, xp: '100,000', asi: true },
                { level: 15, xp: '195,000' },
                { level: 20, xp: '355,000' },
              ].map((entry) => (
                <div key={entry.level} className={`xp-entry ${entry.asi ? 'asi-level' : ''}`}>
                  <span className="xp-level">Lv.{entry.level}</span>
                  <span className="xp-amount">{entry.xp} XP</span>
                  {entry.asi && <span className="asi-badge">ASI</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="progression-features">
            <div className="prog-card">
              <h4>Hit Dice by Class</h4>
              <div className="hitdice-grid">
                <div className="hitdice-item">
                  <span className="hitdice-die">d12</span>
                  <span className="hitdice-class">Barbarian</span>
                </div>
                <div className="hitdice-item">
                  <span className="hitdice-die">d10</span>
                  <span className="hitdice-class">Fighter, Paladin, Ranger</span>
                </div>
                <div className="hitdice-item">
                  <span className="hitdice-die">d8</span>
                  <span className="hitdice-class">Bard, Cleric, Druid, Monk, Rogue, Warlock</span>
                </div>
                <div className="hitdice-item">
                  <span className="hitdice-die">d6</span>
                  <span className="hitdice-class">Sorcerer, Wizard</span>
                </div>
              </div>
            </div>

            <div className="prog-card">
              <h4>Proficiency Bonus</h4>
              <div className="prof-grid">
                {[
                  { levels: '1-4', bonus: '+2' },
                  { levels: '5-8', bonus: '+3' },
                  { levels: '9-12', bonus: '+4' },
                  { levels: '13-16', bonus: '+5' },
                  { levels: '17-20', bonus: '+6' },
                ].map((entry) => (
                  <div key={entry.levels} className="prof-item">
                    <span className="prof-levels">Lv.{entry.levels}</span>
                    <span className="prof-bonus">{entry.bonus}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="prog-card">
              <h4>Ability Score Improvements</h4>
              <p className="prog-desc">
                At levels 4, 8, 12, 16, and 19, characters receive +2 to their primary ability score,
                following D&D 5e ASI rules. Stats are automatically optimized for each class.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section id="architecture" className={`landing-section architecture-section ${visibleSections.has('architecture') ? 'visible' : ''}`}>
        <h2 className="section-title">Project Architecture</h2>
        <p className="section-subtitle">Clean separation between on-chain logic and frontend interface</p>

        <div className="arch-diagram">
          <div className="arch-layer">
            <div className="arch-label">Frontend</div>
            <div className="arch-boxes">
              <div className="arch-box frontend">React 18 UI</div>
              <div className="arch-box frontend">WAX Cloud Wallet</div>
              <div className="arch-box frontend">Component System</div>
            </div>
          </div>
          <div className="arch-arrow">&#x2193; waxjs / eosjs &#x2193;</div>
          <div className="arch-layer">
            <div className="arch-label">Blockchain</div>
            <div className="arch-boxes">
              <div className="arch-box chain">Smart Contract (C++)</div>
              <div className="arch-box chain">Multi-Index Tables</div>
              <div className="arch-box chain">WAX Testnet</div>
            </div>
          </div>
          <div className="arch-arrow">&#x2193; On-Chain Storage &#x2193;</div>
          <div className="arch-layer">
            <div className="arch-label">Data</div>
            <div className="arch-boxes">
              <div className="arch-box data">Characters Table</div>
              <div className="arch-box data">Equipment Table</div>
              <div className="arch-box data">Config Singleton</div>
            </div>
          </div>
        </div>

        <div className="project-structure">
          <h3>Project Structure</h3>
          <pre className="structure-tree">{`wax-rpg-collection/
  contracts/
    rpgcharacter.cpp      # Smart contract (540+ lines C++)
    CMakeLists.txt        # Build configuration
  frontend/
    src/
      App.js              # Main application
      components/
        CharacterCard.js   # Character display
        BattleArena.js     # PvP battle interface
        MintCharacter.js   # Character creation
    package.json          # React dependencies
  build.sh                # Contract compilation
  deploy.sh               # Testnet deployment
  Documentation/          # Setup & deployment guides`}</pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>WAX RPG Collection</h3>
            <p>A blockchain RPG portfolio project</p>
          </div>
          <div className="footer-links">
            <h4>Project</h4>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">Source Code</a>
            <a href="#features">Features</a>
            <a href="#contract">Smart Contract</a>
          </div>
          <div className="footer-links">
            <h4>Built With</h4>
            <span>React 18</span>
            <span>WAX Blockchain</span>
            <span>C++ / EOSIO</span>
            <span>D&D 5e SRD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
