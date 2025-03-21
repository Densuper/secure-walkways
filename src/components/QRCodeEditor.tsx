
import React, { useState } from 'react';
import { Edit, Trash, Check, X, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { toast } from '@/components/ui/use-toast';

interface CheckpointTag {
  id: string;
  checkpointId: string;
  checkpointName: string;
  type: 'qr' | 'nfc';
}

interface QRCodeEditorProps {
  tag: CheckpointTag;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

const QRCodeEditor: React.FC<QRCodeEditorProps> = ({ tag, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag.checkpointName);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // API URL from environment variables or fallback to window.location.origin
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  
  const startEditing = () => {
    setEditValue(tag.checkpointName);
    setIsEditing(true);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
  };
  
  const saveEdit = async () => {
    if (!editValue.trim()) {
      toast({
        title: "Invalid Name",
        description: "Checkpoint name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // In a real app, you would call your backend API here
      console.log(`Updating QR code ${tag.id} name to ${editValue} on server`);
      
      // Actual API call
      const response = await fetch(`${API_BASE_URL}/api/update-qrcode`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('secureWalkToken')}`
        },
        body: JSON.stringify({ id: tag.id, newName: editValue }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update QR code name");
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "QR Code Updated",
          description: `Name changed to "${editValue}"`,
        });
        onEdit(tag.id, editValue);
        setIsEditing(false);
      } else {
        throw new Error(data.error || "Failed to update QR code name");
      }
    } catch (error) {
      console.error("Failed to update QR code name", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update the QR code name on the server",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="py-3 px-4 flex items-center justify-between border-b last:border-b-0">
      <div className="flex items-center flex-1">
        <div className="flex-1 max-w-[200px] sm:max-w-[300px]">
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="font-medium py-1 px-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                disabled={isUpdating}
              />
            </div>
          ) : (
            <div>
              <div className="font-medium truncate">{tag.checkpointName}</div>
              <div className="text-sm text-muted-foreground truncate">ID: {tag.id}</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={saveEdit}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={cancelEdit}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={startEditing}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(tag.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRCodeEditor;
