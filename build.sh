#!/bin/bash

echo "========================================="
echo "Building WAX RPG Character Contract"
echo "========================================="

# Check if CDT is installed
if ! command -v cdt-cpp &> /dev/null && ! command -v eosio-cpp &> /dev/null; then
    echo "Error: CDT (Contract Development Toolkit) not found!"
    echo ""
    echo "Please install CDT first:"
    echo "  wget https://github.com/AntelopeIO/cdt/releases/download/v3.1.0/cdt_3.1.0_amd64.deb"
    echo "  sudo apt install ./cdt_3.1.0_amd64.deb"
    echo ""
    echo "Or see SETUP.md for detailed instructions"
    exit 1
fi

# Determine which compiler to use
if command -v cdt-cpp &> /dev/null; then
    COMPILER="cdt-cpp"
elif command -v eosio-cpp &> /dev/null; then
    COMPILER="eosio-cpp"
fi

echo "Using compiler: $COMPILER"
echo ""

cd contracts
mkdir -p build

echo "Compiling contract..."
$COMPILER -abigen -o build/rpgcharacter.wasm rpgcharacter.cpp -I../include

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "Build successful!"
    echo "========================================="
    echo "Output files:"
    echo "  - contracts/build/rpgcharacter.wasm"
    echo "  - contracts/build/rpgcharacter.abi"
    echo ""
    echo "Next step: Deploy with ./deploy.sh"
else
    echo ""
    echo "Build failed! Check error messages above."
    exit 1
fi
