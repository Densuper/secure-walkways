import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { mockPreviousWalks, formatDate } from '@/lib/utils';
import { Calendar, ChevronDown, ChevronUp, FileText, Filter, LogOut, QrCode, Search, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import UserManagementDialog from '@/components/UserManagementDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState({
    user: '',
    date: '',
  });
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [expandedWalk, setExpandedWalk] = useState<string | null>(null);
  
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
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
    });
    navigate('/');
  };
  
  const handleManageQRCodes = () => {
    navigate('/qr-management');
  };
  
  const handleExportPDF = () => {
    toast({
      title: "Export started",
      description: "Your PDF is being generated...",
    });
    
    // Simulate PDF export
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Your PDF has been generated successfully.",
      });
    }, 2000);
  };

  const handleOpenSettings = () => {
    setShowUserManagement(true);
  };

  const toggleExpand = (walkId: string) => {
    const newExpandedState = expandedWalk === walkId ? null : walkId;
    setExpandedWalk(newExpandedState);
    if (user) {
      sessionStorage.setItem(`adminExpandedWalk_${user.id}`, JSON.stringify(newExpandedState));
    }
  };

  return (
    <Layout>
      <NavBar 
        title="Admin Dashboard" 
        rightAction={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleOpenSettings}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        }
      />
      
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Walks Overview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleManageQRCodes}>
              <QrCode className="mr-2 h-4 w-4" />
              Manage QR Codes
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-4">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium block mb-1">User</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter by user" 
                  className="w-full sm:w-auto pl-8 pr-4 py-2 border rounded-md"
                  value={filter.user}
                  onChange={(e) => setFilter({ ...filter, user: e.target.value })}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium block mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="date" 
                  className="w-full sm:w-auto pl-8 pr-4 py-2 border rounded-md"
                  value={filter.date}
                  onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                />
              </div>
            </div>
            
            <Button variant="secondary" size="sm" className="mt-4 sm:mt-0">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
          
          <div className="space-y-2">
            {['John Doe', 'Sarah Connor', 'Alex Smith'].map((username, userIndex) => 
              mockPreviousWalks.map((walk, walkIndex) => {
                const completed = walk.checkpoints.filter(cp => cp.completed).length;
                const total = walk.checkpoints.length;
                const status = completed === total ? 'Complete' : 'Incomplete';
                const walkId = `${username}-${walk.date}-${walkIndex}`;
                
                return (
                  <motion.div 
                    key={walkId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * (userIndex + walkIndex) }}
                  >
                    <Collapsible
                      open={expandedWalk === walkId}
                      onOpenChange={() => toggleExpand(walkId)}
                      className="border rounded-lg overflow-hidden bg-white"
                    >
                      <CollapsibleTrigger className="w-full" asChild>
                        <div className="cursor-pointer">
                          <div className="flex items-center justify-between p-3 hover:bg-muted/20 transition-colors">
                            <div className="flex flex-1 items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <div className="font-medium">{formatDate(walk.date)}</div>
                                  <div className="text-sm text-muted-foreground">{username}</div>
                                </div>
                                <div className="text-sm">
                                  {completed}/{total} complete
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  status === 'Complete' 
                                    ? 'bg-success/20 text-success' 
                                    : 'bg-warning/20 text-warning'
                                }`}>
                                  {status}
                                </span>
                              </div>
                              {expandedWalk === walkId ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground ml-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 border-t bg-muted/10">
                          <h4 className="font-medium mb-2">Checkpoint Details</h4>
                          <div className="space-y-2">
                            {walk.checkpoints.map((checkpoint) => (
                              <div 
                                key={checkpoint.id}
                                className="flex items-center justify-between p-2 border rounded-md"
                              >
                                <div>
                                  <div className="font-medium">{checkpoint.name}</div>
                                  {checkpoint.timestamp && (
                                    <div className="text-sm text-muted-foreground">
                                      {checkpoint.timestamp}
                                    </div>
                                  )}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  checkpoint.completed 
                                    ? 'bg-success/20 text-success' 
                                    : 'bg-warning/20 text-warning'
                                }`}>
                                  {checkpoint.completed ? 'Completed' : 'Pending'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <UserManagementDialog
        open={showUserManagement}
        onOpenChange={setShowUserManagement}
      />
    </Layout>
  );
};

export default AdminDashboard;
