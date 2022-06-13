import React, { useEffect, useState } from 'react';
import * as iconv from 'iconv-lite';

import poolLogo from '../../assets/poolLogo.svg';
import shieldLock from '../../assets/shieldLock.svg';
import shieldLockRed from '../../assets/shieldLockRed.svg';
import styles from './pool.module.css';

export default function Pool({ POLICY, TOKEN_NAME, nami, setSelectedPool, setStakingOpen, pool }) {
  const isStaked = false;
  const [totalStaked, setTotalStaked] = useState(null);

  useEffect(() => {
    nami.getAddressAmount(pool.poolMintAddress).then((result) => {
      if (result.amount) {
        const amount = result.amount.find((amount) => {
          return amount.unit === `${POLICY}${iconv.decode(iconv.encode(TOKEN_NAME, 'utf-8'), 'hex')}`;
        });
        setTotalStaked(amount ? amount.quantity : 0);
      } else {
        setTotalStaked('---');
      }
    });
  }, []);

  return (
    <div className={styles.pool}>
      <div className={styles.titleWrapper}>
        <img className={styles.poolLogo} src={poolLogo} alt="logo"></img>
        <span className={styles.poolTitle}>{pool.poolTitle}</span>
      </div>
      <div className={styles.walletInfo}>
        <span>You Staked</span>
        <span>--- ADAL</span>
      </div>
      <div className={styles.walletInfo}>
        <span>Pending rewards</span>
        <span>--.-- ADAL</span>
      </div>
      <div className={styles.walletInfo}>
        <span>APR</span>
        <span>{pool.apr} %</span>
      </div>
      <div className={styles.walletInfo}>
        <span>Total Staked</span>
        <span>{totalStaked} ADAL</span>
      </div>
      <div className={styles.duration}>
        <img src={isStaked ? shieldLockRed : shieldLock} alt="lock"></img>
        <div className={styles.walletInfo}>
          <span>{isStaked ? 'Time left' : 'Duration'}</span>
          <span>{pool.duration} days</span>
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
            setSelectedPool(pool);
            setStakingOpen(true);
          }}
        >
          Stake now
        </button>
      )}
    </div>
  );
}
