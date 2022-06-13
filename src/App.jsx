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

const POLICY = process.env.TOKEN_POLICY;
const TOKEN_NAME = process.env.TOKEN_NAME;

export default function App() {
  const [connected, setConnected] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [amountToStake, setAmountToStake] = useState(1);
  const [selectedPool, setSelectedPool] = useState(null);
  const [pools, setPools] = useState([]);
  const [isStakingOpen, setStakingOpen] = useState(false);

  const fetchPools = () => {
    axios
      .get('http://15.156.0.236:8888/adalend/getpools')
      .then((response) => {
        console.log(response.data);
        setPools(response.data);
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
    fetchPools();

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
    e.preventDefault();
    if (!connected) {
      await connect();
    }
    try {
      let utxosHex = await nami.getUtxosHex();
      let netId = await nami.getNetworkId();

      const transaction = await nami.transaction({
        PaymentAddress: walletAddress,
        recipients: [
          {
            address: selectedPool.poolMintAddress,
            assets: [{ unit: `${POLICY}.${TOKEN_NAME}`, quantity: amountToStake }],
          },
        ],
        metadata: null,
        utxosRaw: utxosHex,
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

      console.log('Transaction ready. txHash =', txHash);
      setStakingOpen(false);
      fetchPools();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="adalend_staking"
      style={{
        backgroundImage: `url(${bg1}), url(${bg2})`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'top left, top right',
      }}
    >
      <Header />
      <Pools
        connected={connected}
        connect={connect}
        nami={nami}
        setSelectedPool={setSelectedPool}
        setAmountToStake={setAmountToStake}
        amountToStake={amountToStake}
        walletAddress={walletAddress}
        pools={pools}
        handleStake={handleStake}
        selectedPool={selectedPool}
        POLICY={POLICY}
        TOKEN_NAME={TOKEN_NAME}
        isStakingOpen={isStakingOpen}
        setStakingOpen={setStakingOpen}
      />
      <Footer />
    </div>
  );
}
