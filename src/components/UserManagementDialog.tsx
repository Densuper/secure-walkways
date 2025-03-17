
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, UserPlus, KeyRound } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  username: string;
  role: 'user' | 'admin';
};

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserManagementDialog = ({ open, onOpenChange }: UserManagementDialogProps) => {
  const [activeTab, setActiveTab] = useState('users');
  
  // Mock users data - in a real app, this would come from a backend
  const [users, setUsers] = useState<User[]>([
    { id: 'user_1', username: 'John Doe', role: 'user' },
    { id: 'user_2', username: 'Sarah Connor', role: 'user' },
    { id: 'user_3', username: 'Alex Smith', role: 'user' },
    { id: 'admin_1', username: 'Admin User', role: 'admin' },
  ]);
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  
  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const handleAddUser = () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({
        title: "Error",
        description: "Username and password are required",
        variant: "destructive",
      });
      return;
    }
    
    const newUser: User = {
      id: `${newRole}_${Date.now()}`,
      username: newUsername,
      role: newRole,
    };
    
    setUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    setShowAddUser(false);
    
    toast({
      title: "User added",
      description: `${newUsername} has been added as a ${newRole}`,
    });
  };
  
  const handleEditUser = (user: User) => {
    setEditUserId(user.id);
    setEditUsername(user.username);
    setEditPassword('');
  };
  
  const handleUpdateUser = () => {
    if (!editUsername.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.map(user => 
      user.id === editUserId 
        ? { ...user, username: editUsername } 
        : user
    ));
    
    setEditUserId(null);
    setEditUsername('');
    setEditPassword('');
    
    toast({
      title: "User updated",
      description: "User details have been updated",
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User deleted",
      description: "User has been removed",
    });
  };
  
  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setShowChangePassword(true);
  };
  
  const handleUpdatePassword = () => {
    if (!editPassword.trim()) {
      toast({
        title: "Error",
        description: "Password cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would update the user's password in the backend
    
    setShowChangePassword(false);
    setSelectedUser(null);
    setEditPassword('');
    
    toast({
      title: "Password updated",
      description: "Password has been changed successfully",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4 mt-4">
            {showAddUser ? (
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium">Add New User</h3>
                <div className="space-y-2">
                  <Label htmlFor="new-username">Username</Label>
                  <Input
                    id="new-username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowAddUser(true)} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            )}
            
            <div className="border rounded-md divide-y">
              {users
                .filter(user => user.role === 'user')
                .map(user => (
                  <div key={user.id} className="p-3 flex items-center justify-between">
                    {editUserId === user.id ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateUser}>
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditUserId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span>{user.username}</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleChangePassword(user)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {users.filter(user => user.role === 'user').length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found
                  </div>
                )}
            </div>
          </TabsContent>
          
          <TabsContent value="admins" className="space-y-4 mt-4">
            {showAddUser ? (
              <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium">Add New Admin</h3>
                <div className="space-y-2">
                  <Label htmlFor="new-admin-username">Username</Label>
                  <Input
                    id="new-admin-username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-admin-password">Password</Label>
                  <Input
                    id="new-admin-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setNewRole('admin');
                    handleAddUser();
                  }}>
                    Add Admin
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => {
                setNewRole('admin');
                setShowAddUser(true);
              }} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Admin
              </Button>
            )}
            
            <div className="border rounded-md divide-y">
              {users
                .filter(user => user.role === 'admin')
                .map(user => (
                  <div key={user.id} className="p-3 flex items-center justify-between">
                    {editUserId === user.id ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateUser}>
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditUserId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span>{user.username}</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleChangePassword(user)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {users.filter(user => user.role === 'admin').length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No admins found
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
        
        {showChangePassword && selectedUser && (
          <div className="mt-4 border p-4 rounded-md space-y-4">
            <h3 className="font-medium">Change Password for {selectedUser.username}</h3>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setShowChangePassword(false);
                setSelectedUser(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
