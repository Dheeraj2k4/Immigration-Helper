import { useState, useEffect, useRef } from 'react';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Play,
  Pause,
  RotateCcw,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  id: number;
  text: string;
  category: string;
  tips: string;
}

// Sample interview questions
const interviewQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and why you're interested in this position.",
    category: "Introduction",
    tips: "Keep it concise, focus on relevant experience, and connect your background to the role."
  },
  {
    id: 2,
    text: "What are your greatest strengths and how do they apply to this role?",
    category: "Strengths",
    tips: "Provide specific examples and quantify your achievements where possible."
  },
  {
    id: 3,
    text: "Describe a challenging situation you faced at work and how you handled it.",
    category: "Problem Solving",
    tips: "Use the STAR method: Situation, Task, Action, Result."
  },
  {
    id: 4,
    text: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    tips: "Show ambition while staying realistic and relevant to the company's growth."
  },
  {
    id: 5,
    text: "Why do you want to work for our company?",
    category: "Company Interest",
    tips: "Research the company beforehand and mention specific aspects that appeal to you."
  },
  {
    id: 6,
    text: "Tell me about a time when you had to work with a difficult team member.",
    category: "Teamwork",
    tips: "Focus on your communication skills and ability to find solutions."
  },
  {
    id: 7,
    text: "What is your biggest weakness?",
    category: "Self-awareness",
    tips: "Choose a real weakness but show how you're actively working to improve it."
  },
  {
    id: 8,
    text: "Describe a project you're particularly proud of.",
    category: "Achievements",
    tips: "Highlight your role, the challenges overcome, and the impact of your work."
  },
  {
    id: 9,
    text: "How do you handle stress and pressure?",
    category: "Stress Management",
    tips: "Provide concrete examples of stress management techniques you use."
  },
  {
    id: 10,
    text: "Do you have any questions for us?",
    category: "Questions",
    tips: "Always have thoughtful questions prepared about the role, team, or company culture."
  }
];

