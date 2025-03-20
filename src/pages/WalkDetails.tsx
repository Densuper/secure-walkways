
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import NavBar from '@/components/NavBar';
import Card from '@/components/Card';
import CheckpointItem from '@/components/CheckpointItem';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// Mock data for a walk's details
const getMockWalkDetails = (walkId: string) => {
  return {
    id: walkId,
    date: '2023-06-15',
    startTime: '09:30 AM',
    endTime: '10:15 AM',
    duration: '45 min',
    status: 'Completed',
    notes: 'All checkpoints verified without issues.',
    checkpoints: [
      {
        id: 'cp1',
        name: 'Main Entrance',
        status: 'completed',
        timestamp: '09:35 AM',
        notes: 'All clear'
      },
      {
        id: 'cp2',
        name: 'North Building - Floor 1',
        status: 'completed',
        timestamp: '09:42 AM',
        notes: 'Light out in hallway'
      },
      {
        id: 'cp3',
        name: 'South Wing',
        status: 'completed',
        timestamp: '09:50 AM',
        notes: 'All clear'
      },
      {
        id: 'cp4',
        name: 'East Parking Lot',
        status: 'completed',
        timestamp: '10:00 AM',
        notes: 'All clear'
      },
      {
        id: 'cp5',
        name: 'West Gate',
        status: 'completed',
        timestamp: '10:10 AM',
        notes: 'All clear'
      }
    ]
  };
};

const WalkDetails = () => {
  const { walkId } = useParams<{ walkId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [walk, setWalk] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walkId) {
      navigate('/walk-history');
      return;
    }

    // In a real app, you would fetch the walk details from the API
    // For now, we'll use mock data
    const walkDetails = getMockWalkDetails(walkId);
    setWalk(walkDetails);
    setLoading(false);

    // Simulating an API call
    // const fetchWalkDetails = async () => {
    //   try {
    //     const response = await fetch(`${API_BASE_URL}/api/walk-details/${walkId}`, {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('secureWalkToken')}`
    //       }
    //     });
    //     const data = await response.json();
    //     if (data.success) {
    //       setWalk(data.walk);
    //     } else {
    //       // Handle error
    //       navigate('/walk-history');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching walk details:', error);
    //     navigate('/walk-history');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchWalkDetails();
  }, [walkId, navigate]);

  if (loading) {
    return (
      <Layout>
        <NavBar title="Walk Details" showBack />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!walk) {
    return (
      <Layout>
        <NavBar title="Walk Details" showBack />
        <div className="py-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Walk Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The requested security walk could not be found.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <NavBar 
        title="Walk Details" 
        showBack
      />
      
      <div className="py-6 space-y-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <h2 className="text-xl font-semibold">Security Walk</h2>
            <div className={`px-3 py-1 rounded-full text-sm ${
              walk.status === 'Completed' 
                ? 'bg-success/20 text-success' 
                : 'bg-warning/20 text-warning'
            }`}>
              {walk.status}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{new Date(walk.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{walk.startTime} - {walk.endTime} ({walk.duration})</span>
            </div>
          </div>
          
          {walk.notes && (
            <div className="bg-muted/30 p-3 rounded-md">
              <h3 className="font-medium mb-1">Notes</h3>
              <p className="text-sm text-muted-foreground">{walk.notes}</p>
            </div>
          )}
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold p-4 border-b">
            Checkpoints ({walk.checkpoints.length})
          </h3>
          
          <div className="divide-y">
            {walk.checkpoints.map((checkpoint: any, index: number) => (
              <motion.div
                key={checkpoint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 ${checkpoint.status === 'completed' ? 'checkpoint-complete' : 'checkpoint-incomplete'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mt-1">
                      {checkpoint.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-success mr-3" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-warning mr-3" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{checkpoint.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{checkpoint.timestamp}</span>
                      </div>
                      
                      {checkpoint.notes && (
                        <p className="text-sm mt-1">{checkpoint.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default WalkDetails;
