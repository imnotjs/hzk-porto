"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import styles from './navbar.module.css';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // State untuk kontrol hamburger menu

  // KONTROL SERVICES: Ubah ke 'true' jika modul layanan sudah siap dirilis kembali
  const showServices = false;

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // Kalau menu mobile lagi kebuka, jangan sembunyiin navbar pas di-scroll
        if (isOpen) return;

        if (window.scrollY > lastScrollY && window.scrollY > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, isOpen]);

  // Fungsi toggle menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi tutup menu pas link diklik
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header 
      className={`${styles.header} ${isVisible ? styles.visible : styles.hidden} ${isOpen ? styles.menuOpen : ''}`}
    >
      {/* Logo */}
      <Link href="/" className={styles.logo} onClick={closeMenu}>
        ./hzk
      </Link>

      {/* Tombol Hamburger (Hanya muncul di layar kecil) */}
      <button 
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerActive : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      {/* Kontainer Navigasi Utama */}
      <nav className={`${styles.nav} ${isOpen ? styles.navActive : ''}`}>
        <div className={styles.navLinks}>
          <Link href="/projects" onClick={closeMenu}>[ Projects ]</Link>
          <Link href="/experience" onClick={closeMenu}>[ Experience ]</Link>
          <Link href="/awards" onClick={closeMenu}>[ Awards ]</Link>
          
          {/* GATING LOGIC UNTUK SERVICES */}
          {showServices && (
            <Link href="/services" onClick={closeMenu}>[ Services ]</Link>
          )}
        </div>
        <Link href="/contact" className={styles.ctaButton} onClick={closeMenu}>
          ● Contact Me
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;