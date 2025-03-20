import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CheckpointItem, { CheckpointProps } from '@/components/CheckpointItem';
import { mockCheckpoints } from '@/lib/utils';
import { ChevronDown, ChevronUp, Clock, LogOut, QrCode, Smartphone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [checkpoints, setCheckpoints] = useState<CheckpointProps[]>([]);
  const [scanMethod, setScanMethod] = useState<'qr' | 'nfc'>('qr');
  const [expandedCheckpoint, setExpandedCheckpoint] = useState<string | null>(null);
  
  // Load mock data
  useEffect(() => {
    setCheckpoints(mockCheckpoints);
  }, []);
  
  // Load expanded state from localStorage on mount with user-specific key
  useEffect(() => {
    if (user) {
      const savedState = sessionStorage.getItem(`userExpandedCheckpoint_${user.id}`);
      if (savedState) {
        try {
          setExpandedCheckpoint(JSON.parse(savedState));
        } catch (e) {
          console.error("Error parsing saved expand state:", e);
        }
      }
    }
  }, [user]);
  
  const completedCount = checkpoints.filter(cp => cp.completed).length;
  const remainingCount = checkpoints.length - completedCount;
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
    });
    navigate('/');
  };
  
  const handleCheckpointClick = (checkpoint: CheckpointProps) => {
    navigate(`/qr-scan/${checkpoint.id}`);
  };
  
  const handleViewHistory = () => {
    navigate('/walk-history');
  };

  const toggleExpand = (checkpointId: string) => {
    const newExpandedState = expandedCheckpoint === checkpointId ? null : checkpointId;
    setExpandedCheckpoint(newExpandedState);
    // Save to sessionStorage with user-specific key
    if (user) {
      sessionStorage.setItem(`userExpandedCheckpoint_${user.id}`, JSON.stringify(newExpandedState));
    }
  };

  return (
    <Layout>
      <NavBar 
        title="Security Walk" 
        rightAction={
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        }
      />
      
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="flex flex-col items-center justify-center text-center py-6"
            delay={1}
          >
            <div className="text-3xl font-bold text-warning mb-2">{remainingCount}</div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </Card>
          
          <Card 
            className="flex flex-col items-center justify-center text-center py-6"
            delay={2}
          >
            <div className="text-3xl font-bold text-success mb-2">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Checkpoints</h3>
            <Button variant="ghost" size="sm" onClick={handleViewHistory}>
              View History
            </Button>
          </div>
          
          <div className="space-y-2">
            {checkpoints.map((checkpoint, index) => (
              <motion.div 
                key={checkpoint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <Collapsible
                  open={expandedCheckpoint === checkpoint.id}
                  onOpenChange={() => toggleExpand(checkpoint.id)}
                  className="border rounded-lg overflow-hidden"
                >
                  <CollapsibleTrigger className="w-full" asChild>
                    <div className="cursor-pointer">
                      <div className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">{checkpoint.name}</span>
                          {checkpoint.timestamp && (
                            <span className="text-sm text-muted-foreground flex items-center mt-1">
                              <Clock className="mr-1 h-3 w-3" /> {checkpoint.timestamp}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full h-3 w-3 ${checkpoint.completed ? 'bg-success' : 'bg-warning'}`}></div>
                          {expandedCheckpoint === checkpoint.id ? (
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
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Status:</strong> {checkpoint.completed ? 'Completed' : 'Pending'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Location:</strong> {checkpoint.name}
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          variant={checkpoint.completed ? "outline" : "default"}
                          onClick={() => handleCheckpointClick(checkpoint)}
                        >
                          {checkpoint.completed ? 'Details' : 'Scan'}
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          className="fixed bottom-6 left-0 right-0 flex justify-center z-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-2 w-full max-w-md">
            <Tabs 
              defaultValue="qr" 
              className="w-full"
              onValueChange={(value) => setScanMethod(value as 'qr' | 'nfc')}
            >
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="qr" className="flex items-center justify-center gap-2">
                  <QrCode className="h-4 w-4" />
                  <span>QR Code</span>
                </TabsTrigger>
                <TabsTrigger value="nfc" className="flex items-center justify-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>NFC Tag</span>
                </TabsTrigger>
              </TabsList>
              
              <Button 
                onClick={() => navigate('/qr-scan')}
                className="shadow-md flex items-center justify-center gap-2 py-4 px-8 w-full"
              >
                {scanMethod === 'qr' ? (
                  <>
                    <QrCode className="h-5 w-5 mr-2" />
                    Scan QR Code
                  </>
                ) : (
                  <>
                    <Smartphone className="h-5 w-5 mr-2" />
                    Scan NFC Tag
                  </>
                )}
              </Button>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
