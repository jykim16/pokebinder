import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, AlertCircle, XCircle, TrendingUp, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PriceUpdateLog {
  id: number;
  updated_cards: number;
  error_count: number;
  update_timestamp: string;
  status: 'pending' | 'success' | 'partial_success' | 'failed';
  error_details?: string;
}

const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<PriceUpdateLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('price_update_logs')
        .select('*')
        .order('update_timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerManualUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-card-prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh logs after successful update
        setTimeout(() => {
          fetchLogs();
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering manual update:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'partial_success':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Monitor and manage Pokemon card price updates</p>
          </div>
          <button
            onClick={triggerManualUpdate}
            disabled={updating}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} />
            {updating ? 'Updating...' : 'Manual Update'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-gray-400">Last Update</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {logs[0] ? new Date(logs[0].update_timestamp).toLocaleDateString() : 'Never'}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-blue-400" />
              <span className="text-gray-400">Cards Updated</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {logs[0]?.updated_cards || 0}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-400">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {logs.length > 0 
                ? Math.round((logs.filter(l => l.status === 'success').length / logs.length) * 100)
                : 0}%
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400">Recent Errors</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {logs[0]?.error_count || 0}
            </div>
          </div>
        </div>

        {/* Update Logs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Price Update History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Timestamp</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Cards Updated</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Errors</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className={`capitalize ${getStatusColor(log.status)}`}>
                          {log.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(log.update_timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {log.updated_cards}
                    </td>
                    <td className="p-4">
                      <span className={log.error_count > 0 ? 'text-red-400' : 'text-gray-400'}>
                        {log.error_count}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {index < logs.length - 1 
                        ? `${Math.round((new Date(log.update_timestamp).getTime() - new Date(logs[index + 1].update_timestamp).getTime()) / 1000)}s`
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {logs.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No price update logs found. Trigger a manual update to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;