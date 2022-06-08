import React from 'react';

import logo from '../../assets/logo.svg';
import styles from './header.module.css';

export default function Header({ nami, stakeAddress, setStakeAddress, setOpen }) {
  return (
    <div className={styles.header}>
      <img src={logo} alt="logo"></img>
    </div>
  );
}
