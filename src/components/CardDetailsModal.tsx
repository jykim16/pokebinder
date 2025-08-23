import React, { useState } from 'react';
import { X, Calendar, DollarSign, Hash, Camera, Edit3, Save, Plus, Trash2, Star } from 'lucide-react';
import { PokemonCard, CardVariety } from '../types/pokemon';

interface CardDetailsModalProps {
  card: PokemonCard;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCard: (updatedCard: PokemonCard) => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  isOpen,
  onClose,
  onUpdateCard
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'varieties' | 'photos'>('overview');
  const [editingVariety, setEditingVariety] = useState<string | null>(null);
  const [editingVarietyData, setEditingVarietyData] = useState<CardVariety | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  if (!isOpen) return null;

  const selectedVariety = card.varieties.find(v => v.id === card.selectedVarietyId) || card.varieties[0];
  const totalValue = card.varieties.reduce((sum, variety) => sum + (variety.marketValue * variety.quantity), 0);
  const totalQuantity = card.varieties.reduce((sum, variety) => sum + variety.quantity, 0);
  const firstAcquired = card.varieties.reduce((earliest, variety) => 
    new Date(variety.dateAcquired) < new Date(earliest) ? variety.dateAcquired : earliest, 
    card.varieties[0]?.dateAcquired || ''
  );

  const handleVarietyEdit = (variety: CardVariety) => {
    setEditingVariety(variety.id);
    setEditingVarietyData({ ...variety });
  };

  const handleSaveVariety = () => {
    if (!editingVarietyData) return;
    
    const updatedCard = {
      ...card,
      varieties: card.varieties.map(v => 
        v.id === editingVarietyData.id ? editingVarietyData : v
      )
    };
    
    onUpdateCard(updatedCard);
    setEditingVariety(null);
    setEditingVarietyData(null);
  };

  const handleCancelEdit = () => {
    setEditingVariety(null);
    setEditingVarietyData(null);
  };

  const handleSelectVariety = (varietyId: string) => {
    const updatedCard = {
      ...card,
      selectedVarietyId: varietyId,
      image: card.varieties.find(v => v.id === varietyId)?.image || card.image
    };
    onUpdateCard(updatedCard);
  };

