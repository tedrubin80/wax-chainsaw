#!/bin/bash

# WAX RPG Contract Deployment Script
# Usage: ./deploy.sh [account_name]

ACCOUNT=${1:-"qugxubmytjyw"}
CONTRACT_DIR="./contracts"

echo "========================================="
echo "WAX RPG Contract Deployment"
echo "========================================="
echo "Account: $ACCOUNT"
echo ""

# Check if compiled files exist
if [ ! -f "$CONTRACT_DIR/build/rpgcharacter.wasm" ]; then
    echo "Error: Contract WASM file not found!"
    echo "Please compile the contract first using build.sh"
    exit 1
fi

if [ ! -f "$CONTRACT_DIR/build/rpgcharacter.abi" ]; then
    echo "Error: Contract ABI file not found!"
    echo "Please compile the contract first using build.sh"
    exit 1
fi

echo "Step 1: Setting contract..."
cleos -u https://wax-testnet.eosphere.io set contract $ACCOUNT $CONTRACT_DIR/build rpgcharacter.wasm rpgcharacter.abi -p $ACCOUNT@active

echo ""
echo "Step 2: Initializing contract..."
cleos -u https://wax-testnet.eosphere.io push action $ACCOUNT init '[]' -p $ACCOUNT@active

echo ""
echo "========================================="
echo "Deployment complete!"
echo "Contract deployed to: $ACCOUNT"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update frontend/src/App.js with contract name if different"
echo "2. Test minting a character from the frontend"
echo ""
