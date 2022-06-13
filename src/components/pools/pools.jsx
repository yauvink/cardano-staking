import React, { useState, useEffect } from 'react';
import * as iconv from 'iconv-lite';

import Pool from '../pool';
import connectBtnIcon from '../../assets/connectBtnIcon.svg';
import disconnectBtnIcon from '../../assets/disconnectBtnIcon.svg';
import styles from './pools.module.css';

export default function Pools({
  walletAddress,
  connected,
  nami,
  setSelectedPool,
  amountToStake,
  setAmountToStake,
  connect,
  pools,
  handleStake,
  selectedPool,
  POLICY,
  TOKEN_NAME,
  setConnected
}) {
  const [walletBalance, setWalletBalance] = useState();
  const [isStakingOpen, setStakingOpen] = useState(false);

  useEffect(() => {
    if (nami && walletAddress) {
      nami.getAddressAmount(walletAddress).then((result) => {
        const amount = result.amount.find((amount) => {
          return amount.unit === `${POLICY}${iconv.decode(iconv.encode(TOKEN_NAME, 'utf-8'), 'hex')}`;
        });

        setWalletBalance(amount.quantity);
      });
    }
  }, [nami, walletAddress]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>{isStakingOpen ? 'Stake tokens' : 'Staking pools'}</span>
        {connected && walletAddress ? (
          <div className={styles.walletInfoWrapper}>
            <div className={styles.walletInfo}>
              <span>Available balance:</span>
              <span>{walletBalance} ADAL</span>
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
      {isStakingOpen ? (
        <>
          <div className={styles.stakingWrapper}>
            <div className={styles.stakingInner}>
              <span className={styles.inputLabel}>Amount to stake</span>
              <input
                min={0}
                className={styles.amountInput}
                type="number"
                value={amountToStake}
                onChange={(e) => {
                  setAmountToStake(e.target.value);
                }}
              ></input>
              <span className={styles.amountInputUSDTValue}>
                USDT value <b>~$-,---.--</b>
              </span>
              <span className={styles.inputLabel}>Period to stake</span>
              <input disabled className={styles.periodInput} value={selectedPool.duration}></input>
              <span className={styles.stakeText}>
                You will gain rewards for the selected period. Your staked amount will be locked and non-withdrawable
                during that time.
              </span>
              <button className={styles.stakeNowBtn} disabled={amountToStake <= 0} onClick={handleStake}>
                Stake now
              </button>
            </div>
            <div className={styles.stakingInner}>
            </div>
          </div>
        </>
      ) : (
        <>
          {connected && nami
            ? pools.map((pool, index) => (
                <Pool
                  key={index}
                  pool={pool}
                  setSelectedPool={setSelectedPool}
                  setStakingOpen={setStakingOpen}
                ></Pool>
              ))
            : 'Not available'}
        </>
      )}
    </div>
  );
}
