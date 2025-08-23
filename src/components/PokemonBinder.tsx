import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BookOpen, Plus, User } from 'lucide-react';
import { PokemonCard } from '../types/pokemon';
import { useAuth } from '../hooks/useAuth';
import { useCards } from '../hooks/useCards';
import CardDetailsModal from './CardDetailsModal';
import AddCardModal from './AddCardModal';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

const CARDS_PER_PAGE = 9;

interface PokemonBinderProps {
  isDemoMode?: boolean;
  user?: any;
  profile?: any;
}

const PokemonBinder: React.FC<PokemonBinderProps> = ({ 
  isDemoMode: propIsDemoMode, 
  user: propUser, 
  profile: propProfile 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Use props if provided, otherwise fall back to hooks
  const authHook = useAuth();
  const user = propUser || authHook.user;
  const profile = propProfile || authHook.profile;
  const isDemoMode = propIsDemoMode !== undefined ? propIsDemoMode : authHook.isDemoMode;
  const loading = authHook.loading;
  const signOut = authHook.signOut;
  const updateProfile = authHook.updateProfile;
  
  const { userCards, loading: cardsLoading } = useCards(user?.id, isDemoMode);
  
  const totalCardPages = Math.ceil(userCards.length / CARDS_PER_PAGE);
  const totalPages = totalCardPages + 2; // cover + card pages + back cover
  const isBackCover = currentPage === totalPages - 1;

  const getCurrentPageCards = () => {
    const cardPageIndex = currentPage - 1;
    const startIndex = cardPageIndex * CARDS_PER_PAGE;
    return userCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
  };

  const toggleBinder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentPage(1);
    }
  };

  const turnPage = useCallback((direction: 'next' | 'prev') => {
    if (isPageTurning) return;
    
    setIsPageTurning(true);
    
    if (direction === 'next' && currentPage < totalPages - 1) {
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsPageTurning(false);
      }, 600);
    } else if (direction === 'prev' && currentPage > 1) {
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsPageTurning(false);
      }, 600);
    } else {
      setIsPageTurning(false);
    }
  }, [currentPage, totalPages, isPageTurning]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPageTurning) return;
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    setDragCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartX === null || dragCurrentX === null) {
      setIsDragging(false);
      setDragStartX(null);
      setDragCurrentX(null);
      return;
    }

    const dragDistance = dragCurrentX - dragStartX;
    const threshold = 100;

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance < 0 && currentPage < totalPages - 1) {
        turnPage('next');
      } else if (dragDistance > 0 && currentPage > 1) {
        turnPage('prev');
      }
    }

    setIsDragging(false);
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const getDragTransform = () => {
    if (!isDragging || dragStartX === null || dragCurrentX === null) return '';
    
    const dragDistance = dragCurrentX - dragStartX;
    const maxDrag = 200;
    const clampedDrag = Math.max(-maxDrag, Math.min(maxDrag, dragDistance));
    const rotateY = (clampedDrag / maxDrag) * 25;
    const translateX = clampedDrag * 0.3;
    
    return `perspective(1200px) rotateY(${rotateY}deg) translateX(${translateX}px)`;
  };

  const jumpToPage = (pageIndex: number) => {
    if (pageIndex === 0) {
      setIsOpen(false);
      return;
    }
    
    if (!isPageTurning && pageIndex !== currentPage) {
      setIsPageTurning(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsPageTurning(false);
      }, 600);
    }
  };

  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleUpdateCard = (updatedCard: PokemonCard) => {
    // This will be handled by the useCards hook
    setSelectedCard(updatedCard);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    setShowUserProfile(false);
  };

  const handleUpdateProfile = async (updatedData: { name: string; avatar_url?: string }) => {
    if (profile) {
      await updateProfile(updatedData);
    }
  };

  const getTotalValue = () => {
    return userCards.reduce((total, card) => 
      total + card.varieties.reduce((sum, variety) => 
        sum + (variety.marketValue * variety.quantity), 0
      ), 0
    );
  };

  const getTotalCards = () => {
    return userCards.reduce((total, card) => 
      total + card.varieties.reduce((sum, variety) => sum + variety.quantity, 0), 0
    );
  };

  // Show loading screen while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="text-white text-xl">Loading...</div>
          {isDemoMode && <div className="text-blue-400 text-sm">Demo Mode</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Top Bar with User Profile */}
        {user && profile && (
          <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
            {/* User Profile Button */}
            <button
              onClick={() => setShowUserProfile(!showUserProfile)}
              className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-2 hover:bg-gray-700/80 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
                )}
              </div>
              <span className="text-white font-medium">{profile.name}</span>
              {isDemoMode && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">DEMO</span>
              )}
            </button>
          </div>
        )}

        {/* User Profile Panel */}
        {showUserProfile && user && profile && (
          <div className="absolute top-20 right-6 z-20 w-80">
            <UserProfile
              user={{
                id: profile.id,
                email: profile.email || '',
                name: profile.name,
                avatar: profile.avatar_url,
                joinDate: profile.created_at
              }}
              totalCards={getTotalCards()}
              totalValue={getTotalValue()}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        )}

        {/* Main Binder Container */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            {/* Binder Cover */}
            <div 
              className={`binder-cover ${isOpen ? 'open' : ''}`}
              onClick={toggleBinder}
            >
              <div className="cover-front">
                <div className="pokeball-design">
                  {/* Top Red Section */}
                  <div className="pokeball-top">
                    <div className="tcgames-logo">
                      <div className="logo-bars">
                        <div className="bar"></div>
                        <div className="bar"></div>
                      </div>
                      <span className="logo-text">TCGAMES</span>
                      <div className="logo-subtitle">THE TRADING CARD EXPERT</div>
                    </div>
                  </div>
                  
                  {/* Middle Line with Button */}
                  <div className="pokeball-middle">
                    <div className="pokeball-button">
                      <div className="button-inner"></div>
                    </div>
                  </div>
                  
                  {/* Bottom White Section with Elements */}
                  <div className="pokeball-bottom">
                    <div className="pokemon-elements">
                      <div className="element grass"></div>
                      <div className="element water"></div>
                      <div className="element fire"></div>
                      <div className="element electric"></div>
                    </div>
                  </div>
                </div>
                
                {/* Click indicator */}
                <div className="click-indicator">
                  <BookOpen size={32} />
                  <span>{user ? 'Click to Open' : 'Sign In to Open'}</span>
                </div>
              </div>
            </div>

            {/* Binder Pages */}
            <div className={`binder-pages ${isOpen ? 'visible' : ''}`}>
              <div 
                ref={pageRef}
                className={`page-background ${isPageTurning ? 'turning' : ''}`}
                style={{ transform: getDragTransform() }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="page-texture"></div>
                
                {/* Page Turn Areas */}
                <div 
                  className="page-turn-area left"
                  onClick={() => turnPage('prev')}
                  title="Previous page"
                />
                <div 
                  className="page-turn-area right"
                  onClick={() => turnPage('next')}
                  title="Next page"
                />
                
                {/* Content Area */}
                {isBackCover ? (
                  /* Back Cover Content */
                  <div className="back-cover-content">
                    <div className="back-cover-design">
                      <div className="collection-stats">
                        <h2>Collection Stats</h2>
                        <div className="stats-grid">
                          <div className="stat-item">
                            <span className="stat-number">{userCards.length}</span>
                            <span className="stat-label">Total Cards</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-number">{totalCardPages}</span>
                            <span className="stat-label">Pages</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-number">${getTotalValue().toFixed(0)}</span>
                            <span className="stat-label">Value</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="back-logo">
                        <div className="mini-pokeball">
                          <div className="mini-pokeball-top"></div>
                          <div className="mini-pokeball-middle">
                            <div className="mini-pokeball-button"></div>
                          </div>
                          <div className="mini-pokeball-bottom"></div>
                        </div>
                        <p className="collection-title">{profile?.name}'s Collection</p>
                        <p className="collection-subtitle">Gotta Catch 'Em All!</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Card Grid */
                  <div className="card-grid">
                    {cardsLoading ? (
                      <div className="col-span-3 row-span-3 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <div className="text-white text-lg">Loading cards...</div>
                          {isDemoMode && <div className="text-blue-400 text-sm">Demo Mode</div>}
                        </div>
                      </div>
                    ) : (
                      <>
                        {getCurrentPageCards().map((card, index) => (
                          <div key={card.id} className="card-slot">
                            <div className="card-sleeve">
                              <div 
                                className="pokemon-card"
                                onClick={() => handleCardClick(card)}
                              >
                                <img 
                                  src={card.image} 
                                  alt={card.name}
                                  className="card-image"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://via.placeholder.com/245x342/4A90E2/FFFFFF?text=${card.name}`;
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Empty slots for incomplete pages */}
                        {Array.from({ length: CARDS_PER_PAGE - getCurrentPageCards().length }).map((_, index) => (
                          <div key={`empty-${index}`} className="card-slot empty">
                            <div className="card-sleeve">
                              <div className="empty-slot">
                                <div className="empty-slot-text">Empty</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
                
                {/* Page binding holes */}
                <div className="binding-holes">
                  <div className="hole"></div>
                  <div className="hole"></div>
                  <div className="hole"></div>
                </div>
              </div>
            </div>
          </div>

          {/* External Page Indicator with Add Card Button - Positioned below binder */}
          {isOpen && user && (
            <div className="external-page-indicator">
              <div className="flex items-center gap-6">
                {/* Add Card Button */}
                <button
                  onClick={() => setIsAddCardModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  title="Add new card to collection"
                >
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>

                {/* Page Dots */}
                <div className="page-dots">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <div 
                      key={index}
                      className={`page-dot ${
                        (index === 0 && !isOpen) || (index === currentPage && isOpen) ? 'active' : ''
                      } ${
                        index === 0 ? 'cover-dot' : 
                        index === totalPages - 1 ? 'back-cover-dot' : 
                        'card-page-dot'
                      }`}
                      onClick={() => jumpToPage(index)}
                      title={
                        index === 0 ? 'Cover' : 
                        index === totalPages - 1 ? 'Back Cover' : 
                        `Page ${index}`
                      }
                    />
                  ))}
                </div>
              </div>
              
              <div className="page-info">
                {isBackCover ? (
                  <span className="back-cover-text">Back Cover</span>
                ) : (
                  <span>Page {currentPage} of {totalCardPages}</span>
                )}
                {isDemoMode && <span className="text-blue-400 text-sm ml-2">(Demo)</span>}
              </div>
              <div className="page-instructions">
                <span>Click page edges to turn • Drag to flip • Click dots to jump</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Bolt Badge - Always at bottom */}
      <footer className="flex items-center justify-center py-6">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.svg"
              alt="Bolt Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-medium group-hover:text-white/90 transition-colors">
            Built by Bolt
          </span>
        </a>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Card Details Modal */}
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateCard={handleUpdateCard}
        />
      )}

      {/* Add Card Modal */}
      {user && (
        <AddCardModal
          isOpen={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
          isDemoMode={isDemoMode}
          user={user}
        />
      )}
    </div>
  );
};

export default PokemonBinder;