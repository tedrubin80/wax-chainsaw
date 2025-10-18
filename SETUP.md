# Setup Instructions

## Prerequisites

### 1. Install CDT (Contract Development Toolkit)

You need to install CDT to compile the smart contract. Choose one option:

#### Option A: Install via Package Manager (Recommended)
```bash
# For Ubuntu/Debian
wget https://github.com/AntelopeIO/cdt/releases/download/v3.1.0/cdt_3.1.0_amd64.deb
sudo apt install ./cdt_3.1.0_amd64.deb
```

#### Option B: Install from Source
```bash
git clone https://github.com/AntelopeIO/cdt.git
cd cdt
git checkout v3.1.0
mkdir build && cd build
cmake ..
make
sudo make install
```

### 2. Install Node.js and npm
```bash
# Check if installed
node --version
npm --version

# If not installed (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install cleos (for deployment)
```bash
# For Ubuntu/Debian
wget https://github.com/AntelopeIO/leap/releases/download/v3.2.0/leap_3.2.0-ubuntu22.04_amd64.deb
sudo apt install ./leap_3.2.0-ubuntu22.04_amd64.deb
```

## Build Steps

### 1. Compile Smart Contract
```bash
./build.sh
```

This will create:
- `contracts/build/rpgcharacter.wasm` - The compiled contract
- `contracts/build/rpgcharacter.abi` - The ABI (interface definition)

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Deploy Contract to WAX Testnet

First, get a WAX testnet account at https://waxsweden.org/testnet/

Then deploy:
```bash
./deploy.sh qugxubmytjyw
```

### 4. Run Frontend Development Server
```bash
cd frontend
npm start
```

The app will open at http://localhost:3000

## Contract Account

Admin Account: qugxub-mytjyw-gamPo8
Contract Name: qugxubmytjyw

## Testing on Testnet

1. Get WAX testnet tokens from the faucet
2. Connect your WAX Cloud Wallet to testnet
3. Mint your first character!

## Alternative: Use Online IDE

If you don't want to install CDT locally, you can use:
- https://eos.studio/ - Online EOSIO IDE
- Copy/paste the contract code and compile there
- Download the .wasm and .abi files

## Troubleshooting

### "eosio-cpp: command not found"
- CDT is not installed or not in PATH
- Follow installation steps above

### "cleos: command not found"
- Leap/cleos is not installed
- Only needed for deployment, not compilation

### Frontend won't start
- Make sure you're in the frontend directory
- Run `npm install` first
- Check that Node.js is installed

## Next Steps After Setup

1. Initialize the contract with `init` action
2. Test minting a character
3. Try the battle system
4. Customize character artwork/metadata
