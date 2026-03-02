/**
 * TypeScript types and interfaces for AI Interview system
 */

export interface Question {
  id: string;
  text: string;
  category: 'general' | 'work' | 'study' | 'travel' | 'family';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SpeechToTextResult {
  transcript: string;
  confidence: number;
}

export interface EvaluationResult {
  score: number; // 0-10
  strengths: string[];
  weaknesses: string[];
  grammarIssues: string[];
  improvedAnswer: string;
  confidenceLevel: 'low' | 'medium' | 'high';
}

export interface InterviewResponse {
  questionId: string;
  question: string;
  transcript: string;
  evaluation: EvaluationResult;
  timestamp: Date;
}

export interface InterviewSession {
  sessionId: string;
  userId?: string;
  questions: Question[];
  responses: InterviewResponse[];
  overallScore: number;
  summary: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface GenerateQuestionsRequest {
  count?: number;
  category?: string;
  difficulty?: string;
}

export interface EvaluateAnswerRequest {
  question: string;
  transcript: string;
}

export interface CreateSessionRequest {
  userId?: string;
  questionCount?: number;
  useAI?: boolean;
  category?: string;
  difficulty?: string;
}
