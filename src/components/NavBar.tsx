
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const NavBar = ({ title, showBack = false, rightAction }: NavBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {showBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="mr-2 p-2 rounded-full hover:bg-secondary flex items-center justify-center"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            )}
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
          {rightAction && (
            <div>{rightAction}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
