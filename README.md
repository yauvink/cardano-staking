# Nami Wallet

## Setup
To run the application locally these installation steps:
```
// Install packages for application
npm install

// Install the module with cardano serialization lib
cd src/nami-js
npm install

// Return to workspace
cd ../..
```
To run the application start the node process with
```
npm run start
```
Run our example app to try out the functionalities of our package.

Before you can use the NamiWalletApi you have to create an account to get a blockfrost api key https://blockfrost.io/.
Create a ```.env``` file and add your API key information.
```js

BLOCKFROST_API_KEY_TESTNET=""    //testnet
BLOCKFROST_API_KEY_MAINNET=""    //mainnet
ADDRESSES="  ,  ,  ,  ,  "       //addresses split by ','

```

