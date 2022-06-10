import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NamiWalletApi, { Cardano } from './nami-js/nami';
import Header from './components/header';
import Pools from './components/pools';
import Footer from './components/footer';
import bg1 from './assets/bg1.svg';
import bg2 from './assets/bg2.svg';
import './App.css';

let nami;

const blockfrostApiKey = {
  0: process.env.BLOCKFROST_API_KEY_TESTNET,
  1: process.env.BLOCKFROST_API_KEY_MAINNET,
};

const addresses = process.env.ADDRESSES.split(',');

// curl -X POST http://15.156.0.236:8888/adalend/createPool -H "Content-Type:application/json" -d '{"poolTitle":"Looooooong poooooool nameeeeee Looooooong poooooool nameeeeee","poolMintAddress":"taddr0000","apr":44.57,"duration":15}'


export default function App() {
  const [connected, setConnected] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [amountToStake, setAmountToStake] = useState(100);
  const [stakeAddress, setStakeAddress] = useState(false);
  const [pools, setPools] = useState([])

  const fetchPools = () => {
    axios
      .get('http://15.156.0.236:8888/adalend/getpools')
      .then((response) => {
        console.log(response.data);
        setPools(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
    fetchPools()

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
      setWalletAddress(newAddress);
    });
  };

  const handleStake = async (e) => {
    console.log('stakeAddress', stakeAddress);
    console.log('amountToStake', amountToStake);
    e.preventDefault();
    if (!connected) {
      await connect();
    }
    try {
      const recipients = [{ address: stakeAddress, amount: amountToStake }];
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

      // setOpen(false);

      console.log('stakeAddress', stakeAddress);
      console.log('amountToStake', amountToStake);
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
    <div
      className='adalend_staking'
      style={{
        backgroundImage: `url(${bg1}), url(${bg2})`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'top left, top right',
      }}
    >
      <Header />
      <Pools
        addresses={addresses}
        connected={connected}
        connect={connect}
        nami={nami}
        setStakeAddress={setStakeAddress}
        setAmountToStake={setAmountToStake}
        amountToStake={amountToStake}
        walletAddress={walletAddress}
        pools={pools}
        handleStake={handleStake}
        stakeAddress={stakeAddress}
      />
      <Footer />
    </div>
  );
}
