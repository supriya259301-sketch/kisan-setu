import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceResult: (text: string, intent?: { action: string; value: string }) => void;
  currentLanguage: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onVoiceResult,
  currentLanguage,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      setErrorMessage(
        'Speech recognition is not supported in this browser. You can still type queries or select sample voice prompts below.'
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen && supported) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen, supported]);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Match recognition language
      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        gu: 'gu-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        kn: 'kn-IN',
      };
      recognition.lang = langMap[currentLanguage] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);

        if (event.results[0].isFinal) {
          handleFinalTranscript(current);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions or click a sample query.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech was detected. Please try speaking closer to your microphone.');
        } else {
          setErrorMessage(`Voice recognition notice: ${event.error}. You can also use quick sample prompts below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      setErrorMessage('Could not initiate voice listener. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleFinalTranscript = (spokenText: string) => {
    const text = spokenText.toLowerCase().trim();
    let intent: { action: string; value: string } | undefined;

    if (text.includes('wheat') || text.includes('गेहूं') || text.includes('ਕਣਕ')) {
      intent = { action: 'filter_crop', value: 'Wheat' };
    } else if (text.includes('mustard') || text.includes('सरसों')) {
      intent = { action: 'filter_crop', value: 'Mustard' };
    } else if (text.includes('rice') || text.includes('धान') || text.includes('चावल')) {
      intent = { action: 'filter_crop', value: 'Basmati Rice' };
    } else if (text.includes('onion') || text.includes('प्याज') || text.includes('कांदा')) {
      intent = { action: 'filter_crop', value: 'Onion' };
    } else if (text.includes('calculator') || text.includes('मुनाफा') || text.includes('हिसाब')) {
      intent = { action: 'navigate', value: 'calculator' };
    } else if (text.includes('buyer') || text.includes('खरीदार') || text.includes('व्यापारी')) {
      intent = { action: 'navigate', value: 'buyers' };
    } else if (text.includes('mandi') || text.includes('भाव') || text.includes('रेट')) {
      intent = { action: 'navigate', value: 'prices' };
    } else if (text.includes('transport') || text.includes('ट्रक') || text.includes('गाड़ी')) {
      intent = { action: 'navigate', value: 'logistics' };
    } else if (text.includes('share') || text.includes('साझा')) {
      intent = { action: 'navigate', value: 'shared' };
    }

    onVoiceResult(spokenText, intent);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const selectSampleQuery = (query: string, intent?: { action: string; value: string }) => {
    setTranscript(query);
    onVoiceResult(query, intent);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-700 mb-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-lg font-bold">Kisan Setu Voice Assistant</h3>
        </div>
        <p className="text-sm text-stone-500 mb-6">
          Speak in Hindi, Punjabi, English or your preferred regional dialect to find buyers, mandi prices, or vehicle routes.
        </p>

        {/* Big Mic Status Visualizer */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="absolute -inset-6 rounded-full bg-emerald-500/10 animate-pulse"></div>
              </>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isListening
                  ? 'bg-emerald-600 text-white scale-105 shadow-emerald-500/30'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {isListening ? <Mic className="w-10 h-10 animate-pulse" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>

          <div className="mt-4 text-center">
            {isListening ? (
              <div className="flex items-center space-x-1 text-emerald-700 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Listening actively... Speak now</span>
              </div>
            ) : (
              <button
                onClick={startListening}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Tap microphone to start speaking
              </button>
            )}
          </div>
        </div>

        {/* Live Spoken Transcript */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 min-h-20 flex items-center justify-center text-center mb-5">
          {transcript ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">Recognized Speech</span>
              <p className="text-base font-bold text-stone-900">"{transcript}"</p>
            </div>
          ) : (
            <p className="text-sm text-stone-400 italic">
              Try saying: "Wheat buyers in Khanna" or "Mandi price of Mustard"
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-start space-x-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Fast Voice Suggestion Chips */}
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Quick Voice Commands for Farmers:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => selectSampleQuery('Wheat buyers near me', { action: 'filter_crop', value: 'Wheat' })}
              className="text-xs bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer flex items-center space-x-1"
            >
              <span>"Wheat buyers near me"</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
            </button>
            <button
              onClick={() => selectSampleQuery('Azadpur Mandi prices', { action: 'navigate', value: 'prices' })}
              className="text-xs bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer flex items-center space-x-1"
            >
              <span>"Azadpur Mandi prices"</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
            </button>
            <button
              onClick={() => selectSampleQuery('Calculate net profit for 100 quintals', { action: 'navigate', value: 'calculator' })}
              className="text-xs bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer flex items-center space-x-1"
            >
              <span>"Calculate net profit"</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
            </button>
            <button
              onClick={() => selectSampleQuery('Find shared transport to Delhi', { action: 'navigate', value: 'shared' })}
              className="text-xs bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer flex items-center space-x-1"
            >
              <span>"Find shared transport"</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
