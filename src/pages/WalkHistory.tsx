import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { ChevronDown, ChevronUp, Clock, Calendar, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import FlickeringGridDemo from '@/components/FlickeringGridDemo';
import { useAuth } from '@/context/AuthContext';

// Mock data for walk history
const mockWalkHistory = [
  {
    id: '1',
    date: '2023-06-15',
    time: '09:30 AM',
    checkpoints: 12,
    completed: 12,
    duration: '45 min',
    notes: 'All checkpoints verified without issues.'
  },
  {
    id: '2',
    date: '2023-06-14',
    time: '10:15 AM',
    checkpoints: 12,
    completed: 10,
    duration: '40 min',
    notes: 'Two checkpoints inaccessible due to maintenance.'
  },
  {
    id: '3',
    date: '2023-06-13',
    time: '09:45 AM',
    checkpoints: 12,
    completed: 12,
    duration: '50 min',
    notes: 'Completed all checkpoints. Found broken window near checkpoint #8.'
  }
];

const WalkHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedWalk, setExpandedWalk] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  
  // Load expanded state from sessionStorage on mount with user-specific key
  useEffect(() => {
    if (user) {
      const savedState = sessionStorage.getItem(`adminExpandedWalk_${user.id}`);
      if (savedState) {
        try {
          setExpandedWalk(JSON.parse(savedState));
        } catch (e) {
          console.error("Error parsing saved expand state:", e);
        }
      }
    }
  }, [user]);
  
  const toggleExpand = (walkId: string) => {
    const newExpandedState = expandedWalk === walkId ? null : walkId;
    setExpandedWalk(newExpandedState);
    // Save to sessionStorage with user-specific key
    if (user) {
      sessionStorage.setItem(`adminExpandedWalk_${user.id}`, JSON.stringify(newExpandedState));
    }
  };
  
  const navigateToDetails = (walkId: string) => {
    navigate(`/walk-details/${walkId}`);
  };

  return (
    <Layout>
      <NavBar 
        title="Security Walk History" 
        rightAction={
          <Button variant="ghost" size="icon" onClick={() => navigate('/user-dashboard')}>
            <Clock className="h-5 w-5" />
          </Button>
        }
      />
      
      <div className="py-6 space-y-6">
        <Tabs defaultValue="history">
          <TabsList className="mb-4">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="demo">Flickering Grid Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4">
            <Card className="relative overflow-hidden">
              <FlickeringGrid
                className="absolute inset-0"
                squareSize={4}
                gridGap={6}
                color="#6B7280"
                maxOpacity={0.2}
                flickerChance={0.05}
              />
              <div className="relative p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Walk History</h3>
                  <p className="text-sm text-muted-foreground">View your past security walks</p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    className="bg-transparent text-sm font-medium border-none focus:outline-none"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Walks</option>
                    <option value="completed">Completed</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
            </Card>
            
            <div className="space-y-2">
              {mockWalkHistory.map((walk, index) => (
                <motion.div 
                  key={walk.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Collapsible
                    open={expandedWalk === walk.id}
                    onOpenChange={() => toggleExpand(walk.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full" asChild>
                      <div className="cursor-pointer">
                        <div className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-medium">{new Date(walk.date).toLocaleDateString()}</span>
                            <span className="text-sm text-muted-foreground flex items-center mt-1">
                              <Clock className="mr-1 h-3 w-3" /> {walk.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full h-3 w-3 ${
                              walk.completed === walk.checkpoints ? 'bg-success' : 'bg-warning'
                            }`}></div>
                            {expandedWalk === walk.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-3 border-t bg-muted/20">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="text-sm">
                            <span className="font-medium">Checkpoints:</span> {walk.completed}/{walk.checkpoints}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Duration:</span> {walk.duration}
                          </div>
                        </div>
                        <div className="text-sm mb-3">
                          <span className="font-medium">Notes:</span> {walk.notes}
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => navigateToDetails(walk.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="demo">
            <FlickeringGridDemo />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WalkHistory;
