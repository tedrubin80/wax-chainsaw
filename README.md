# WAX RPG Collection Game

A blockchain-based RPG game combined with NFT collection mechanics on the WAX blockchain.

## Features

### Character NFT Collection
- Collectible characters with different rarities (Common, Rare, Epic, Legendary)
- Multiple character classes (Warrior, Mage, Rogue, Cleric)
- Unique stats and abilities per character
- Beautiful character artwork

### RPG Mechanics
- **Experience & Leveling**: Characters gain XP from battles and level up
- **Battle System**: Fight AI monsters or other players
- **Stats System**: STR, DEX, INT, VIT, LCK
- **Party System**: Collect and manage multiple characters

### Equipment & Items
- Collectible weapon and armor NFTs
- Equip items to boost character stats
- Rare loot drops from battles

### Progression
- Character evolution at certain levels
- Class upgrades and specializations
- Achievement system

## Tech Stack

- **Smart Contracts**: C++ (EOSIO/WAX)
- **Frontend**: React + WAX Cloud Wallet integration
- **Blockchain**: WAX

## Project Structure

```
/contracts      - Smart contracts
/include        - Contract headers
/frontend       - React frontend application
```

## Getting Started

### Prerequisites
- CDT (Contract Development Toolkit) for WAX
- Node.js and npm
- WAX testnet account

### Installation

```bash
# Install dependencies
npm install

# Compile smart contracts
./build.sh

# Run frontend
cd frontend
npm install
npm start
```

## Game Design

### Character Classes
- **Warrior**: High STR and VIT, tank role
- **Mage**: High INT, magical damage dealer
- **Rogue**: High DEX and LCK, critical hits and evasion
- **Cleric**: Balanced stats, support abilities

### Rarity System
- **Common**: Base stats
- **Rare**: +10% stats
- **Epic**: +25% stats
- **Legendary**: +50% stats, unique abilities

### Battle System
- Turn-based combat
- Damage calculation based on stats
- Critical hits and dodging
- Experience rewards

## Roadmap

- [ ] Phase 1: Core smart contracts (Characters, Stats, Leveling)
- [ ] Phase 2: Battle system implementation
- [ ] Phase 3: Equipment NFTs
- [ ] Phase 4: Frontend interface
- [ ] Phase 5: PvP battles
- [ ] Phase 6: Guild system

## License

MIT
