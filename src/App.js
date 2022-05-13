import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import walletIcon from './assets/wallet.svg'
import logo from './assets/logo.svg'
import NamiWalletApi, { Cardano } from './nami-js';
import './App.css';

let nami;

const blockfrostApiKey = {
  0: 'testnetzISkCE9yRV4cnIUyuaP7FvAJY5etxBlO', // testnet
  1: '', // mainnet
};

export default function App() {
  const [connected, setConnected] = useState();
  const [address, setAddress] = useState();
  const [nfts, setNfts] = useState([]);
  const [balance, setBalance] = useState();
  const [transaction, setTransaction] = useState();
  const [amount, setAmount] = useState('10');
  const [txHash, setTxHash] = useState();
  const [recipientAddress, setRecipientAddress] = useState(
    'addr_test1qpw25qz9zlzn6cvmxy2krdmcnmpqj5hzt8j40m3txczkg83z95rs0jhnjca03792kl23sefm8ju7vlqmeht7vpus9hmqzs3um4'
  );
  const [witnesses, setWitnesses] = useState();
  const [policy, setPolicy] = useState();
  const [policyExpiration, setPolicyExpiration] = useState(new Date());


  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setTime(defaultDate.getTime() + 1 * 60 * 90 * 1000);
    setPolicyExpiration(defaultDate);
  }, []);
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
      console.log(newAddress);
      setAddress(newAddress);
    });
  };

  const getBalance = async () => {
    if (!connected) {
      await connect();
    }
    await nami.getBalance().then((result) => {
      console.log(result);
      setNfts(result.assets);
      setBalance(result.lovelace);
    });
  };

  const buildTransaction = async () => {
    if (!connected) {
      await connect();
    }

    const recipients = [{ address: recipientAddress, amount: amount }];
    let utxos = await nami.getUtxosHex();
    const myAddress = await nami.getAddress();

    let netId = await nami.getNetworkId();
    const t = await nami.transaction({
      PaymentAddress: myAddress,
      recipients: recipients,
      metadata: null,
      utxosRaw: utxos,
      networkId: netId.id,
      ttl: 3600,
      multiSig: null,
    });
    console.log(t);
    setTransaction(t);
  };


  const signTransaction = async () => {
    if (!connected) {
      await connect();
    }

    const witnesses = await nami.signTx(transaction);
    setWitnesses(witnesses);
  };

  const submitTransaction = async () => {
    let netId = await nami.getNetworkId();
    const txHash = await nami.submitTx({
      transactionRaw: transaction,
      witnesses: [witnesses],

      networkId: netId.id,
    });
    setTxHash(txHash);
  };

  const createPolicy = async () => {
    console.log(policyExpiration);
    try {
      await nami.enable();

      const myAddress = await nami.getHexAddress();

      let networkId = await nami.getNetworkId();
      const newPolicy = await nami.createLockingPolicyScript(myAddress, networkId.id, policyExpiration);

      setPolicy(newPolicy);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <header>
        <img src={logo} alt="logo" />
        <button className="connectButton" onClick={connect}>
          {connected && address
            ? `${address.substring(0, 6)}....${address.substring(address.length - 6)}`
            : 'Connect wallet'}
          <img src={walletIcon} alt="wallet" className="header-icon_connect" />
        </button>
      </header>

      <div className="row">
        <h1> 3. Retrieve your balance and NFTs</h1>
      </div>
      <div className="row">
        <button className={`button ${balance ? 'success' : ''}`} onClick={getBalance}>
          {' '}
          Get Your Balance and NFTs{' '}
        </button>
        {balance && (
          <>
            {' '}
            <div className="column">
              <div className="item balance">
                <p>Balance ₳: {balance / 1000000} </p>
              </div>

              {nfts.map((nft) => {
                return (
                  <>
                    <div className="item nft">
                      <p>unit: {nft.unit}</p>
                      <p>quantity: {nft.quantity}</p>
                      <p>policy: {nft.policy}</p>
                      <p>name: {nft.name}</p>
                      <p>fingerprint: {nft.fingerprint}</p>
                    </div>
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="row">
        <h1> 4. Build Transaction</h1>
      </div>
      <div className="row">
        <button
          className={`button ${transaction ? 'success' : ''}`}
          onClick={() => {
            if (amount && recipientAddress) buildTransaction();
          }}
        >
          {' '}
          Build Transaction
        </button>
        <div className="column">
          <div className="item address">
            <p> Amount</p>
            <input
              style={{ width: '400px', height: '30px' }}
              value={amount}
              onChange={(event) => setAmount(event.target.value.toString())}
            />
          </div>

          <div className="item address">
            <p> Recipient Address</p>
            <input
              style={{ width: '400px', height: '30px' }}
              value={recipientAddress}
              onChange={(event) => setRecipientAddress(event.target.value.toString())}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <h1> 5. Sign Transaction</h1>
      </div>
      <div className="row">
        <button
          className={`button ${witnesses ? 'success' : ''}`}
          onClick={() => {
            if (transaction) signTransaction();
          }}
        >
          {' '}
          Sign Transaction
        </button>
        <div className="column"></div>
      </div>
      <div className="row">
        <h1> 6. Submit Transaction</h1>
      </div>
      <div className="row">
        <button
          className={`button ${txHash ? 'success' : ''}`}
          onClick={() => {
            console.log(witnesses);
            if (witnesses) submitTransaction();
          }}
        >
          {' '}
          Submit Transaction
        </button>

        <div className="column">
          <div className="item address">
            <p>TxHash: {txHash} </p>
          </div>
        </div>
      </div>
      <div className="row">
        <h1> 7. Create Policy Script</h1>
      </div>
      <div className="row">
        <button
          className={`button ${policy ? 'success' : ''}`}
          onClick={() => {
            if (policyExpiration) createPolicy();
          }}
        >
          {' '}
          Create Policy
        </button>

        <div className="column">
          <p>
            Set Policy Expriaton Date:{' '}
            <DateTimePicker onChange={setPolicyExpiration} value={policyExpiration} minDate={new Date()} />
          </p>
          <div className="item address">
            <p>policyId: {policy?.id} </p>
            <p>policyScript: {policy?.script} </p>
            <p>paymentKeyHash: {policy?.paymentKeyHash} </p>
            <p>ttl: {policy?.ttl} </p>
          </div>
        </div>
      </div>
    </div>
  );
}
