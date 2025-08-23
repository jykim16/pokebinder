import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PriceUpdateStatusProps {
  className?: string;
}

const PriceUpdateStatus: React.FC<PriceUpdateStatusProps> = ({ className = '' }) => {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'partial_success' | 'failed' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLastUpdate();
    
    // Set up real-time subscription for price update logs
    const subscription = supabase
      .channel('price_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'price_update_logs' },
        () => {
          fetchLastUpdate();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLastUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('price_update_logs')
        .select('update_timestamp, status')
        .order('update_timestamp', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setLastUpdate(data[0].update_timestamp);
        setStatus(data[0].status);
      }
    } catch (error) {
      console.error('Error fetching last update:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'partial_success':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <TrendingUp className="w-4 h-4" />;
      case 'partial_success':
        return <AlertCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Less than an hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 text-sm ${className}`}>
        <Clock className="w-4 h-4 animate-pulse" />
        <span>Checking price updates...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>
        {lastUpdate 
          ? `Prices updated ${formatTimeAgo(lastUpdate)}`
          : 'No recent price updates'
        }
      </span>
    </div>
  );
};

export default PriceUpdateStatus;