import React from 'react';

import Pool from '../pool';
import styles from './pools.module.css'

export default function Pools({ walletAddress, connected, addresses, nami, setStakeAddress, setOpen, connect }) {
  return (
    <div className={styles.wrapper}>
      <button className="connectButton" onClick={connect}>
        {connected && walletAddress
          ? `${walletAddress.substring(0, 6)}....${walletAddress.substring(walletAddress.length - 6)}`
          : 'Connect wallet'}
      </button>
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
  );
}