// Progress Bar Component
function ProgressBar({ current, total, timeLeft }: { current: number; total: number; timeLeft: string }) {
  const progress = (current / total) * 100;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Question {current} of {total}
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Time left: {timeLeft}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          style={{
            height: '8px',
            background: 'linear-gradient(to right, #22C55E, #16A34A)',
            borderRadius: '9999px'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Question Card Component
function QuestionCard({ question, showTips }: { question: Question; showTips: boolean }) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-3">
            {question.category}
          </span>
          <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
            {question.text}
          </h2>
        </div>
        
        <div className="relative ml-4">
          <button
            className="p-2 text-gray-400 hover:text-green-600 transition-colors relative group"
            aria-label="Question tips"
          >
            <Info className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className={`absolute right-0 top-8 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg z-10 transition-all duration-200 ${
              showTips ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
            }`}>
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 rotate-45"></div>
              {question.tips}
            </div>
          </button>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

// Webcam Component
function WebcamPreview({ 
  isCameraOn, 
  isMicOn, 
  isRecording, 
  onToggleCamera, 
  onToggleMic,
  videoRef,
  audioLevel
}: {
  isCameraOn: boolean;
  isMicOn: boolean;
  isRecording: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioLevel: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Video Recording</h3>
      
      <div className="relative">
        {/* Webcam Preview Area */}
        <div className={`relative bg-gray-900 rounded-xl overflow-hidden mb-4 ${
          isMicOn && isRecording ? 'ring-4 ring-green-400 ring-opacity-50' : ''
        }`} style={{ aspectRatio: '16/9' }}>
          {isCameraOn ? (
            <>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              <span className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                Camera Preview
              </span>
            </>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center" style={{ minHeight: '400px' }}>
              <CameraOff className="w-16 h-16 text-gray-500" />
              <span className="absolute bottom-4 left-4 text-gray-400 text-sm">
                Camera Off
              </span>
            </div>
          )}
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Recording
            </div>
          )}
          
          {/* Audio Level Indicator */}
          {isMicOn && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-white" />
                <div className="flex gap-1 items-end h-6">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        i < Math.floor(audioLevel / 10) 
                          ? 'bg-green-400' 
                          : 'bg-gray-600'
                      }`}
                      style={{ 
                        height: `${(i + 1) * 10}%`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Camera Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onToggleCamera}
            variant={isCameraOn ? "default" : "outline"}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
              isCameraOn 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'border-gray-300 text-gray-700 hover:border-green-400'
            }`}
          >
            {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            {isCameraOn ? 'Camera On' : 'Camera Off'}
          </Button>
          
          <Button
            onClick={onToggleMic}
            variant={isMicOn ? "default" : "outline"}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
              isMicOn 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'border-gray-300 text-gray-700 hover:border-blue-400'
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            {isMicOn ? 'Mic On' : 'Mic Off'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Answer Display Component
function AnswerDisplay({ isListening, transcriptText }: { isListening: boolean; transcriptText: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Answer</h3>
      
      <div className="min-h-32 bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
        {transcriptText ? (
          <p className="text-gray-800 leading-relaxed">{transcriptText}</p>
        ) : (
          <div className="flex items-center justify-center h-20">
            {isListening ? (
              <div className="flex items-center gap-3 text-green-600">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-6 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-7 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-sm font-medium">Listening...</span>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Start recording to see your answer transcribed here
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Navigation Controls Component
function NavigationControls({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext,
  isRecording,
  onToggleRecording
}: {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Recording Control */}
      <Button
        onClick={onToggleRecording}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isRecording ? (
          <>
            <Pause className="w-4 h-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Recording
          </>
        )}
      </Button>
      
      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          variant="outline"
          className="flex items-center gap-2 px-6 py-3 rounded-full border-gray-300 text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          disabled={currentQuestion === totalQuestions}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Reset Button */}
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="flex items-center gap-2 px-4 py-3 rounded-full border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}

// Main AI Interview Component
export function AIInterview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [timeLeft, setTimeLeft] = useState('05:00');
  const [audioLevel, setAudioLevel] = useState(0);
  const showTips = false;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const totalQuestions = interviewQuestions.length;

  // Handle camera toggle
  const handleToggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        
        videoStreamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check your permissions.');
      }
    } else {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsCameraOn(false);
    }
  };

  // Handle microphone toggle
  const handleToggleMic = async () => {
    if (!isMicOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: false
        });
        
        audioStreamRef.current = stream;
        
        // Set up audio analysis
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        
        // Start monitoring audio level
        const monitorAudioLevel = () => {
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(Math.min(100, average));
          }
          
          animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
        };
        
        monitorAudioLevel();
        
        setIsMicOn(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check your permissions.');
      }
    } else {
      // Stop audio analysis
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      
      setAudioLevel(0);
      setIsMicOn(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Ensure video stream stays connected to video element
  useEffect(() => {
    if (isCameraOn && videoStreamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== videoStreamRef.current) {
        videoRef.current.srcObject = videoStreamRef.current;
      }
    }
  }, [isCameraOn, isMicOn]); // Re-run when mic state changes to ensure video doesn't disconnect

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const [minutes, seconds] = prev.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds;
          
          if (totalSeconds <= 1) {
            setIsRecording(false);
            return '00:00';
          }
          
          const newTotal = totalSeconds - 1;
          const newMinutes = Math.floor(newTotal / 60);
          const newSeconds = newTotal % 60;
          
          return `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRecording]);

  // Simulate transcription when recording
  useEffect(() => {
    if (isRecording && isMicOn) {
      const sentences = [
        "I believe my greatest strength is my ability to adapt quickly to new situations and technologies.",
        "Throughout my career, I've consistently demonstrated strong problem-solving skills.",
        "I'm particularly passionate about working in collaborative environments where I can learn from others.",
        "My experience in project management has taught me the importance of clear communication.",
        "I'm excited about the opportunity to contribute to your team's innovative projects."
      ];
      
      let currentText = '';
      let sentenceIndex = 0;
      
      const interval = setInterval(() => {
        if (sentenceIndex < sentences.length) {
          currentText += sentences[sentenceIndex] + ' ';
          setTranscriptText(currentText.trim());
          sentenceIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording, isMicOn]);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTranscriptText('');
      setIsRecording(false);
      setTimeLeft('05:00');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscriptText('');
      setIsRecording(false);
      setTimeLeft('05:00');
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(prev => !prev);
    if (!isRecording) {
      setTranscriptText('');
      setTimeLeft('05:00');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={totalQuestions} 
          timeLeft={timeLeft}
        />

        <AnimatePresence mode="wait">
          <QuestionCard 
            key={currentQuestion.id}
            question={currentQuestion} 
            showTips={showTips}
          />
        </AnimatePresence>

        <WebcamPreview
          isCameraOn={isCameraOn}
          isMicOn={isMicOn}
          isRecording={isRecording}
          onToggleCamera={handleToggleCamera}
          onToggleMic={handleToggleMic}
          videoRef={videoRef}
          audioLevel={audioLevel}
        />

        <AnswerDisplay 
          isListening={isRecording && isMicOn}
          transcriptText={transcriptText}
        />

        <NavigationControls
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
        />
      </div>

      <Footer />
    </div>
  );
}