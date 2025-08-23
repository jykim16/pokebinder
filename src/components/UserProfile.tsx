import React, { useState } from 'react';
import { User, Calendar, Trophy, Star, Settings, LogOut, Edit3, Save, X } from 'lucide-react';

interface UserProfileProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    joinDate: string;
  };
  totalCards: number;
  totalValue: number;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  totalCards,
  totalValue,
  onLogout,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    avatar: user.avatar || ''
  });

  const handleSave = () => {
    onUpdateProfile({
      ...user,
      name: editData.name,
      avatar: editData.avatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const membershipDays = Math.floor(
    (new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Profile</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                title="Save changes"
              >
                <Save className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                title="Cancel editing"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Edit profile"
            >
              <Edit3 className="w-4 h-4 text-white" />
            </button>
          )}
          <button
            onClick={onLogout}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {isEditing ? (
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-3 border-gray-600">
                {editData.avatar ? (
                  <img 
                    src={editData.avatar} 
                    alt={editData.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  getInitials(editData.name)
                )}
              </div>
              <input
                type="url"
                value={editData.avatar}
                onChange={(e) => setEditData(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="Avatar URL"
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-3 border-gray-600">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-semibold text-lg"
            />
          ) : (
            <h4 className="text-lg font-semibold text-white">{user.name}</h4>
          )}
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Total Cards</span>
          </div>
          <span className="text-2xl font-bold text-yellow-400">{totalCards}</span>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Collection Value</span>
          </div>
          <span className="text-2xl font-bold text-green-400">${totalValue.toFixed(0)}</span>
        </div>
      </div>

      {/* Membership Info */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span className="text-gray-400 text-sm">Member Since</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">
            {new Date(user.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="text-blue-400 text-sm">
            {membershipDays} days
          </span>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mt-6">
        <h5 className="text-white font-medium mb-3">Achievements</h5>
        <div className="flex flex-wrap gap-2">
          {totalCards >= 10 && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-full px-3 py-1 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium">Collector</span>
            </div>
          )}
          {totalValue >= 100 && (
            <div className="bg-green-900/30 border border-green-600 rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Investor</span>
            </div>
          )}
          {membershipDays >= 30 && (
            <div className="bg-blue-900/30 border border-blue-600 rounded-full px-3 py-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Veteran</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;