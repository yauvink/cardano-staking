import React, { useEffect, useState } from 'react';

import poolLogo from '../../assets/poolLogo.svg';
import shieldLock from '../../assets/shieldLock.svg';
import shieldLockRed from '../../assets/shieldLockRed.svg';
import styles from './pool.module.css';

export default function Pool({ nami, stakeAddress, setStakeAddress, setOpen }) {
  const isStaked = false;

  return (
    <div className={styles.pool}>
      <div className={styles.titleWrapper}>
        <img className={styles.poolLogo} src={poolLogo} alt="logo"></img>
        <span className={styles.poolTitle}>Pool title</span>
      </div>
      <div className={styles.walletInfo}>
        <span>You Staked</span>
        <span>--- ADAL</span>
      </div>
      <div className={styles.walletInfo}>
        <span>Pending rewards</span>
        <span>18.16 ADAL</span>
      </div>
      <div className={styles.walletInfo}>
        <span>APR</span>
        <span>22.54 %</span>
      </div>
      <div className={styles.walletInfo}>
        <span>Total Staked</span>
        <span>~ $ 48,357,412</span>
      </div>
      <div className={styles.duration}>
        <img src={isStaked ? shieldLockRed : shieldLock} alt="lock"></img>
        <div className={styles.walletInfo}>
          <span>{isStaked ? 'Time left' : 'Duration'}</span>
          <span>444 days</span>
        </div>
      </div>
      {isStaked ? (
        <button
          className={styles.detailsButton}
          onClick={() => {
            console.log('details click');
          }}
        >
          Details
        </button>
      ) : (
        <button
          className={styles.stakeButton}
          onClick={() => {
            setStakeAddress(stakeAddress);
            setOpen(true);
          }}
        >
          Stake now
        </button>
      )}
    </div>
  );
}
