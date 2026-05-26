"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import styles from './experience.module.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import EXPERIENCE_DATA from '@/json/diary.json';

// Solusi 1: Definisikan interface struktural untuk data diary agar terhindar dari tipe 'any'
interface DiaryItem {
  id: string | number;
  img: string;
  title: string;
  role: string;
  date: string;
  desc: string;
  link?: string;
}

export default function ExperiencePage() {
  const [view, setView] = useState<'menu' | 'work' | 'community'>('menu');
  const [hoveredCard, setHoveredCard] = useState<'work' | 'community' | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // 1. Smooth Scroll Lenis Engine dengan Auto-Resize Observer
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // FIX MOBILE SCROLL: Mengamati mutasi DOM secara real-time untuk sinkronisasi tinggi halaman
    const observer = new MutationObserver(() => {
      lenis.resize();
    });
    
    if (document.body) {
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  // 2. FORCE RESIZE TRIGGER LOOP SAAT TRANSISI STATE VIEW (MENU <-> DIARY)
  // Menjaga agar sisa ruang scroll di device mobile terhitung utuh pasca animasi Framer Motion selesai
  useEffect(() => {
    if (lenisRef.current) {
      const interval = setInterval(() => {
        lenisRef.current?.resize();
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        lenisRef.current?.resize();
      }, 900); // Durasi loop disesuaikan untuk mengawal exit/entry animation

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [view]);

  const closeDiary = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => setView('menu')
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setView('menu'), 800);
    }
  };

  // FIX: Menambahkan tipe data ekplisit ': Variants' agar string literal dikunci dengan benar oleh compiler
  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  };

  const workCardVariants: Variants = {
    hidden: { y: 150, rotate: 0, opacity: 0 },
    show: { 
      y: 0, 
      rotate: -12, 
      x: "var(--spread-x-left)", 
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 15, mass: 0.9 }
    }
  };

  const commCardVariants: Variants = {
    hidden: { y: 150, rotate: 0, opacity: 0 },
    show: { 
      y: 0, 
      rotate: 12, 
      x: "var(--spread-x-right)", 
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 15, mass: 0.9 }
    }
  };

  // Solusi 2: Ambil list data secara aman dengan melalukan type-casting ke index data yang valid
  const currentLogs: DiaryItem[] = view !== 'menu' ? (EXPERIENCE_DATA as Record<string, DiaryItem[]>)[view] || [] : [];

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Experience
          </motion.h1>
        </section>

        <AnimatePresence mode="wait">
          {view === 'menu' ? (
            <motion.section 
              key="menu"
              className={styles.cardMenu}
              variants={cardContainerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className={styles.cardDeck}>
                <motion.div 
                  className={`${styles.pickCard} ${styles.workCard}`}
                  variants={workCardVariants}
                  animate={hoveredCard === 'community' ? { opacity: 0.2, filter: 'blur(3px) grayscale(1)', scale: 0.93, y: 20 } : 'show'}
                  whileHover={{ 
                    rotate: -3, 
                    x: "var(--hover-spread-x-left)", 
                    y: "-10%", 
                    zIndex: 20,
                    scale: 1.05,
                    transition: { duration: 0.25, ease: "easeOut" } 
                  }}
                  onHoverStart={() => setHoveredCard('work')}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={() => setView('work')}
                  style={{ zIndex: hoveredCard === 'work' ? 20 : 2 }}
                >
                  <div className={styles.cardImgPlaceholder}>[ 01 ]</div>
                  <h2 className={styles.cardLabel}>The Architect</h2>
                  <span className={styles.cardType}>WORK // INTERNS</span>
                </motion.div>

                <motion.div 
                  className={`${styles.pickCard} ${styles.commCard}`}
                  variants={commCardVariants}
                  animate={hoveredCard === 'work' ? { opacity: 0.2, filter: 'blur(3px) grayscale(1)', scale: 0.93, y: 20 } : 'show'}
                  whileHover={{ 
                    rotate: 3, 
                    x: "var(--hover-spread-x-right)", 
                    y: "-10%", 
                    zIndex: 20,
                    scale: 1.05,
                    transition: { duration: 0.25, ease: "easeOut" } 
                  }}
                  onHoverStart={() => setHoveredCard('community')}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={() => setView('community')}
                  style={{ zIndex: hoveredCard === 'community' ? 20 : 1 }}
                >
                  <div className={styles.cardImgPlaceholder}>[ 02 ]</div>
                  <h2 className={styles.cardLabel}>The Dreamer</h2>
                  <span className={styles.cardType}>COMMUNITY // ABMAS</span>
                </motion.div>
              </div>
            </motion.section>
          ) : (
            <motion.section 
              key="content"
              className={styles.diaryContent}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.diaryHeader}>
                <button onClick={closeDiary} className={styles.backBtn}>
                  ← [ BACK TO DECK ]
                </button>
                <h2 className={styles.diaryTitle}>{view.toUpperCase()} LOGS</h2>
              </div>

              <div className={styles.eventList}>
                {currentLogs.map((item) => (
                  <motion.div 
                    key={item.id}
                    className={styles.eventItem}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.eventImageWrapper}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.title} className={styles.eventImage} />
                    </div>
                    <div className={styles.eventDetails}>
                      <span className={styles.eventDate}>{item.date}</span>
                      <h3 className={styles.eventTitle}>{item.title}</h3>
                      <h4 className={styles.eventRole}>{item.role}</h4>
                      <p className={styles.eventDesc}>{item.desc}</p>
                      
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={styles.eventLink}
                        >
                          READ ARTICLE ↗
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={styles.diaryFooter}>
                <button className={styles.closeAction} onClick={closeDiary}>
                  [ CLOSE FOLDER ]
                  <span className={styles.arrowUp}>↑</span>
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}