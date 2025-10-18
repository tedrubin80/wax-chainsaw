# WAX RPG Collection Game - Quick Start

## Project Status

Your D&D 5e RPG Collection Game on WAX is ready to build!

### What's Complete:
- ✅ Smart contract with D&D 5e mechanics
- ✅ Frontend interface with React
- ✅ Contract account configured: `qugxubmytjyw`
- ✅ All game features implemented

### What's Needed:

#### 1. Install Development Tools

**CDT (Contract Development Toolkit)** - To compile smart contracts:
```bash
wget https://github.com/AntelopeIO/cdt/releases/download/v3.1.0/cdt_3.1.0_amd64.deb
sudo apt install ./cdt_3.1.0_amd64.deb
```

**Node.js and npm** - To run the frontend:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Cleos (Optional)** - To deploy the contract:
```bash
wget https://github.com/AntelopeIO/leap/releases/download/v3.2.0/leap_3.2.0-ubuntu22.04_amd64.deb
sudo apt install ./leap_3.2.0-ubuntu22.04_amd64.deb
```

#### 2. Build the Project

```bash
# Compile smart contract
./build.sh

# Install frontend dependencies
cd frontend
npm install

# Run frontend
npm start
```

#### 3. Deploy to WAX Testnet

```bash
# Get testnet account at https://waxsweden.org/testnet/
# Then deploy:
./deploy.sh qugxubmytjyw
```

## Game Features

### D&D 5e Character System
- **12 Classes**: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard
- **9 Races**: Human, Elf, Dwarf, Halfling, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling
- **5 Rarity Levels**: Common (+0), Uncommon (+1), Rare (+2), Epic (+3), Legendary (+4)
- **Level 1-20 Progression**: Full D&D 5e XP tables and hit dice
- **Ability Score Improvements**: At levels 4, 8, 12, 16, 19

### Combat System
- Turn-based battles with d20 attack rolls
- Armor Class (AC) and Hit Points (HP)
- Critical hits (Natural 20) and auto-miss (Natural 1)
- Proficiency bonus progression
- Class-specific hit dice (d6-d12)

### NFT Mechanics
- Each character is a unique collectible NFT
- Equipment system for weapons and armor
- Battle other players to gain XP
- Long rest to restore HP

## Smart Contract Actions

| Action | Parameters | Description |
|--------|-----------|-------------|
| `init` | - | Initialize the contract (admin only) |
| `mintchar` | owner, name, class, race, rarity | Mint a new character NFT |
| `gainexp` | character_id, exp_amount | Award XP to a character |
| `battle` | attacker_id, defender_id | Battle two characters |
| `equip` | character_id, equipment_id | Equip weapon/armor |
| `rest` | character_id | Restore character to full HP |

## Frontend Routes

- **My Collection**: View all your character NFTs with stats
- **Battle Arena**: Fight other characters in PvP battles
- **Mint Character**: Create new character NFTs

## Project Structure

```
wax-project/
├── contracts/
│   ├── rpgcharacter.cpp      # Main smart contract
│   └── CMakeLists.txt         # Build configuration
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main app component
│   │   ├── components/       # React components
│   │   └── index.js          # Entry point
│   └── package.json          # Dependencies
├── build.sh                   # Compile contract script
├── deploy.sh                  # Deploy contract script
└── README.md                  # Full documentation

```

## Next Steps

1. **Install Tools**: Follow installation instructions above
2. **Compile**: Run `./build.sh` to compile the contract
3. **Deploy**: Use `./deploy.sh` to deploy to testnet
4. **Test**: Open frontend and mint your first character!

## Need Help?

- Full setup guide: See `SETUP.md`
- Contract documentation: See `README.md`
- WAX Testnet: https://waxsweden.org/testnet/
- WAX Discord: https://discord.gg/dJtPetMdfb

## Admin Account

- Full Name: `qugxub-mytjyw-gamPo8`
- Contract Account: `qugxubmytjyw`
- Network: WAX Testnet

Happy gaming! 🎲⚔️
