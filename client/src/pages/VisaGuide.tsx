import React, { useState, useRef, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Chat Header Component
function ChatHeader() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-6 rounded-t-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ask WanderBot</h2>
          <p className="text-gray-600 text-sm">Your AI Travel Guide — Here to help you explore visas, tours, and destinations.</p>
        </div>
      </div>
    </div>
  );
}

// Suggested Questions Component
function SuggestedQuestions({ onSelectQuestion }: { onSelectQuestion: (question: string) => void }) {
  const suggestions = [
    "How do I apply for a tourist visa?",
    "What documents are needed for Australia?",
    "Show me popular travel destinations.",
    "Tell me about student visas.",
    "How long does visa approval take?"
  ];

  return (
    <div className="p-6 border-b border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Quick questions to get you started:</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(suggestion)}
            className="flex-shrink-0 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// Chat Messages Component
function ChatMessages({ messages, isTyping }: { messages: Message[]; isTyping: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
        >
          <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.isBot ? 'bg-gray-200' : 'bg-green-500'
            }`}>
              {message.isBot ? (
                <Bot className="w-4 h-4 text-gray-600" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`px-4 py-3 rounded-xl shadow-sm ${
                message.isBot
                  ? 'bg-white border border-gray-200 text-gray-800'
                  : 'bg-green-500 text-white'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isBot ? 'text-gray-500' : 'text-green-100'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start animate-fadeIn">
          <div className="flex items-start gap-3 max-w-xs lg:max-w-md">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Chat Input Component
function ChatInput({ onSendMessage, disabled }: { onSendMessage: (message: string) => void; disabled: boolean }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

// Main Chatbot Page Component
export function VisaGuide() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there 👋, I'm WanderBot! How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Simulate bot responses
  const generateBotResponse = (userMessage: string): string => {
    const responses: Record<string, string> = {
      'tourist visa': "For tourist visas, you'll typically need a passport, photos, proof of accommodation, return tickets, and bank statements. The specific requirements vary by destination. Which country are you planning to visit?",
      'australia': "For Australia, you'll need a valid passport, visa application form, passport photos, proof of funds, health insurance, and character documents. Processing time is usually 15-30 days. Would you like specific details about any of these requirements?",
      'travel destinations': "Here are some popular destinations: 🇹🇭 Thailand (visa on arrival), 🇯🇵 Japan (e-visa), 🇸🇬 Singapore (visa-free for many), 🇦🇪 UAE (visa on arrival), 🇲🇾 Malaysia (visa-free). Which region interests you most?",
      'student visa': "Student visas require admission to an accredited institution, financial proof, health insurance, and academic transcripts. Processing can take 2-8 weeks depending on the country. Which country are you considering for studies?",
      'visa approval': "Visa approval times vary: Tourist visas (5-15 days), Student visas (2-8 weeks), Work visas (4-12 weeks), Family visas (6-18 months). Factors affecting timing include completeness of application, country policies, and current processing volumes."
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return "That's a great question! I can help you with visa applications, document requirements, processing times, and travel destinations. Could you be more specific about what you'd like to know?";
  };

  const handleSendMessage = (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(messageText),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <ChatHeader />
            <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />
            <ChatMessages messages={messages} isTyping={isTyping} />
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}