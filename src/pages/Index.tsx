
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { Shield, User, UserCog } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout noTransition>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Secure Walk</h1>
          <p className="text-muted-foreground max-w-md">
            Streamlined security checkpoints management system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Card
            hoverable
            delay={1}
            className="p-8 text-center flex flex-col items-center"
            onClick={() => navigate('/user-login')}
          >
            <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-full mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">User Login</h2>
            <p className="text-muted-foreground text-sm">
              Access your security walk dashboard
            </p>
          </Card>

          <Card
            hoverable
            delay={2}
            className="p-8 text-center flex flex-col items-center"
            onClick={() => navigate('/admin-login')}
          >
            <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-full mb-4">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
            <p className="text-muted-foreground text-sm">
              Manage security walks and checkpoints
            </p>
          </Card>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xs text-muted-foreground mt-12"
        >
          © {new Date().getFullYear()} Secure Walk. All rights reserved.
        </motion.p>
      </div>
    </Layout>
  );
};

export default Index;
