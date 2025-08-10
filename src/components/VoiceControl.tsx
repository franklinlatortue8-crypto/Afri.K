import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { Country } from '../types';

interface VoiceControlProps {
  onCountrySelected: (country: Country) => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({ onCountrySelected }) => {
  const { isListening, transcript, isSupported, startListening, stopListening } = useVoiceRecognition();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onCountrySelected);
    }
  };

  if (!isSupported) {
    return (
      <div className="voice-control voice-control--unsupported">
        <p className="text-sm text-gray-500">
          Reconnaissance vocale non supportée
        </p>
      </div>
    );
  }

  return (
    <div className="voice-control">
      <button
        onClick={handleMicClick}
        className={`voice-control__button ${isListening ? 'voice-control__button--listening' : ''}`}
        title={isListening ? 'Arrêter l\'écoute' : 'Commencer l\'écoute vocale'}
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
      
      {isListening && (
        <div className="voice-control__status">
          <div className="voice-control__pulse" />
          <p className="text-sm">
            Dites le nom d'un pays africain...
          </p>
        </div>
      )}
      
      {transcript && (
        <div className="voice-control__transcript">
          <p className="text-xs text-gray-600">
            Reconnu: "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
};