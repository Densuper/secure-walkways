
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import CheckpointItem from '@/components/CheckpointItem';
import { mockPreviousWalks, formatDate } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const WalkHistory = () => {
  const [expandedWalks, setExpandedWalks] = useState<string[]>(['today']);
  
  const toggleWalk = (id: string) => {
    setExpandedWalks(prev => 
      prev.includes(id) 
        ? prev.filter(walkId => walkId !== id) 
        : [...prev, id]
    );
  };

  return (
    <Layout>
      <NavBar title="Walk History" showBack />
      
      <div className="py-6 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Walk
          </h2>
          
          <div 
            className="flex items-center justify-between py-2 px-1 cursor-pointer"
            onClick={() => toggleWalk('today')}
          >
            <div className="font-medium">{formatDate(new Date().toISOString())}</div>
            <div>
              {expandedWalks.includes('today') ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>
          
          {expandedWalks.includes('today') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2"
            >
              {mockPreviousWalks[0].checkpoints.map((checkpoint, index) => (
                <CheckpointItem 
                  key={checkpoint.id}
                  {...checkpoint}
                />
              ))}
            </motion.div>
          )}
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Previous Walks
          </h2>
          
          <div className="divide-y">
            {mockPreviousWalks.map((walk, walkIndex) => (
              <div key={walk.date} className="py-2">
                <div 
                  className="flex items-center justify-between px-1 cursor-pointer"
                  onClick={() => toggleWalk(walk.date)}
                >
                  <div className="font-medium">{formatDate(walk.date)}</div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">
                      {walk.checkpoints.filter(cp => cp.completed).length}/{walk.checkpoints.length}
                    </span>
                    {expandedWalks.includes(walk.date) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                {expandedWalks.includes(walk.date) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    {walk.checkpoints.map((checkpoint, index) => (
                      <CheckpointItem 
                        key={checkpoint.id}
                        {...checkpoint}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default WalkHistory;
