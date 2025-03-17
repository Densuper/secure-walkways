
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import QRScanner from '@/components/QRScanner';
import { toast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';

const QRScan = () => {
  const navigate = useNavigate();
  const { checkpointId } = useParams();
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleScan = (result: string) => {
    // In a real app, we would verify this result against the backend
    setScannedResult(result);
    setShowConfirmation(true);
  };
  
  const handleConfirm = () => {
    // In a real app, we would send this confirmation to the backend
    toast({
      title: "Checkpoint completed",
      description: "The checkpoint has been marked as completed.",
    });
    navigate('/user-dashboard');
  };
  
  const handleCancel = () => {
    setShowConfirmation(false);
    setScannedResult(null);
  };
  
  const getCheckpointName = (qrCode: string) => {
    // In a real app, we would look up the checkpoint name from the QR code
    // For now, we'll just return a mock name
    return "East Wing Corridor";
  };

  return (
    <Layout>
      <NavBar title="Scan QR Code" showBack />
      
      <div className="py-6 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-center">
            {checkpointId ? `Scan for specific checkpoint` : 'Scan Checkpoint QR Code'}
          </h2>
          
          <p className="text-muted-foreground text-center mb-6">
            Position the QR code within the frame to scan
          </p>
          
          <QRScanner onScan={handleScan} />
        </Card>
        
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <Card className="w-full max-w-md">
                <h3 className="text-xl font-semibold mb-2">Confirm Checkpoint</h3>
                
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="font-medium">{getCheckpointName(scannedResult!)}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancel}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  
                  <Button
                    className="flex-1"
                    onClick={handleConfirm}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default QRScan;
