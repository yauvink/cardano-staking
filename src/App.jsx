import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as iconv from 'iconv-lite';

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

// curl -X POST http://15.156.0.236:8888/adalend/createPool -H "Content-Type:application/json" -d '{"poolTitle":"gint","poolMintAddress":"addr_test1qpw25qz9zlzn6cvmxy2krdmcnmpqj5hzt8j40m3txczkg83z95rs0jhnjca03792kl23sefm8ju7vlqmeht7vpus9hmqzs3um4","apr":200,"duration":127}'

export default function App() {
  const [connected, setConnected] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [amountToStake, setAmountToStake] = useState(1);
  const [selectedPool, setSelectedPool] = useState(null);
  const [pools, setPools] = useState([]);

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
      let getBalance = await nami.getBalance();

      // const getEncodedName = (name) => {
      //   return iconv.decode(iconv.encode(name, 'utf-8'), 'hex');
      // };

      let utxosHex = await nami.getUtxosHex();
      console.log('utxoshex', utxosHex);
      // let utxos = await nami.getUtxos(utxosHex);
      // console.log('utxos', utxos);

      let netId = await nami.getNetworkId();
      // console.log('netId', netId);
      // recipients = [{address:"addr_test1qqsjrwqv6uyu7gtwtzvhjceauj8axmrhssqf3cvxangadqzt5f4xjh3za5jug5rw9uykv2klc5c66uzahu65vajvfscs57k2ql","amount":"3",
      // assets: [{unit:"5612bdcde30b1edf25823f62aa73c1b06831fb0f406c6c812da455db.TestNft", quantity: "1"}],  // Existing Assets

      const transaction = await nami.transaction({
        PaymentAddress: walletAddress,
        recipients: [
          {
            address: selectedPool.poolMintAddress,
            amount: 1,
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
        setConnected={setConnected}
      />
      <Footer />
    </div>
  );
}
