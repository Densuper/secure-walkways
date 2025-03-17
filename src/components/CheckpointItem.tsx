
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

export interface CheckpointProps {
  id: string;
  name: string;
  completed: boolean;
  timestamp?: string;
  onClick?: () => void;
}

const CheckpointItem = ({ name, completed, timestamp, onClick }: CheckpointProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`checkpoint-item ${completed ? 'checkpoint-complete' : 'checkpoint-incomplete'}`}
    >
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        {timestamp && <span className="text-sm text-muted-foreground flex items-center mt-1">
          <Clock className="mr-1 h-3 w-3" /> {timestamp}
        </span>}
      </div>
      <div className="flex items-center justify-center">
        {completed ? (
          <div className="bg-success text-success-foreground p-1 rounded-full">
            <Check className="h-5 w-5" />
          </div>
        ) : (
          <div className="bg-warning/20 text-warning-foreground p-1 rounded-full border border-warning">
            <span className="h-5 w-5 flex items-center justify-center text-sm">●</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CheckpointItem;
