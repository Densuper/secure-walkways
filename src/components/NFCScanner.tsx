
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Smartphone } from 'lucide-react';

interface NFCScannerProps {
  onScan: (result: string) => void;
}

const NFCScanner = ({ onScan }: NFCScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  
  const checkNfcSupport = () => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
      return true;
    } else {
      setNfcSupported(false);
      setError('NFC is not supported on this device or browser');
      return false;
    }
  };
  
  const startScan = async () => {
    if (!checkNfcSupport()) return;
    
    setIsScanning(true);
    setError(null);
    
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      
      console.log("NFC scan started");
      
      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        console.log("NFC tag read:", serialNumber);
        
        // Process NDEF message
        if (message.records && message.records.length > 0) {
          for (const record of message.records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const text = textDecoder.decode(record.data);
              console.log("NFC tag content:", text);
              onScan(text);
              stopScan();
              return;
            }
          }
        }
        
        // If no text record found, use the serial number as fallback
        onScan(serialNumber);
        stopScan();
      });
      
      ndef.addEventListener("error", (error: any) => {
        console.error("NFC error:", error);
        setError(`NFC error: ${error.message}`);
        stopScan();
      });
    } catch (error: any) {
      console.error("Error starting NFC scan:", error);
      setError(`Error starting NFC scan: ${error.message}`);
      setIsScanning(false);
    }
  };
  
  const stopScan = () => {
    setIsScanning(false);
  };
  
  useEffect(() => {
    checkNfcSupport();
    return () => {
      // Cleanup
      stopScan();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md h-80 bg-muted mb-4 rounded-lg flex items-center justify-center relative overflow-hidden">
        {isScanning ? (
          <motion.div
            className="flex flex-col items-center justify-center text-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-6"
            >
              <Smartphone className="h-20 w-20 text-primary" />
            </motion.div>
            <p className="text-lg font-medium mb-2">Tap your device to the NFC tag</p>
            <p className="text-sm text-muted-foreground">Hold your device near the checkpoint tag</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            {nfcSupported === false ? (
              <div className="text-center">
                <AlertTriangle className="h-10 w-10 text-warning mx-auto mb-2" />
                <p className="text-lg font-medium mb-2">NFC Not Supported</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            ) : (
              <>
                <Smartphone className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="mb-2">NFC Reader</p>
                <p className="text-xs opacity-70">Press the button below to start scanning</p>
                {error && (
                  <p className="text-red-400 text-xs mt-2">{error}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isScanning || nfcSupported === false}
        onClick={isScanning ? stopScan : startScan}
        className={`btn-primary w-full max-w-md ${isScanning ? 'bg-red-500 hover:bg-red-600' : ''} ${nfcSupported === false ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isScanning ? 'Cancel Scanning' : 'Scan NFC Tag'}
      </motion.button>
    </div>
  );
};

export default NFCScanner;
