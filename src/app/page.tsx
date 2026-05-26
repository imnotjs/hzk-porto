/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion, Variants } from 'framer-motion'; // FIX: Import Variants di sini
import Link from 'next/link'; 
import NextImage from 'next/image';
import styles from './page.module.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import techData from '@/json/techstack.json';

const words = ["Hezekiah.", "Heze."];

export default function Home() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const showShowcase = false;

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // FIX: Menambahkan tipe data ': Variants' agar array cubic-bezier [number, number, number, number] divalidasi dengan benar
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.heroTitle}>
              {text}
              <span className={styles.cursor}>|</span>
            </h1>
          </div>
          <div className={styles.heroText}>
            <p>
              A <strong>dreamer</strong> by night, an <strong>architect</strong> by day. I bridge the gap between abstract possibilities and high-precision execution—crafting intelligent systems that don&apos;t just process data, but <strong>understand context</strong>.
            </p>
          </div>
        </div>
      </section>

      <motion.section 
        className={styles.about}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={revealVariants}
      >
        <div className={styles.aboutGrid}>
          <div className={styles.photoFrameContainer}>
            <div className={styles.photoFrame}>
              <div className={styles.imagePlaceholder}>
                <NextImage 
                  src="/pic/profile/hezekiah.png"
                  alt="Jody Hezekiah T.S."
                  fill
                  sizes="(max-width: 450px) 100vw, 450px"
                  priority
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.frameName}>Jody Hezekiah T.S.</div>
            </div>
          </div>

          <div className={styles.aboutContent}>
            <h2 className={styles.sectionLabel}>[ Profile ]</h2>
            <p className={styles.aboutBio}>
              An Information Technology student at <strong>ITS Surabaya</strong> with a heavy focus on the architecture of intelligence. I specialize in bridging the gap between raw pixels and actionable insights—engineering end-to-end AI pipelines that excel in <strong>socio-contextual analysis</strong> and high-precision <strong>computer vision</strong> deployment.
            </p>
            
            <div className={styles.techStackContainer}>
              {techData.techGroups.map((group) => (
                <div key={group.id} className={styles.techGroup}>
                  <span className={styles.groupLabel}>
                    {`[ ${group.id} // ${group.label} ]`}
                  </span>
                  <div className={styles.iconGrid}>
                    {group.techs.map((tech, idx) => (
                      <div 
                        key={idx} 
                        className={styles.stackBadge}
                        style={{ '--glow-color': group.glowColor } as React.CSSProperties}
                      >
                        <div className={styles.underglow}></div>
                        <img 
                          src={tech.icon} 
                          alt={tech.name} 
                          className={styles.techIconSmall} 
                        />
                        <span className={styles.techName}>{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {showShowcase && (
        <motion.section 
          className={styles.portfolio} 
          id="projects"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
        >
          <div className={styles.showcaseHeader}>
            <h2 className={styles.showcaseTitle}>Showcase</h2>
            <p className={styles.showcaseSub}>Curating the intersection of logic and creativity through worked projects.</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <div className={styles.projectImagePlaceholder} style={{background: '#111'}}>
                  <span className={styles.placeholderLabel}>[ OMNI-FACESORT ]</span>
                </div>
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>Computer Vision</h3>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>YOLOv8</span>
                  <span className={styles.tag}>ArcFace</span>
                </div>
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <div className={styles.projectImagePlaceholder} style={{background: '#222'}}>
                  <span className={styles.placeholderLabel}>[ VIRA AI ]</span>
                </div>
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>Applied AI</h3>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>RawNet3</span>
                  <span className={styles.tag}>AASIST</span>
                </div>
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <div className={styles.projectImagePlaceholder} style={{background: '#333'}}>
                  <span className={styles.placeholderLabel}>[ ENTERPRISE AI ]</span>
                </div>
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>Digital Transformation</h3>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>Optimization</span>
                  <span className={styles.tag}>Architecture</span>
                </div>
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectImage}>
                <div className={styles.projectImagePlaceholder} style={{background: '#444'}}>
                  <span className={styles.placeholderLabel}>[ MCF ITB 2026 ]</span>
                </div>
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>Competitions</h3>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>Data Science</span>
                  <span className={styles.tag}>Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section 
        className={styles.finalCta}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={revealVariants}
      >
        <h2 className={styles.ctaHeading}>Architecture is nothing without precision.<br/><span>Let&apos;s build systems that actually see.</span></h2>
        
        <Link href="/contact" passHref>
          <button className={styles.largeCta}>● Contact Me</button>
        </Link>
      </motion.section>

      <Footer />
    </div>
  );
}