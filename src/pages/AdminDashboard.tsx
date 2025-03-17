
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { mockPreviousWalks, formatDate } from '@/lib/utils';
import { Calendar, FileText, Filter, LogOut, QrCode, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState({
    user: '',
    date: '',
  });
  
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

  return (
    <Layout>
      <NavBar 
        title="Admin Dashboard" 
        rightAction={
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
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
          
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium">Date</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">User</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Completion</th>
                  <th className="py-2 px-4 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {['John Doe', 'Sarah Connor', 'Alex Smith'].map((username, userIndex) => 
                  mockPreviousWalks.map((walk, walkIndex) => {
                    const completed = walk.checkpoints.filter(cp => cp.completed).length;
                    const total = walk.checkpoints.length;
                    const status = completed === total ? 'Complete' : 'Incomplete';
                    
                    return (
                      <motion.tr 
                        key={`${username}-${walk.date}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * (userIndex + walkIndex) }}
                        className="hover:bg-muted/20"
                      >
                        <td className="py-3 px-4">{formatDate(walk.date)}</td>
                        <td className="py-3 px-4">{username}</td>
                        <td className="py-3 px-4">{completed}/{total}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            status === 'Complete' 
                              ? 'bg-success/20 text-success' 
                              : 'bg-warning/20 text-warning'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
