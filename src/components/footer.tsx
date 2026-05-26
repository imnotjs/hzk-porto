"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './footer.module.css';

const Footer = () => {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerBox}>
        
        {/* Class disuntik secara dinamis untuk mempertahankan tinggi wadah */}
        <div className={`${styles.footerMainCta} ${isMainPage ? styles.ctaHidden : ''}`}>
          <h2 className={styles.ctaBigText}>We enhance your objectivity.</h2>
          {/* Solusi: Mengganti tanda petik tunggal biasa dengan entitas HTML &apos; */}
          <h1 className={styles.ctaMainTitle}>Let&apos;s start working.</h1>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBrandSection}>
            <div className={styles.footerLogo}>./hzk</div>
            <p className={styles.copyright}>2026 © All rights reserved.</p>
          </div>
          
          <div className={styles.footerContactGrid}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>hezesagala.hs@gmail.com</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Phone</span>
              <span className={styles.contactValue}>+62-812-7251-8885</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;