import React, { useState, useRef, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { Send, Bot, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Chat Header Component
function ChatHeader() {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-6 rounded-t-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('visaGuide.title')}</h2>
          <p className="text-gray-600 text-sm">{t('visaGuide.subtitle')}</p>
        </div>
      </div>
    </div>
  );
}

// Suggested Questions Component
function SuggestedQuestions({ onSelectQuestion }: { onSelectQuestion: (question: string) => void }) {
  const { t } = useTranslation();
  const suggestions = [
    "What documents do I need for an F1 student visa?",
    "How do I apply for an H1B visa?",
    "What is the passport application process?",
    "What are the eligibility requirements for F1 visa?",
    "How long does H1B processing take?"
  ];

  return (
    <div className="p-6 border-b border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{t('visaGuide.quickQuestions')}</h3>
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
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
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
  const { t } = useTranslation();

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
          placeholder={t('visaGuide.typePlaceholder')}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          aria-label={t('visaGuide.send')}
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
      text: "Hi there 👋, I'm your Immigration Assistant powered by AI! I can help you with visa applications, document requirements, and immigration processes for F1 student visas, H1B work visas, and passport applications. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Call the RAG API through the backend
  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:5000/api/visa-chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: 'web-session-' + Date.now()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.answer) {
        return data.data.answer;
      } else {
        return "I apologize, but I'm having trouble processing your question right now. Please try rephrasing or ask about visa types, document requirements, or application processes.";
      }
    } catch (error) {
      console.error('Error querying RAG service:', error);
      return "I'm sorry, but I'm having trouble connecting to my knowledge base right now. Please make sure the backend server is running and try again.";
    }
  };

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get response from RAG API
      const botText = await generateBotResponse(messageText);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but something went wrong. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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