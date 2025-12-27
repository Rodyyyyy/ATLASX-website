import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Search from './components/Search';
import TravelStats from './components/TravelStats';
import TravelStories from './components/TravelStories';
import SeasonalRecommendations from './components/SeasonalRecommendations';
import ProfileOffcanvas from './components/ProfileOffcanvas';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';
import Chatbot from './components/Chatbot';
import PlaceModal from './components/PlaceModal';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [currentCity, setCurrentCity] = useState('paris');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [showLogin, setShowLogin] = useState(false);

  // Refetch places when admin adds new one
  const [placesKey, setPlacesKey] = useState(0);
  const refetchPlaces = () => setPlacesKey(prev => prev + 1);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setShowPlaceModal(true);
  };

  const closePlaceModal = () => {
    setShowPlaceModal(false);
    setSelectedPlace(null);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    showToast('Logged out successfully');
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        setShowProfile={setShowProfile}
        token={token}
        role={role}
        setShowLogin={setShowLogin}
        onLogout={handleLogout}
      />

      <Hero />

      <TravelStats />

      <Search 
        showToast={showToast}
        initialCity={currentCity}
        onPlaceClick={handlePlaceClick}
        refetchKey={placesKey}
      />

      <SeasonalRecommendations 
        onPlaceClick={handlePlaceClick}
        refetchKey={placesKey}
      />

      <TravelStories 
        onPlaceClick={handlePlaceClick}
        token={token}
        role={role}
        showToast={showToast}
      />

      {role === 'admin' && (
        <AdminPanel 
          token={token} 
          showToast={showToast} 
          onAddSuccess={refetchPlaces} 
        />
      )}

      <ProfileOffcanvas 
        show={showProfile} 
        setShow={setShowProfile}
        token={token}
        showToast={showToast}
      />

      <Toast show={toast.show} message={toast.message} />

      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          city={selectedPlace.city || currentCity}
          isOpen={showPlaceModal}
          onClose={closePlaceModal}
          showToast={showToast}
          token={token}
        />
      )}

      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        setToken={setToken}
        setRole={setRole}
        showToast={showToast}
      />

      <BackToTop />
      <Chatbot token={token} />
    </div>
  );
}

export default App;