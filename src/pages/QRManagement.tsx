
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import QRScanner from '@/components/QRScanner';
import NFCScanner from '@/components/NFCScanner';
import { mockQRCodes } from '@/lib/utils';
import { Edit, Plus, QrCode, Smartphone, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';

interface CheckpointTag {
  id: string;
  checkpointId: string;
  checkpointName: string;
  type: 'qr' | 'nfc';
}

const QRManagement = () => {
  const [checkpointTags, setCheckpointTags] = useState<CheckpointTag[]>(
    mockQRCodes.map(qr => ({ ...qr, type: 'qr' }))
  );
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'assign' | 'verify'>('assign');
  const [scanType, setScanType] = useState<'qr' | 'nfc'>('qr');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  
  const handleAssign = (type: 'qr' | 'nfc') => {
    setScanType(type);
    setScanMode('assign');
    setShowScanner(true);
  };
  
  const handleVerify = (type: 'qr' | 'nfc') => {
    setScanType(type);
    setScanMode('verify');
    setShowScanner(true);
  };
  
  const handleScan = (result: string) => {
    setShowScanner(false);
    
    if (scanMode === 'assign') {
      setNewCheckpointName('');
      // Would show dialog to assign checkpoint name
      // For now, let's just add a mock checkpoint
      const newTag: CheckpointTag = {
        id: result,
        checkpointId: `cp-${Math.floor(Math.random() * 1000)}`,
        checkpointName: `New ${scanType.toUpperCase()} Checkpoint ${checkpointTags.length + 1}`,
        type: scanType
      };
      
      setCheckpointTags([...checkpointTags, newTag]);
      
      toast({
        title: `${scanType.toUpperCase()} assigned successfully`,
        description: `${scanType.toUpperCase()} has been assigned to checkpoint "${newTag.checkpointName}"`,
      });
    } else {
      const tag = checkpointTags.find(tag => tag.id === result && tag.type === scanType);
      if (tag) {
        toast({
          title: `${scanType.toUpperCase()} verified`,
          description: `This ${scanType.toUpperCase()} is assigned to ${tag.checkpointName}`,
        });
      } else {
        toast({
          title: `Unknown ${scanType.toUpperCase()}`,
          description: `This ${scanType.toUpperCase()} is not assigned to any checkpoint`,
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
      setCheckpointTags(checkpointTags.filter(tag => tag.id !== showDeleteConfirm));
      toast({
        title: "Tag deleted",
        description: "The checkpoint tag has been deleted successfully",
      });
      setShowDeleteConfirm(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <Layout>
      <NavBar title="Checkpoint Management" showBack />
      
      <div className="py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="p-6"
            hoverable
            onClick={() => handleAssign('qr')}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-3">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Assign QR Code</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Scan a QR code and assign it to a security checkpoint
            </p>
          </Card>
          
          <Card 
            className="p-6"
            hoverable
            onClick={() => handleAssign('nfc')}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-3">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Assign NFC Tag</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Scan an NFC tag and assign it to a security checkpoint
            </p>
          </Card>
          
          <Card 
            className="p-6"
            hoverable
            onClick={() => handleVerify('qr')}
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
          
          <Card 
            className="p-6"
            hoverable
            onClick={() => handleVerify('nfc')}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-3">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Verify NFC Tag</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Scan any NFC tag to check which checkpoint it's assigned to
            </p>
          </Card>
        </div>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Checkpoint Tags</h2>
          
          <div className="divide-y">
            {checkpointTags.map((tag, index) => (
              <motion.div 
                key={tag.id} 
                className="py-3 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="flex items-center">
                  {tag.type === 'qr' ? (
                    <QrCode className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">{tag.checkpointName}</div>
                    <div className="text-sm text-muted-foreground">ID: {tag.id}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(tag.id)}
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
                {scanMode === 'assign' 
                  ? `Scan to Assign ${scanType === 'qr' ? 'QR Code' : 'NFC Tag'}` 
                  : `Verify ${scanType === 'qr' ? 'QR Code' : 'NFC Tag'}`}
              </h3>
              
              <Tabs value={scanType} onValueChange={(value) => setScanType(value as 'qr' | 'nfc')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
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
                Are you sure you want to delete this checkpoint tag assignment? This action cannot be undone.
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
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
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
