import { useState, useCallback, useRef } from 'react';
import { africanCountries } from '../data/countries';
import { Country } from '../types';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return null;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    return recognition;
  }, []);

  const findCountryByName = useCallback((spokenText: string): Country | null => {
    const normalizedText = spokenText.toLowerCase().trim();
    
    return africanCountries.find(country => {
      const countryName = country.name.toLowerCase();
      const fullName = country.fullName.toLowerCase();
      
      return countryName.includes(normalizedText) || 
             normalizedText.includes(countryName) ||
             fullName.includes(normalizedText) ||
             normalizedText.includes(fullName);
    }) || null;
  }, []);

  const startListening = useCallback((onCountryFound: (country: Country) => void) => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (!recognitionRef.current) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognition = recognitionRef.current;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        const foundCountry = findCountryByName(finalTranscript);
        if (foundCountry) {
          onCountryFound(foundCountry);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [initializeRecognition, findCountryByName]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening
  };
};