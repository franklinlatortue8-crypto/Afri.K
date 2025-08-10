import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe3D } from './components/Globe3D';
import { CountryInfo } from './components/CountryInfo';
import { VoiceControl } from './components/VoiceControl';
import { Country, ViewState } from './types';
import './styles/main.css';

function App() {
  const [viewState, setViewState] = useState<ViewState>({
    mode: 'overview',
    selectedCountry: undefined,
    isZooming: false
  });

  const handleCountryClick = (country: Country) => {
    setViewState(prev => ({
      ...prev,
      mode: 'country',
      selectedCountry: country,
      isZooming: true
    }));

    // Simuler la fin du zoom
    setTimeout(() => {
      setViewState(prev => ({
        ...prev,
        isZooming: false
      }));
    }, 1500);
  };

  const handleCloseCountryInfo = () => {
    setViewState({
      mode: 'overview',
      selectedCountry: undefined,
      isZooming: false
    });
  };

  return (
    <div className="app">
      {/* En-tête */}
      <header className="app-header">
        <div className="app-header__content">
          <div className="app-header__brand">
            <h1 className="app-header__title">
              Atlas Afrique
            </h1>
            <p className="app-header__subtitle">
              Analyse des risques géopolitiques
            </p>
          </div>
          
          <VoiceControl onCountrySelected={handleCountryClick} />
        </div>
      </header>

      {/* Contenu principal */}
      <main className="app-main">
        <div className="app-main__globe">
          <Globe3D
            viewState={viewState}
            onCountryClick={handleCountryClick}
          />
        </div>

        {/* Instructions */}
        <AnimatePresence>
          {viewState.mode === 'overview' && (
            <motion.div
              className="app-instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="app-instructions__content">
                <h2 className="app-instructions__title">
                  Explorez l'Afrique
                </h2>
                <p className="app-instructions__text">
                  Cliquez sur un pays ou utilisez la commande vocale pour analyser les risques géopolitiques
                </p>
                <div className="app-instructions__actions">
                  <div className="app-instructions__action">
                    <span className="app-instructions__action-icon">🖱️</span>
                    <span>Clic sur un pays</span>
                  </div>
                  <div className="app-instructions__action">
                    <span className="app-instructions__action-icon">🎤</span>
                    <span>Commande vocale</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicateur de chargement pendant le zoom */}
        <AnimatePresence>
          {viewState.isZooming && (
            <motion.div
              className="zoom-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="zoom-indicator__spinner" />
              <p>Zoom en cours...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Panel d'information du pays */}
      <CountryInfo
        country={viewState.selectedCountry!}
        onClose={handleCloseCountryInfo}
        isVisible={viewState.mode === 'country' && !viewState.isZooming}
      />

      {/* Bouton retour */}
      <AnimatePresence>
        {viewState.mode === 'country' && !viewState.isZooming && (
          <motion.button
            className="return-button"
            onClick={handleCloseCountryInfo}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Retour à la vue globale
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;