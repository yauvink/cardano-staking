import React from 'react';

import bg3 from '../../assets/bg3.svg';
import socialFb from '../../assets/socialFb.svg';
import socialTw from '../../assets/socialTw.svg';
import socialLn from '../../assets/socialLn.svg';
import footerLogo from '../../assets/footerLogo.svg';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <div
      className={styles.footer}
      style={{
        background: `linear-gradient(180deg, #040017 0%, rgba(4, 0, 23, 0) 100%), url(${bg3}), #040017`,
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <img className={styles.logo} src={footerLogo} alt="logo"></img>
          <span className={styles.text}>
            At AdaLend, we understand that change is not always easy. Since 2000, we’ve been helping companies of all
            sizes respond to industry transitions in order to stay competitive. Our years of experience have taught us
            to always make your business success our priority.
          </span>
          <span className={styles.text2}>
            Our team of experts is ready to help you develop strategies for not only surviving, but thriving in the
            future. Give us a call today to set up your first consultation.
          </span>
          <span className={styles.adalend}>©2021 AdaLend</span>
        </div>
        <div className={styles.wrapper}>
          <span className={styles.title}>Get our latest news</span>
          <div className={styles.emailWrapper}>
            <input className={styles.input} type="text" placeholder="Email address"></input>
            <button className={styles.submitBtn}>Submit</button>
          </div>
          <div className={styles.socialWrapper}>
            <a href="#">
              <span className={styles.text2}>Terms and conditions</span>
            </a>
            <a href="#">
              <span className={styles.text2}>Privacy policy</span>
            </a>
            <a href="https://www.facebook.com/">
              <img src={socialFb} alt="facebook"></img>
            </a>
            <a href="https://www.twitter.com/">
              <img src={socialTw} alt="twitter"></img>
            </a>
            <a href="https://www.linkedin.com/">
              <img src={socialLn} alt="linkein"></img>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
