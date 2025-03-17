
import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  noTransition?: boolean;
}

const Layout = ({ children, noTransition = false }: LayoutProps) => {
  if (noTransition) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 pb-16 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-16 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
