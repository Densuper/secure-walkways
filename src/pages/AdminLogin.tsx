
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Admin login successful",
          description: "Welcome to Secure Walk Admin",
        });
        navigate('/admin-dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Admin Password Reset",
      description: "Please contact your system administrator for assistance.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <NavBar title="Admin Login" showBack />
      
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Sign In</h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Admin Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter admin username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Admin Sign In'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
