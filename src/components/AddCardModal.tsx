import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Search, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCards } from '../hooks/useCards';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemoMode?: boolean;
  user?: any;
}

interface CardMatch {
  id: number;
  name: string;
  image: string;
  type: string;
  hp: string;
  rarity: string;
  confidence: number;
  setName: string;
  cardNumber: string;
  varietyId: number;
  marketValue: number;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  isDemoMode = false,
  user
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'search' | 'manual'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<CardMatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardMatch[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardMatch | null>(null);
  const [cardDetails, setCardDetails] = useState({
    condition: 'Near Mint' as const,
    quantity: 1,
    dateAcquired: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { allCards, searchCards, addCardToCollection, refreshUserCards } = useCards(user?.id, isDemoMode);

  if (!isOpen) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    // Simulate photo scanning process
    setTimeout(() => {
      // Mock scan result - randomly select from available cards
      if (allCards.length > 0) {
        const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
        const randomVariety = randomCard.varieties[Math.floor(Math.random() * randomCard.varieties.length)];
        
        const result: CardMatch = {
          id: randomCard.id,
          name: randomCard.name,
          image: randomVariety.image_url,
          type: randomCard.type,
          hp: randomCard.hp,
          rarity: randomVariety.rarity,
          confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
          setName: randomCard.set_name,
          cardNumber: randomCard.card_number,
          varietyId: randomVariety.id,
          marketValue: Number(randomVariety.market_value)
        };
        
        setScanResult(result);
        setSelectedCard(result);
      }
      setIsScanning(false);
    }, 2000);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = searchCards(searchQuery);
    const transformedResults: CardMatch[] = [];
    
    results.forEach(card => {
      card.varieties.forEach(variety => {
        transformedResults.push({
          id: card.id,
          name: card.name,
          image: variety.image_url,
          type: card.type,
          hp: card.hp,
          rarity: variety.rarity,
          confidence: 1.0,
          setName: card.set_name,
          cardNumber: card.card_number,
          varietyId: variety.id,
          marketValue: Number(variety.market_value)
        });
      });
    });
    
    setSearchResults(transformedResults);
  };

  const handleCardSelect = (card: CardMatch) => {
    setSelectedCard(card);
    setActiveTab('manual'); // Switch to details tab
  };

  const handleAddCard = async () => {
    if (!selectedCard || !user) return;

    setIsAdding(true);
    try {
      await addCardToCollection(
        selectedCard.id,
        selectedCard.varietyId,
        cardDetails
      );
      
      await refreshUserCards();
      onClose();
      
      // Reset form
      setScanResult(null);
      setSelectedCard(null);
      setSearchQuery('');
      setSearchResults([]);
      setCardDetails({
        condition: 'Near Mint',
        quantity: 1,
        dateAcquired: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error('Error adding card:', error);
      // You could show an error message here
    } finally {
      setIsAdding(false);
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Add New Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'scan', label: 'Scan Photo', icon: Camera },
            { id: 'search', label: 'Search Database', icon: Search },
            { id: 'manual', label: 'Card Details', icon: Plus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Scan Your Card</h3>
                <p className="text-gray-400 mb-6">Upload a photo of your Pokemon card to automatically identify it</p>
              </div>

              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {isScanning ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                    <div>
                      <p className="text-white font-medium">Scanning your card...</p>
                      <p className="text-gray-400 text-sm">This may take a few seconds</p>
                    </div>
                  </div>
                ) : scanResult ? (
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Card identified!</p>
                      <p className="text-gray-400 text-sm">Confidence: {(scanResult.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Click to upload a photo</p>
                      <p className="text-gray-400 text-sm">Supports JPG, PNG, and other image formats</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scan Result */}
              {scanResult && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-28 rounded-lg overflow-hidden border-2 border-gray-600">
                      <img 
                        src={scanResult.image} 
                        alt={scanResult.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium">{scanResult.name}</h4>
                        <span className={`text-sm font-medium ${getRarityColor(scanResult.rarity)}`}>
                          {scanResult.rarity}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white ml-2">{scanResult.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">HP:</span>
                          <span className="text-white ml-2">{scanResult.hp}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Set:</span>
                          <span className="text-white ml-2">{scanResult.setName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Number:</span>
                          <span className="text-white ml-2">{scanResult.cardNumber}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => handleCardSelect(scanResult)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Use This Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Search Card Database</h3>
                <p className="text-gray-400 mb-6">Search for your card by name or set</p>
              </div>

              {/* Search Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter card name or set..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Search Results</h4>
                  {searchResults.map((card, index) => (
                    <div 
                      key={`${card.id}-${card.varietyId}-${index}`}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => handleCardSelect(card)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-22 rounded-lg overflow-hidden border-2 border-gray-600">
                          <img 
                            src={card.image} 
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="text-white font-medium">{card.name}</h5>
                            <span className={`text-sm font-medium ${getRarityColor(card.rarity)}`}>
                              {card.rarity}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Set:</span>
                              <span className="text-white ml-2">{card.setName}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Number:</span>
                              <span className="text-white ml-2">{card.cardNumber}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Value:</span>
                              <span className="text-green-400 ml-2">${card.marketValue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No cards found matching your search</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-6">
              {selectedCard ? (
                <>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Add Card Details</h3>
                    <p className="text-gray-400 mb-6">Enter the details for your {selectedCard.name}</p>
                  </div>

                  {/* Selected Card Preview */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-gray-600">
                        <img 
                          src={selectedCard.image} 
                          alt={selectedCard.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-medium text-lg">{selectedCard.name}</h4>
                          <span className={`text-sm font-medium ${getRarityColor(selectedCard.rarity)}`}>
                            {selectedCard.rarity}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white ml-2">{selectedCard.type}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">HP:</span>
                            <span className="text-white ml-2">{selectedCard.hp}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Set:</span>
                            <span className="text-white ml-2">{selectedCard.setName}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Number:</span>
                            <span className="text-white ml-2">{selectedCard.cardNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Market Value:</span>
                            <span className="text-green-400 ml-2">${selectedCard.marketValue}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Condition</label>
                      <select
                        value={cardDetails.condition}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, condition: e.target.value as any }))}
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
                      <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={cardDetails.quantity}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Date Acquired</label>
                      <input
                        type="date"
                        value={cardDetails.dateAcquired}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, dateAcquired: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Notes</label>
                    <textarea
                      value={cardDetails.notes}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-24 resize-none"
                      placeholder="Add any notes about this card..."
                    />
                  </div>

                  {/* Add Button */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      disabled={isAdding}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCard}
                      disabled={isAdding}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Card to Collection'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Card Selected</h3>
                  <p className="text-gray-400">Please scan a photo or search for a card first</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;