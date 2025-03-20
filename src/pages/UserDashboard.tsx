
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
import { ChevronDown, ChevronUp, Clock, LogOut, QrCode, Smartphone, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

interface Walk {
  id: string;
  status: 'Ongoing' | 'Completed' | 'Partially Completed' | 'Completed (Interrupted)';
  date: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [checkpoints, setCheckpoints] = useState<CheckpointProps[]>([]);
  const [scanMethod, setScanMethod] = useState<'qr' | 'nfc'>('qr');
  const [expandedCheckpoint, setExpandedCheckpoint] = useState<string | null>(null);
  const [pendingWalk, setPendingWalk] = useState<Walk | null>(null);
  const [showWalkDialog, setShowWalkDialog] = useState(false);
  
  // Load mock data and check for pending walks
  useEffect(() => {
    setCheckpoints(mockCheckpoints);
    
    // Check for pending walks (this would normally be an API call)
    const checkPendingWalks = async () => {
      if (user) {
        try {
          // This would be a real API call in production
          // const response = await fetch(`${API_BASE_URL}/api/pending-walks?userId=${user.id}`);
          // const data = await response.json();
          
          // For now, check if there's a saved walk in sessionStorage
          const savedWalkId = sessionStorage.getItem(`ongoingWalk_${user.id}`);
          
          if (savedWalkId) {
            // Mock pending walk for demo
            setPendingWalk({
              id: savedWalkId,
              status: 'Partially Completed',
              date: new Date().toISOString()
            });
            setShowWalkDialog(true);
          }
        } catch (error) {
          console.error("Error checking pending walks:", error);
        }
      }
    };
    
    checkPendingWalks();
  }, [user]);
  
  // Load expanded state from sessionStorage on mount with user-specific key
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
    // If there's an ongoing walk, save its status
    if (user) {
      const ongoingWalkId = sessionStorage.getItem(`ongoingWalk_${user.id}`);
      
      if (ongoingWalkId) {
        // In a real app, this would be an API call to save walk progress
        try {
          fetch(`${API_BASE_URL}/api/save-walk-progress`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('secureWalkToken')}`
            },
            body: JSON.stringify({
              userId: user.id,
              walkId: ongoingWalkId,
              status: 'Partially Completed'
            }),
          }).catch(err => console.error("Error saving walk progress:", err));
        } catch (error) {
          console.error("Error saving walk progress:", error);
        }
      }
    }
    
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
  
  const resumeWalk = async () => {
    if (pendingWalk) {
      try {
        // In a real app, this would be an API call to get the walk's checkpoints
        // const response = await fetch(`${API_BASE_URL}/api/walk/${pendingWalk.id}`);
        // const data = await response.json();
        // setCheckpoints(data.checkpoints);
        
        toast({
          title: "Walk Resumed",
          description: "Continuing from your last checkpoint"
        });
        
        setShowWalkDialog(false);
      } catch (error) {
        console.error("Error resuming walk:", error);
        toast({
          title: "Error",
          description: "Failed to resume walk",
          variant: "destructive"
        });
      }
    }
  };
  
  const startNewWalk = async () => {
    if (pendingWalk && user) {
      try {
        // Mark the old walk as interrupted and start a new one
        const response = await fetch(`${API_BASE_URL}/api/start-new-walk`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('secureWalkToken')}`
          },
          body: JSON.stringify({
            userId: user.id,
            walkId: pendingWalk.id
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to start new walk");
        }
        
        const data = await response.json();
        
        // Save new walk ID
        sessionStorage.setItem(`ongoingWalk_${user.id}`, data.newWalkId);
        
        // Reset checkpoints
        setCheckpoints(mockCheckpoints.map(cp => ({ ...cp, completed: false, timestamp: undefined })));
        
        toast({
          title: "New Walk Started",
          description: "Previous walk saved as 'Completed (Interrupted)'"
        });
        
        setShowWalkDialog(false);
        setPendingWalk(null);
      } catch (error) {
        console.error("Error starting new walk:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to start new walk",
          variant: "destructive"
        });
      }
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

      {/* Pending Walk Dialog */}
      <Dialog open={showWalkDialog} onOpenChange={setShowWalkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Incomplete Security Walk
            </DialogTitle>
            <DialogDescription>
              You have an incomplete security walk from {pendingWalk ? new Date(pendingWalk.date).toLocaleString() : ''}. 
              Would you like to resume it or start a new one?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <Button 
              className="w-full" 
              variant="default" 
              onClick={resumeWalk}
            >
              Resume Walk
            </Button>
            
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={startNewWalk}
            >
              Start New Walk
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserDashboard;
