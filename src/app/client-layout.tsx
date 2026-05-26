"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // Ref untuk melacak apakah ini perpindahan halaman baru
  const prevPathname = useRef(pathname);

  // ==========================================
  // KONTROL UTAMA DURASI DI SINI (Milidetik)
  // ==========================================
  const durasiLoading = 1800; 

  // Satukan interceptor navigasi dan timer ke dalam satu lifecycle
  useEffect(() => {
    // Jika pathname berubah dari halaman sebelumnya, aktifkan loading state
    if (prevPathname.current !== pathname) {
      setIsLoading(true);
      setShowContent(false);
      prevPathname.current = pathname;
    }

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true); 
    }, durasiLoading);

    return () => clearTimeout(loadTimer);
  }, [pathname, durasiLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key={pathname} />} 
      </AnimatePresence>
      
      {showContent && (
        <motion.div 
          key={`content-${pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}