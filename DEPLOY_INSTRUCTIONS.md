# Deployment Instructions for WAX RPG Game

## ✅ Build Complete!

Your smart contract has been successfully compiled:
- **Contract WASM**: `contracts/build/rpgcharacter.wasm`
- **Contract ABI**: `contracts/build/rpgcharacter.abi`

## Deploy to WAX Testnet

### Option 1: Using cleos (Command Line)

#### Step 1: Install cleos (if not already installed)
```bash
wget https://github.com/AntelopeIO/leap/releases/download/v3.2.0/leap_3.2.0-ubuntu22.04_amd64.deb
echo "qugxub-mytjyw-gamPo8" | sudo -S dpkg -i leap_3.2.0-ubuntu22.04_amd64.deb
```

#### Step 2: Set up your wallet
```bash
# Create wallet
cleos wallet create -n wax --to-console

# Import your private key for qugxubmytjyw
cleos wallet import -n wax --private-key YOUR_PRIVATE_KEY
```

#### Step 3: Deploy the contract
```bash
# Set contract
cleos -u https://wax-testnet.eosphere.io set contract qugxubmytjyw ./contracts/build rpgcharacter.wasm rpgcharacter.abi -p qugxubmytjyw@active

# Initialize contract
cleos -u https://wax-testnet.eosphere.io push action qugxubmytjyw init '[]' -p qugxubmytjyw@active
```

### Option 2: Using Bloks.io (Web Interface)

1. **Go to**: https://wax-test.bloks.io/wallet/transfer

2. **Login** with your WAX Cloud Wallet (qugxub-mytjyw-gamPo8 account)

3. **Navigate to**: Contract → Set Contract

4. **Upload Files**:
   - Contract Account: `qugxubmytjyw`
   - WASM File: Upload `contracts/build/rpgcharacter.wasm`
   - ABI File: Upload `contracts/build/rpgcharacter.abi`

5. **Set Contract** and sign the transaction

6. **Initialize**: Go to Contract → Push Action
   - Account: `qugxubmytjyw`
   - Action: `init`
   - Data: `{}`
   - Sign and execute

### Option 3: Using EOS Studio (Online IDE)

1. **Go to**: https://eos.studio/

2. **Create New Project** → Import existing contract

3. **Upload Files**:
   - Copy contents of `rpgcharacter.cpp`
   - Or upload the compiled .wasm and .abi files

4. **Deploy**:
   - Account: `qugxubmytjyw`
   - Network: WAX Testnet
   - Deploy and initialize

## After Deployment

### Test the Contract

#### Mint a Character
```bash
cleos -u https://wax-testnet.eosphere.io push action qugxubmytjyw mintchar '["YOUR_ACCOUNT", "Aragorn", 4, 0, 2]' -p YOUR_ACCOUNT@active
```

Parameters:
- "YOUR_ACCOUNT" - Your WAX account
- "Aragorn" - Character name
- 4 - Class (0=Barbarian, 1=Bard, 2=Cleric, 3=Druid, 4=Fighter, etc.)
- 0 - Race (0=Human, 1=Elf, 2=Dwarf, etc.)
- 2 - Rarity (0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary)

#### View Characters
```bash
cleos -u https://wax-testnet.eosphere.io get table qugxubmytjyw qugxubmytjyw characters
```

#### Gain Experience
```bash
cleos -u https://wax-testnet.eosphere.io push action qugxubmytjyw gainexp '[1, 500]' -p YOUR_ACCOUNT@active
```
Parameters: [character_id, exp_amount]

#### Battle
```bash
cleos -u https://wax-testnet.eosphere.io push action qugxubmytjyw battle '[1, 2]' -p YOUR_ACCOUNT@active
```
Parameters: [attacker_id, defender_id]

## Run the Frontend

```bash
cd frontend
npm start
```

The app will open at http://localhost:3000

### Connect Your Wallet
1. Click "Connect WAX Wallet"
2. Login with WAX Cloud Wallet
3. Approve the connection

### Use the App
- **My Collection**: View all your characters
- **Battle Arena**: Fight other characters
- **Mint Character**: Create new character NFTs

## Contract Actions Reference

| Action | Parameters | Description |
|--------|-----------|-------------|
| `init` | - | Initialize contract (admin only, run once) |
| `mintchar` | owner, name, class, race, rarity | Mint a new character NFT |
| `gainexp` | character_id, exp_amount | Award XP to a character |
| `battle` | attacker_id, defender_id | PvP battle between characters |
| `equip` | character_id, equipment_id | Equip weapon/armor to character |
| `rest` | character_id | Restore character HP to maximum |

## Classes (0-11)
0. Barbarian, 1. Bard, 2. Cleric, 3. Druid, 4. Fighter, 5. Monk
6. Paladin, 7. Ranger, 8. Rogue, 9. Sorcerer, 10. Warlock, 11. Wizard

## Races (0-8)
0. Human, 1. Elf, 2. Dwarf, 3. Halfling, 4. Dragonborn
5. Gnome, 6. Half-Elf, 7. Half-Orc, 8. Tiefling

## Rarity (0-4)
0. Common (+0 stats)
1. Uncommon (+1 all stats)
2. Rare (+2 all stats)
3. Epic (+3 all stats)
4. Legendary (+4 all stats)

## Troubleshooting

**"Missing required authority"**
- Make sure you're using the correct account
- Check that your wallet is unlocked

**"Contract not found"**
- Verify the contract is deployed: `cleos -u https://wax-testnet.eosphere.io get code qugxubmytjyw`

**Frontend can't connect**
- Check RPC endpoint is accessible
- Verify contract account name in App.js
- Make sure WAX Cloud Wallet is installed

## Important Notes

- **Admin Account**: `qugxubmytjyw` (from qugxub-mytjyw-gamPo8)
- **Network**: WAX Testnet
- **RPC**: https://wax-testnet.eosphere.io
- **Explorer**: https://wax-test.bloks.io/account/qugxubmytjyw

## Next Steps

1. ✅ Contract compiled
2. ⏳ Deploy contract to testnet
3. ⏳ Initialize with `init` action
4. ⏳ Test minting characters
5. ⏳ Launch frontend
6. 🎮 Start playing!

Good luck, adventurer! 🎲⚔️
