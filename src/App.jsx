import React, { useEffect, useState } from 'react';

import NamiWalletApi, { Cardano } from './nami-js/nami';
import Pool from './components/pool';
import Header from './components/header';
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
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [stakeAddress, setStakeAddress] = useState(false);

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
    console.log('connect');
    await nami
      .enable()
      .then((result) => setConnected(result))
      .catch((e) => console.log(e));
  };
  console.log('connected', connected);

  const getAddress = async () => {
    // retrieve address of nami wallet
    if (!connected) {
      await connect();
    }
    await nami.getAddress().then((newAddress) => {
      setAddress(newAddress);
    });
  };

  const handleStake = async (e) => {
    e.preventDefault();
    if (!connected) {
      await connect();
    }
    try {
      const recipients = [{ address: stakeAddress, amount: amount }];
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

      setOpen(false);

      console.log('stakeAddress', stakeAddress);
      console.log('amount', amount);
      console.log('recipients', recipients);
      console.log('utxos', utxos);
      console.log('myAddress', myAddress);
      console.log('transaction', transaction);
      console.log('witnesses', witnesses);

      console.log('Transaction ready. txHash == ', txHash);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container">
      <Header />
      <button className="connectButton" onClick={connect}>
        {connected && address
          ? `${address.substring(0, 6)}....${address.substring(address.length - 6)}`
          : 'Connect wallet'}
      </button>
      <div className="pools">
        {connected &&
          nami &&
          addresses.map((stakeAddress, index) => (
            <Pool
              key={index}
              stakeAddress={stakeAddress}
              nami={nami}
              setStakeAddress={setStakeAddress}
              setOpen={setOpen}
            ></Pool>
          ))}
      </div>
      {open && (
        <div className="modalWrapper">
          <div className="modal">
            <span>Amount:</span>
            <input
              min={0}
              className="input"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            ></input>
            <div className="buttonWrapper">
              <button disabled={amount < 1} className={`button${amount >= 1 ? ' okButton' : ''}`} onClick={handleStake}>
                Ok
              </button>
              <button
                className="button cancelButton"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
