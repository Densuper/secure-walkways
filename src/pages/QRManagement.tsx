import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import QRScanner from '@/components/QRScanner';
import { mockQRCodes } from '@/lib/utils';
import { Edit, Plus, QrCode, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface QRCodeItem {
  id: string;
  checkpointId: string;
  checkpointName: string;
}

const QRManagement = () => {
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>(mockQRCodes);
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'assign' | 'verify'>('assign');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  
  const handleAssignQR = () => {
    setScanMode('assign');
    setShowScanner(true);
  };
  
  const handleVerifyQR = () => {
    setScanMode('verify');
    setShowScanner(true);
  };
  
  const handleScan = (result: string) => {
    setShowScanner(false);
    
    if (scanMode === 'assign') {
      // Show input for checkpoint name
      setNewCheckpointName('');
      // In a real app, this would open a modal to enter checkpoint details
    } else {
      // Verify QR code
      const qrCode = qrCodes.find(qr => qr.id === result);
      if (qrCode) {
        toast({
          title: "QR Code verified",
          description: `This QR code is assigned to ${qrCode.checkpointName}`,
        });
      } else {
        toast({
          title: "Unknown QR Code",
          description: "This QR code is not assigned to any checkpoint",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };
  
  const confirmDelete = () => {
    if (showDeleteConfirm) {
      // In a real app, this would send a delete request to the backend
      setQRCodes(qrCodes.filter(qr => qr.id !== showDeleteConfirm));
      toast({
        title: "QR Code deleted",
        description: "The QR code has been deleted successfully",
      });
      setShowDeleteConfirm(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <Layout>
      <NavBar title="QR Code Management" showBack />
      
      <div className="py-6 space-y-6">
        <div className="flex flex-wrap gap-4">
          <Card 
            className="p-6 flex-1 min-w-[250px]"
            hoverable
            onClick={handleAssignQR}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-3">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Assign QR Code</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Scan a QR code and assign it to a security checkpoint
            </p>
          </Card>
          
          <Card 
            className="p-6 flex-1 min-w-[250px]"
            hoverable
            onClick={handleVerifyQR}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-3">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Verify QR Code</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Scan any QR code to check which checkpoint it's assigned to
            </p>
          </Card>
        </div>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">QR Code Assignments</h2>
          
          <div className="divide-y">
            {qrCodes.map((qr, index) => (
              <motion.div 
                key={qr.id} 
                className="py-3 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <div>
                  <div className="font-medium">{qr.checkpointName}</div>
                  <div className="text-sm text-muted-foreground">ID: {qr.id}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(qr.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
      
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {scanMode === 'assign' ? 'Scan to Assign QR Code' : 'Verify QR Code'}
              </h3>
              
              <QRScanner onScan={handleScan} />
              
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setShowScanner(false)}
              >
                Cancel
              </Button>
            </Card>
          </motion.div>
        )}
        
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-md">
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete this QR code assignment? This action cannot be undone.
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={cancelDelete}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default QRManagement;
