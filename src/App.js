import React, { useEffect, useState } from 'react';

import walletIcon from './assets/wallet.svg';
import logo from './assets/logo.svg';
import NamiWalletApi, { Cardano } from './nami-js';
import './App.css';

let nami;

const blockfrostApiKey = {
  0: process.env.BLOCKFROST_API_KEY_TESTNET,
  1: process.env.BLOCKFROST_API_KEY_MAINNET,
};

const addresses = process.env.ADDRESSES.split(',');

export default function App() {
  const [connected, setConnected] = useState();
  const [address, setAddress] = useState();
  useEffect(() => {
    async function t() {
      const S = await Cardano();
      nami = new NamiWalletApi(S, window.cardano, blockfrostApiKey);

      if (await nami.isInstalled()) {
        await nami.isEnabled().then((result) => {
          setConnected(result);
        });
      }
    }

    t();
  }, []);

  useEffect(() => {
    if (connected) {
      getAddress();
    }
  }, [connected]);

  const connect = async () => {
    // Connects nami wallet to current website
    await nami
      .enable()
      .then((result) => setConnected(result))
      .catch((e) => console.log(e));
  };

  const getAddress = async () => {
    // retrieve address of nami wallet
    if (!connected) {
      await connect();
    }
    await nami.getAddress().then((newAddress) => {
      setAddress(newAddress);
    });
  };

  const handleStakeClick = (stakeAddress) => async (e) => {
    if (!connected) {
      await connect();
    }

    const promptAmount = prompt('Set amount').toString();

    const recipients = [{ address: stakeAddress, amount: promptAmount }];
    let utxos = await nami.getUtxosHex();
    const myAddress = await nami.getAddress();

    let netId = await nami.getNetworkId();
    const transaction = await nami.transaction({
      PaymentAddress: myAddress,
      recipients: recipients,
      metadata: null,
      utxosRaw: utxos,
      networkId: netId.id,
      ttl: 3600,
      multiSig: null,
    });

    const witnesses = await nami.signTx(transaction);

    const txHash = await nami.submitTx({
      transactionRaw: transaction,
      witnesses: [witnesses],
      networkId: netId.id,
    });

    console.log("stakeAddress", stakeAddress)
    console.log("promptAmount", promptAmount)
    console.log("recipients", recipients)
    console.log("utxos", utxos)
    console.log("myAddress", myAddress)
    console.log("transaction", transaction)
    console.log("witnesses", witnesses)

    console.log('Transaction ready. txHash == ', txHash);
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="logo" />
        <button className="connectButton" onClick={connect}>
          {connected && address
            ? `${address.substring(0, 6)}....${address.substring(address.length - 6)}`
            : 'Connect wallet'}
          <img src={walletIcon} alt="wallet" className="header-icon_connect" />
        </button>
      </div>
      <div className="pools">
        {addresses.map((stakeAddress, index) => (
          <div key={index} className="pool">
            {`${stakeAddress.substring(0, 20)}....${stakeAddress.substring(stakeAddress.length - 20)}`}
            <button className="stakeButton" onClick={handleStakeClick(stakeAddress)}>
              Stake
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
