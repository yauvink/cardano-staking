import React, { useState, useEffect } from 'react';

import Pool from '../pool';
import connectBtnIcon from '../../assets/connectBtnIcon.svg';
import disconnectBtnIcon from '../../assets/disconnectBtnIcon.svg';
import styles from './pools.module.css';

export default function Pools({ walletAddress, connected, addresses, nami, setStakeAddress, setOpen, connect }) {
  const [walletBalance, setWalletBalance] = useState();

  useEffect(() => {
    if (nami && walletAddress) {
      nami.getAddressAmount(walletAddress).then((result) => {
        setWalletBalance(result.amount[0].quantity);
      });
    }
  }, [nami, walletAddress]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Staking pools</span>
        {connected && walletAddress ? (
          <div className={styles.walletInfoWrapper}>
            <div className={styles.walletInfo}>
              <span>Available balance:</span>
              <span>{walletBalance / 1000000} ADAL</span>
            </div>
            <div className={styles.walletInfo}>
              <span>Wallet address:</span>
              <span>{`${walletAddress.substring(0, 4)}....${walletAddress.substring(walletAddress.length - 4)}`}</span>
            </div>
            <button
              className={styles.disconnectBtn}
              onClick={() => {
                console.log('disconnect wallet event');
              }}
            >
              <span>Disconnect</span>
              <img src={disconnectBtnIcon} alt="icon"></img>
            </button>
          </div>
        ) : (
          <button className={styles.connectBtn} onClick={connect}>
            <img src={connectBtnIcon} alt="icon"></img>
            <span>Connect wallet</span>
          </button>
        )}
      </div>
      {connected &&
        nami ?
        addresses.map((stakeAddress, index) => (
          <Pool
            key={index}
            stakeAddress={stakeAddress}
            nami={nami}
            setStakeAddress={setStakeAddress}
            setOpen={setOpen}
          ></Pool>
        )) : 'Not available'}
    </div>
  );
}
