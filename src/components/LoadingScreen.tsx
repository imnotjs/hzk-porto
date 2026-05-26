"use client";

import { motion } from "framer-motion";
import styles from "./loading.module.css";

const LoadingScreen = () => {
  return (
    <motion.div
      className={styles.loader}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }} // Nyingkap ke atas saat selesai
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className={styles.text}>made with 🤍 by</span>
        <span className={styles.brand}>./hzk</span>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;