
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import QRScanner from '@/components/QRScanner';
import NFCScanner from '@/components/NFCScanner';
import { toast } from '@/components/ui/use-toast';
import { Check, QrCode, Smartphone, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QRScan = () => {
  const navigate = useNavigate();
  const { checkpointId } = useParams();
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scanMethod, setScanMethod] = useState<'qr' | 'nfc'>('qr');
  
  const handleScan = (result: string) => {
    console.log(`Scanned ${scanMethod === 'qr' ? 'QR code' : 'NFC tag'}:`, result);
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
  
  const getCheckpointName = (code: string) => {
    // In a real app, we would look up the checkpoint name from the code
    // For now, we'll just return a mock name
    return "East Wing Corridor";
  };

  return (
    <Layout>
      <NavBar title={`Scan ${scanMethod === 'qr' ? 'QR Code' : 'NFC Tag'}`} showBack />
      
      <div className="py-6 space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-center">
            {checkpointId 
              ? `Scan for specific checkpoint` 
              : `Scan Checkpoint ${scanMethod === 'qr' ? 'QR Code' : 'NFC Tag'}`
            }
          </h2>
          
          <p className="text-muted-foreground text-center mb-6">
            {scanMethod === 'qr' 
              ? 'Position the QR code within the frame to scan' 
              : 'Hold your device near the NFC tag to scan'
            }
          </p>
          
          <Tabs defaultValue="qr" className="mb-6" onValueChange={(value) => setScanMethod(value as 'qr' | 'nfc')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </TabsTrigger>
              <TabsTrigger value="nfc" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>NFC Tag</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="qr">
              <QRScanner onScan={handleScan} />
            </TabsContent>
            <TabsContent value="nfc">
              <NFCScanner onScan={handleScan} />
            </TabsContent>
          </Tabs>
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
                  <p className="text-xs text-muted-foreground mt-2 break-all">
                    Code: {scannedResult}
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
