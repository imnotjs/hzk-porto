/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import styles from './contact.module.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import CONTACT_DATA from '@/json/contacts.json';

interface GitHubData {
  avatar_url: string;
  public_repos: number;
  followers: number;
  updated_at: string;
}

interface RepoItem {
  name: string;
  description: string;
  html_url: string;
}

export default function ContactPage() {
  const [isBookOpened, setIsBookOpened] = useState(false); 
  const [isCvUnlocked, setIsCvUnlocked] = useState(false); 
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [pinnedRepos, setPinnedRepos] = useState<RepoItem[]>([]);
  
  const lenisRef = useRef<Lenis | null>(null);

  // 1. Fetching Data GitHub Latar Belakang
  useEffect(() => {
    fetch('https://api.github.com/users/imnotjs')
      .then(res => res.json())
      .then(data => {
        setGithubData({
          avatar_url: data.avatar_url,
          public_repos: data.public_repos,
          followers: data.followers,
          updated_at: new Date(data.updated_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })
        });
      })
      .catch(err => console.error("Gagal menarik log data GitHub", err));

    fetch('https://api.github.com/users/imnotjs/repos?sort=updated&per_page=3')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map((repo: { name: string; description: string | null; html_url: string }) => ({
            name: repo.name,
            description: repo.description || "No description provided for this core repository log.",
            html_url: repo.html_url
          }));
          setPinnedRepos(formatted);
        }
      })
      .catch(err => console.error("Gagal memuat log repositori GitHub", err));
  }, []);

  // 2. Smooth Scroll Lenis Engine
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

  // 3. Force Resize Trigger
  useEffect(() => {
    if (lenisRef.current) {
      const interval = setInterval(() => {
        lenisRef.current?.resize();
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        lenisRef.current?.resize();
      }, 900); 

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isBookOpened, isCvUnlocked]);

  const bookContentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        {/* Header Section */}
        <section className={styles.hero}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            CONTACT
          </motion.h1>
          <motion.p 
            className={styles.heroSub}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {CONTACT_DATA.status}
          </motion.p>
        </section>

        {/* CONTROLLER AREA INTERAKTIF */}
        <div className={styles.interactiveWrapper}>
          <AnimatePresence>
            {!isBookOpened && (
              <motion.div
                key="swipeGate"
                className={styles.swipeGateArea}
                initial={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ 
                  rotateY: -90, 
                  opacity: 0,
                  x: "-100%",
                  transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
                }}
                style={{ transformOrigin: "left center", perspective: 1000 }}
                drag="x"
                dragConstraints={{ right: 0 }}
                dragElastic={{ left: 0.1, right: 0 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x < -80 || info.velocity.x < -200) {
                    setIsBookOpened(true);
                  }
                }}
                whileHover={{ cursor: "grab" }}
                whileTap={{ cursor: "grabbing" }}
              >
                <div className={styles.minimalSliderTrack}>
                  <motion.span 
                    className={styles.arrowIndicator}
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    ←
                  </motion.span>
                  <span className={styles.sliderTextCopy}>
                    SLIDE MY CONTACT BOOK TO OPEN
                  </span>
                  <span className={styles.systemCodeLabel}>
                    {"[ CODE // 0.26 ]"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            key="mainContentHub"
            className={`${styles.verticalHub} ${isBookOpened ? styles.hubActive : styles.hubInactive}`}
            initial="hidden"
            animate={isBookOpened ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            {/* SEKSI 1: LINK UTAMA GRID */}
            <motion.section className={styles.linksGrid} variants={bookContentVariants}>
              {CONTACT_DATA.socials.map((social) => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.socialLinkCard}
                >
                  {/* FIX: Mengubah social.name menjadi social.label agar sesuai schema data json */}
                  <span className="sr-only">{social.label || "Social Link"}</span>
                </a>
              ))}
            </motion.section>

            {/* SEKSI 2: GITHUB PROFILE MONITOR */}
            <motion.section className={styles.githubProfileCard} variants={bookContentVariants}>
              <div className={styles.gitHeader}>
                {githubData ? (
                  <>
                    <img src={githubData.avatar_url} alt="GitHub Live Core" className={styles.gitAvatar} />
                    <div className={styles.gitUserMeta}>
                      <h3>{"[ RESOURCE // SERVER_PROFILE_DATA ]"}</h3>
                      <p>SYSTEM ACCESS STATUS: LINKED AND MONITORED</p>
                    </div>
                  </>
                ) : (
                  <div className={styles.gitUserMeta}>
                    <h3>{"[ FETCHING REMOTE SERVER LOGS... ]"}</h3>
                  </div>
                )}
              </div>

              <div className={styles.gitStatsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Public Repos</span>
                  <span className={styles.statValue}>{githubData ? githubData.public_repos : '--'}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Watchers / Follow</span>
                  <span className={styles.statValue}>{githubData ? githubData.followers : '--'}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Last Active Push</span>
                  <span className={styles.statValue} style={{ fontSize: '0.8rem', color: '#fff', paddingTop: '4px' }}>
                    {githubData ? githubData.updated_at : 'CONNECTING...'}
                  </span>
                </div>
              </div>

              <div className={styles.pinnedReposSection}>
                <h4 className={styles.repoSectionTitle}>{"// RECENT_CORE_REPOSITORIES"}</h4>
                <div className={styles.repoListStack}>
                  {pinnedRepos.length > 0 ? (
                    pinnedRepos.map((repo, i) => {
                      const isLongDescription = repo.description.length > 60;
                      return (
                        <div key={i} className={styles.repoLogCard}>
                          <span className={styles.repoTerminalPrefix}>
                            {`> ${repo.name}`}
                          </span>
                          <p className={styles.repoLineDesc}>
                            {isLongDescription ? `${repo.description.substring(0, 60)}...` : repo.description}
                            {isLongDescription && (
                              <a 
                                href={repo.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.repoMoreLink}
                              >
                                more
                              </a>
                            )}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className={styles.repoLoadingText}>INITIALIZING RESOURCE CLUSTERS...</p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* SEKSI 3: BRIEFCASE CV */}
            <motion.section className={styles.briefcaseSection} variants={bookContentVariants}>
              <div className={styles.briefcaseCard}>
                <div className={styles.briefcaseHeader}>
                  <span className={styles.dot}></span>
                  <span className={styles.panelTitle}>CLASSIFIED_DOCUMENTS_RECON</span>
                </div>

                <AnimatePresence mode="wait">
                  {!isCvUnlocked ? (
                    <motion.div 
                      key="locked"
                      className={styles.lockContainer}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.lockIcon}>🔒</div>
                      <p className={styles.lockText}>AUTHORIZATION REQUIRED</p>
                      
                      <div className={styles.sliderTrack}>
                        <motion.div 
                          className={styles.sliderHandle}
                          drag="x"
                          dragConstraints={{ left: 0, right: 200 }} 
                          dragElastic={0.1}
                          dragSnapToOrigin={false}
                          onDrag={(event, info) => {
                            if (info.point.x > 190 || info.offset.x >= 190) {
                              setIsCvUnlocked(true);
                            }
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ cursor: "grabbing" }}
                        >
                          ⚡
                        </motion.div>
                        <span className={styles.trackText}>SLIDE TO DECRYPT CV</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="unlocked"
                      className={styles.unlockedContainer}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                      <div className={styles.docIcon}>📄</div>
                      <h3 className={styles.docTitle}>CV Jody Hezekiah.pdf</h3>
                      <span className={styles.docStatus}>
                        {"DECRYPTION SUCCESSFUL // READY"}
                      </span>
                      
                      <a 
                        href="https://drive.usercontent.google.com/uc?id=1QnIt2GpR2etiAI1Ux0D2PlNgf1apTb4E&export=download" 
                        target="_blank"
                        rel="noopener noreferrer"
                        download 
                        className={styles.downloadBtn}
                      >
                        {"[ DOWNLOAD DOSSIER ]"}
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}