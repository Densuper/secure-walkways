
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock checkpoints data
export const mockCheckpoints = [
  { id: "cp1", name: "Main Entrance", completed: true, timestamp: "08:30 AM" },
  { id: "cp2", name: "Server Room", completed: true, timestamp: "08:45 AM" },
  { id: "cp3", name: "East Wing Corridor", completed: false },
  { id: "cp4", name: "Fire Exit", completed: false },
  { id: "cp5", name: "Parking Lot", completed: false },
  { id: "cp6", name: "Loading Dock", completed: false },
];

// Mock previous walks data
export const mockPreviousWalks = [
  {
    date: "2023-06-01",
    checkpoints: [
      { id: "cp1", name: "Main Entrance", completed: true, timestamp: "08:30 AM" },
      { id: "cp2", name: "Server Room", completed: true, timestamp: "08:45 AM" },
      { id: "cp3", name: "East Wing Corridor", completed: true, timestamp: "09:00 AM" },
      { id: "cp4", name: "Fire Exit", completed: true, timestamp: "09:15 AM" },
      { id: "cp5", name: "Parking Lot", completed: true, timestamp: "09:30 AM" },
      { id: "cp6", name: "Loading Dock", completed: true, timestamp: "09:45 AM" },
    ]
  },
  {
    date: "2023-05-31",
    checkpoints: [
      { id: "cp1", name: "Main Entrance", completed: true, timestamp: "08:35 AM" },
      { id: "cp2", name: "Server Room", completed: true, timestamp: "08:50 AM" },
      { id: "cp3", name: "East Wing Corridor", completed: true, timestamp: "09:05 AM" },
      { id: "cp4", name: "Fire Exit", completed: true, timestamp: "09:20 AM" },
      { id: "cp5", name: "Parking Lot", completed: true, timestamp: "09:35 AM" },
      { id: "cp6", name: "Loading Dock", completed: false },
    ]
  }
];

// Mock QR codes data
export const mockQRCodes = [
  { id: "qr1", checkpointId: "cp1", checkpointName: "Main Entrance" },
  { id: "qr2", checkpointId: "cp2", checkpointName: "Server Room" },
  { id: "qr3", checkpointId: "cp3", checkpointName: "East Wing Corridor" },
  { id: "qr4", checkpointId: "cp4", checkpointName: "Fire Exit" },
  { id: "qr5", checkpointId: "cp5", checkpointName: "Parking Lot" },
  { id: "qr6", checkpointId: "cp6", checkpointName: "Loading Dock" },
];

// Format date to readable string
export function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString(undefined, options);
}