  const handleAddPhoto = (varietyId: string) => {
    if (!newPhotoUrl.trim()) return;
    
    const updatedCard = {
      ...card,
      varieties: card.varieties.map(v => 
        v.id === varietyId 
          ? { ...v, personalPhotos: [...v.personalPhotos, newPhotoUrl.trim()] }
          : v
      )
    };
    
    onUpdateCard(updatedCard);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (varietyId: string, photoIndex: number) => {
    const updatedCard = {
      ...card,
      varieties: card.varieties.map(v => 
        v.id === varietyId 
          ? { ...v, personalPhotos: v.personalPhotos.filter((_, i) => i !== photoIndex) }
          : v
      )
    };
    
    onUpdateCard(updatedCard);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'holo rare': return 'text-purple-400';
      case 'ultra rare': return 'text-yellow-400';
      case 'special art rare': return 'text-pink-400';
      case 'shiny rare': return 'text-cyan-400';
      case 'promo': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Mint': return 'text-green-400';
      case 'Near Mint': return 'text-blue-400';
      case 'Excellent': return 'text-yellow-400';
      case 'Good': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border-2 border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">{card.name}</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{card.type} Type</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{card.hp} HP</span>
                <span className="text-gray-500">•</span>
                <span className={`font-medium ${getRarityColor(selectedVariety.rarity)}`}>
                  {selectedVariety.rarity}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex h-[calc(95vh-120px)]">
          {/* Left Side - Pure Card Display */}
          <div className="w-3/5 p-8 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Card Display - Much Bigger and Completely Unobstructed */}
            <div className="w-96 h-[540px] rounded-2xl overflow-hidden border-4 border-gray-600 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img 
                src={selectedVariety.image} 
                alt={`${card.name} - ${selectedVariety.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/384x540/4A90E2/FFFFFF?text=${card.name}`;
                }}
              />
            </div>
          </div>

          {/* Right Side - All Information */}
          <div className="w-2/5 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'varieties', label: 'Varieties', icon: Hash },
                { id: 'photos', label: 'Photos', icon: Camera }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gray-800'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats at Top */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                      <div className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Total Value</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                      <div className="text-2xl font-bold text-blue-400">{totalQuantity}</div>
                      <div className="text-sm text-gray-400">Total Cards</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                      <div className="text-2xl font-bold text-purple-400">{card.varieties.length}</div>
                      <div className="text-sm text-gray-400">Varieties</div>
                    </div>
                  </div>

                  {/* Currently Selected Variety Details */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Currently Displayed: {selectedVariety.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rarity:</span>
                        <span className={`font-medium ${getRarityColor(selectedVariety.rarity)}`}>
                          {selectedVariety.rarity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Value:</span>
                        <span className="text-green-400 font-medium">${selectedVariety.marketValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Condition:</span>
                        <span className={`font-medium ${getConditionColor(selectedVariety.condition)}`}>
                          {selectedVariety.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantity:</span>
                        <span className="text-blue-400 font-medium">{selectedVariety.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date Acquired:</span>
                        <span className="text-purple-400 font-medium">
                          {new Date(selectedVariety.dateAcquired).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {selectedVariety.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <span className="text-gray-400 text-sm">Notes:</span>
                        <p className="text-gray-300 mt-1">{selectedVariety.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Collection Summary */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Collection Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Investment:</span>
                        <span className="text-green-400 font-bold text-lg">${totalValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Cards:</span>
                        <span className="text-blue-400 font-medium">{totalQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Varieties Owned:</span>
                        <span className="text-purple-400 font-medium">{card.varieties.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">First Acquired:</span>
                        <span className="text-yellow-400 font-medium">
                          {new Date(firstAcquired).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'varieties' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Card Varieties</h3>
                    <span className="text-sm text-gray-400">{card.varieties.length} varieties owned</span>
                  </div>
                  
                  {card.varieties.map((variety) => (
                    <div 
                      key={variety.id} 
                      className={`bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                        variety.id === card.selectedVarietyId 
                          ? 'border-yellow-400 bg-gray-750' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {editingVariety === variety.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Market Value ($)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={editingVarietyData?.marketValue || 0}
                                onChange={(e) => setEditingVarietyData(prev => prev ? 
                                  { ...prev, marketValue: parseFloat(e.target.value) || 0 } : null
                                )}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                              <input
                                type="number"
                                value={editingVarietyData?.quantity || 0}
                                onChange={(e) => setEditingVarietyData(prev => prev ? 
                                  { ...prev, quantity: parseInt(e.target.value) || 0 } : null
                                )}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Condition</label>
                              <select
                                value={editingVarietyData?.condition || 'Near Mint'}
                                onChange={(e) => setEditingVarietyData(prev => prev ? 
                                  { ...prev, condition: e.target.value as any } : null
                                )}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                              >
                                <option value="Mint">Mint</option>
                                <option value="Near Mint">Near Mint</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Light Play">Light Play</option>
                                <option value="Moderate Play">Moderate Play</option>
                                <option value="Heavy Play">Heavy Play</option>
                                <option value="Damaged">Damaged</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Date Acquired</label>
                              <input
                                type="date"
                                value={editingVarietyData?.dateAcquired || ''}
                                onChange={(e) => setEditingVarietyData(prev => prev ? 
                                  { ...prev, dateAcquired: e.target.value } : null
                                )}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Notes</label>
                            <textarea
                              value={editingVarietyData?.notes || ''}
                              onChange={(e) => setEditingVarietyData(prev => prev ? 
                                { ...prev, notes: e.target.value } : null
                              )}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20 resize-none"
                              placeholder="Add notes about this card..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveVariety}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-22 rounded-lg overflow-hidden border-2 border-gray-600 flex-shrink-0">
                            <img 
                              src={variety.image} 
                              alt={`${card.name} - ${variety.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-medium">{variety.name}</h4>
                                <span className={`text-sm font-medium ${getRarityColor(variety.rarity)}`}>
                                  {variety.rarity}
                                </span>
                                {variety.id === card.selectedVarietyId && (
                                  <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-medium">
                                    DISPLAYED
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleVarietyEdit(variety)}
                                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                                >
                                  <Edit3 className="w-4 h-4 text-gray-400" />
                                </button>
                                {variety.id !== card.selectedVarietyId && (
                                  <button
                                    onClick={() => handleSelectVariety(variety.id)}
                                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-lg transition-colors"
                                  >
                                    Display
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-2">
                              <div>
                                <span className="text-gray-400">Value:</span>
                                <span className="text-green-400 ml-1 font-medium">${variety.marketValue.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Qty:</span>
                                <span className="text-blue-400 ml-1 font-medium">{variety.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Condition:</span>
                                <span className={`ml-1 font-medium ${getConditionColor(variety.condition)}`}>
                                  {variety.condition}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">Acquired:</span>
                                <span className="text-purple-400 ml-1 font-medium">
                                  {new Date(variety.dateAcquired).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {variety.notes && (
                              <p className="text-gray-300 text-sm">{variety.notes}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Personal Photos</h3>
                  
                  {card.varieties.map((variety) => (
                    <div key={variety.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium">{variety.name}</h4>
                        <span className={`text-sm ${getRarityColor(variety.rarity)}`}>{variety.rarity}</span>
                      </div>
                      
                      {/* Photo Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {variety.personalPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-600">
                              <img 
                                src={photo} 
                                alt={`${card.name} - ${variety.name} photo ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=Photo`;
                                }}
                              />
                            </div>
                            <button
                              onClick={() => handleRemovePhoto(variety.id, index)}
                              className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Add Photo */}
                        <div className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-500 transition-colors">
                          <Plus className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-400 text-center">Add Photo</span>
                        </div>
                      </div>
                      
                      {/* Add Photo Input */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          placeholder="Enter photo URL..."
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={() => handleAddPhoto(variety.id)}
                          disabled={!newPhotoUrl.trim()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      
                      {variety.personalPhotos.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">
                          No photos added yet. Add URLs of your actual card photos above.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;