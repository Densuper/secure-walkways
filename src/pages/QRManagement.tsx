
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import QRScanner from '@/components/QRScanner';
import NFCScanner from '@/components/NFCScanner';
import QRCodeEditor from '@/components/QRCodeEditor';
import { mockQRCodes } from '@/lib/utils';
import { Plus, QrCode, Smartphone, Trash, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface CheckpointTag {
  id: string;
  checkpointId: string;
  checkpointName: string;
  type: 'qr' | 'nfc';
}

// Get the API URL from environment variables or fallback to window.location.origin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

const QRManagement = () => {
  const { user } = useAuth();
  const [checkpointTags, setCheckpointTags] = useState<CheckpointTag[]>(
    mockQRCodes.map(qr => ({ ...qr, type: 'qr' }))
  );
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'assign' | 'verify'>('assign');
  const [scanType, setScanType] = useState<'qr' | 'nfc'>('qr');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
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
  
  const handleScan = async (result: string) => {
    setShowScanner(false);
    
    if (scanMode === 'assign') {
      // Check if the QR/NFC code already exists
      const existingTag = checkpointTags.find(tag => tag.id === result && tag.type === scanType);
      
      if (existingTag) {
        toast({
          title: `${scanType.toUpperCase()} already exists`,
          description: `This ${scanType.toUpperCase()} is already assigned to "${existingTag.checkpointName}"`,
          variant: "destructive",
        });
        return;
      }
      
      // Create a default name
      const newTagName = `New ${scanType.toUpperCase()} Checkpoint ${checkpointTags.length + 1}`;
      
      try {
        // Try to add the new QR/NFC code to the server
        const response = await fetch(`${API_BASE_URL}/api/add-checkpoint-tag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('secureWalkToken')}`
          },
          body: JSON.stringify({
            id: result,
            checkpointName: newTagName,
            type: scanType
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add checkpoint tag");
        }
        
        // Add to local state
        const newTag: CheckpointTag = {
          id: result,
          checkpointId: `cp-${Math.floor(Math.random() * 1000)}`,
          checkpointName: newTagName,
          type: scanType
        };
        
        setCheckpointTags([...checkpointTags, newTag]);
        
        toast({
          title: `${scanType.toUpperCase()} assigned successfully`,
          description: `${scanType.toUpperCase()} has been assigned to checkpoint "${newTag.checkpointName}"`,
        });
      } catch (error) {
        console.error("Error adding checkpoint tag:", error);
        toast({
          title: "Failed to add checkpoint tag",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } else {
      // Verify mode
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
  
  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        // Try to delete the checkpoint tag from the server
        const response = await fetch(`${API_BASE_URL}/api/delete-checkpoint-tag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('secureWalkToken')}`
          },
          body: JSON.stringify({ id: showDeleteConfirm }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete checkpoint tag");
        }
        
        // Remove from local state
        setCheckpointTags(checkpointTags.filter(tag => tag.id !== showDeleteConfirm));
        toast({
          title: "Tag deleted",
          description: "The checkpoint tag has been deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting checkpoint tag:", error);
        toast({
          title: "Failed to delete checkpoint tag",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setShowDeleteConfirm(null);
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleEditQRCode = (id: string, newName: string) => {
    setCheckpointTags(prevTags =>
      prevTags.map(tag =>
        tag.id === id ? { ...tag, checkpointName: newName } : tag
      )
    );
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
          <h2 className="text-xl font-semibold p-4 border-b">Checkpoint Tags</h2>
          
          <div className="divide-y">
            {checkpointTags.map((tag, index) => (
              <motion.div 
                key={tag.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <QRCodeEditor
                  tag={tag}
                  onDelete={handleDelete}
                  onEdit={handleEditQRCode}
                />
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
