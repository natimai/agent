import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../constants/animations';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper; 