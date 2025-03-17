
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan: (result: string) => void;
}

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  
  // This is a mock implementation - in a real app, we would use a QR scanning library
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        // Simulate a successful scan after 2 seconds
        onScan('CHECKPOINT_QR_001');
        setIsScanning(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isScanning, onScan]);
  
  const startScan = () => {
    setIsScanning(true);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="qr-scanner-container w-full max-w-md h-80 bg-black mb-4">
        {/* This would be replaced with an actual camera feed in a real app */}
        <div className="w-full h-full bg-black flex items-center justify-center text-white">
          {isScanning ? 
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="text-sm">Scanning...</div>
              <div className="qr-scanner-overlay">
                <div className="qr-scanner-border relative">
                  <div className="qr-scanner-corners qr-scanner-corner-top-left"></div>
                  <div className="qr-scanner-corners qr-scanner-corner-top-right"></div>
                  <div className="qr-scanner-corners qr-scanner-corner-bottom-left"></div>
                  <div className="qr-scanner-corners qr-scanner-corner-bottom-right"></div>
                  <div className="qr-scanner-line"></div>
                </div>
              </div>
            </motion.div>
            : 
            <div className="text-center">
              <p className="mb-2">Camera preview</p>
              <p className="text-xs opacity-70">Press the button below to start scanning</p>
            </div>
          }
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isScanning}
        onClick={startScan}
        className="btn-primary w-full max-w-md"
      >
        {isScanning ? 'Scanning...' : 'Scan QR Code'}
      </motion.button>
    </div>
  );
};

export default QRScanner;
