
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan: (result: string) => void;
}

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const startScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        scanQRCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('Camera access denied. Please check your browser permissions.');
      setIsScanning(false);
    }
  };
  
  const stopScan = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      if (code) {
        console.log('QR code detected:', code.data);
        stopScan();
        onScan(code.data);
      } else {
        animationRef.current = requestAnimationFrame(scanQRCode);
      }
    } catch (error) {
      console.error('QR scanning error:', error);
      animationRef.current = requestAnimationFrame(scanQRCode);
    }
  };
  
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <div className="qr-scanner-container w-full max-w-md h-80 bg-black mb-4 relative">
        {isScanning ? (
          <>
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="qr-scanner-overlay">
                <div className="qr-scanner-border relative">
                  <div className="qr-scanner-corners qr-scanner-corner-top-left"></div>
                  <div className="qr-scanner-corners qr-scanner-corner-top-right"></div>
                  <div className="qr-scanner-corners qr-scanner-corner-bottom-left"></div>
                  <div className="qr-scanner-corners qr-scanner-corner-bottom-right"></div>
                  <motion.div 
                    className="qr-scanner-line"
                    animate={{ 
                      top: ["0%", "100%", "0%"],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-1">
                Scanning...
              </div>
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <p className="mb-2">Camera preview</p>
              <p className="text-xs opacity-70">Press the button below to start scanning</p>
              {errorMessage && (
                <p className="text-red-400 text-xs mt-2">{errorMessage}</p>
              )}
            </div>
          </div>
        )}
        {/* Hidden canvas for QR code detection */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isScanning}
        onClick={isScanning ? stopScan : startScan}
        className={`btn-primary w-full max-w-md ${isScanning ? 'bg-red-500 hover:bg-red-600' : ''}`}
      >
        {isScanning ? 'Cancel Scanning' : 'Scan QR Code'}
      </motion.button>
    </div>
  );
};

export default QRScanner;
