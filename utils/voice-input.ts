declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
  type SpeechRecognitionEvent = {
    results: {
      [key: number]: {
        [key: number]: {
          transcript: string;
        };
      };
    };
  };
  type SpeechRecognitionErrorEvent = {
    error: string;
    message?: string;
  };
}

export class VoiceInput {
    private recognition: any;
    
    constructor() {
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'ti-ET'; // Tigrinya
      } else {
        throw new Error('Speech recognition not supported');
      }
    }
  
    startListening(): Promise<string> {
      return new Promise((resolve, reject) => {
        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          resolve(transcript);
        };
        
        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          reject(new Error('Speech recognition error'));
        };
        
        this.recognition.start();
      });
    }
  
    stop() {
      this.recognition.stop();
    }
  }