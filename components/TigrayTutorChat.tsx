'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Mic, Send, Upload, MicOff } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'react-hot-toast';
import { VoiceInput } from '@/utils/voice-input';
import { Message } from '@/lib/firebase';

export function TigrayTutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceInput = useRef<VoiceInput | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceInput.current = new VoiceInput();
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        if (data.length === 0) {
          const welcomeMessage: Message = {
            id: '1',
            content: 'ሰላም! Welcome to Tigray Tutor! 🎓\n\n⚠️ **Free Tier Notice**: This uses free AI services with daily limits. Please use thoughtfully.\n\nI can help you with:\n• 💬 Chat in Tigrinya and English\n• 🎤 Voice input\n• 🖼️ Image analysis\n• 📚 Educational questions\n\nHow can I assist you today?',
            isUser: false,
            timestamp: new Date().getTime(),
            type: 'text'
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Could not load chat history.');
      }
    };

    fetchMessages();
  }, [user]);

  const sendMessage = async (messageText?: string, imageData?: string) => {
    const textToSend = messageText || input.trim();
    if ((!textToSend && !imageData) || !user) return;

    const now = Date.now();
    if (now - lastRequestTime < 3000) {
      toast.error('Please wait a moment before sending another message');
      return;
    }
    setLastRequestTime(now);

    const userMessage: Omit<Message, 'id'> = {
      content: textToSend || 'Image uploaded',
      isUser: true,
      timestamp: new Date().getTime(),
      type: imageData ? 'image' : 'text',
      imageUrl: imageData
    };
    
    setMessages(prev => [...prev, { ...userMessage, id: Date.now().toString() }]);

    setInput('');
    setIsLoading(true);

    try {
      const token = await user.getIdToken();
      
      const requestBody: any = {
        userMessage: textToSend,
        actionType: imageData ? 'analyze_image' : 'tutor',
      };

      if (imageData) {
        requestBody.imageData = imageData;
      }
      
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: data.response,
        isUser: false,
        timestamp: new Date().getTime(),
        type: 'text',
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Chat Error:', error);
      
      let errorContent = `❌ Error: ${error.message}`;
      
      if (error.message.includes('quota') || error.message.includes('429')) {
        errorContent = '⚠️ Daily API quota exceeded. Please try again tomorrow or consider upgrading to a paid plan for unlimited usage.';
      } else if (error.message.includes('overloaded') || error.message.includes('503')) {
        errorContent = '⚠️ AI service is temporarily busy. Please try again in a few moments.';
      } else if (!navigator.onLine) {
        errorContent = '📡 You appear to be offline. Please check your internet connection.';
      }
      
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: errorContent,
        isUser: false,
        timestamp: new Date().getTime(),
        error: true,
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!voiceInput.current?.isSupported()) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      voiceInput.current.stop();
      setIsLoading(false);
      return;
    }

    try {
      setIsListening(true);
      toast.success('🎤 Listening... Speak now!');
      
      const transcript = await voiceInput.current.startListening();
      setInput(transcript);
      toast.success('✅ Voice input captured!');
    } catch (error: any) {
      toast.error(`Voice input failed: ${error.message}`);
    } finally {
      setIsListening(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1]; 
      sendMessage('Please analyze this image', base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold text-lg">🤖 Tigray Tutor AI Chat</h3>
        <p className="text-sm text-muted-foreground">
          💬 Chat • 🎤 Voice • 🖼️ Images • Available in Tigrinya & English
        </p>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('/api/test-gemini', '_blank')}
          >
            🔧 Test API
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground ml-4'
                    : message.error
                    ? 'bg-red-100 text-red-800 border border-red-200 mr-4'
                    : 'bg-muted mr-4'
                }`}
              >
                {message.type === 'image' && message.imageUrl && (
                  <img 
                    src={`data:image/jpeg;base64,${message.imageUrl}`} 
                    alt="Uploaded" 
                    className="max-w-full h-auto rounded mb-2"
                  />
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg mr-4 animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={scrollRef} />
      </ScrollArea>
      
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type in Tigrinya or English... (or use voice/image)"
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={() => sendMessage()} 
          disabled={isLoading || !input.trim()}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button 
          variant={isListening ? "destructive" : "outline"} 
          size="sm" 
          onClick={handleVoiceInput}
          disabled={isLoading}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </Card>
  );
}
