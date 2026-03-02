/**
 * Interview Routes
 * Defines all API endpoints for the AI Interview feature
 */

import { Router } from 'express';
import {
  getRandomQuestions,
  convertSpeechToText,
  evaluateAnswer,
  createSession,
  getSession,
  submitAnswer,
  completeSession,
  getUserSessions,
} from '../controllers/interviewController';
import { audioUpload } from '../utils/audioUpload';

const router = Router();

/**
 * @route   GET /api/interview/questions/random
 * @desc    Get random interview questions
 * @query   count - Number of questions (default: 5)
 * @query   ai - Use AI generation (default: false)
 * @query   category - Question category (optional)
 * @query   difficulty - Question difficulty (optional)
 * @access  Public
 */
router.get('/questions/random', getRandomQuestions);

/**
 * @route   POST /api/interview/speech-to-text
 * @desc    Convert audio file to text transcript
 * @body    audio - Audio file (multipart/form-data)
 * @access  Public
 */
router.post('/speech-to-text', audioUpload.single('audio'), convertSpeechToText);

/**
 * @route   POST /api/interview/evaluate
 * @desc    Evaluate user's answer using Gemini AI
 * @body    { question: string, transcript: string }
 * @access  Public
 */
router.post('/evaluate', evaluateAnswer);

/**
 * @route   POST /api/interview/session
 * @desc    Create a new interview session
 * @body    { userId?: string, questionCount?: number, useAI?: boolean, category?: string, difficulty?: string }
 * @access  Public
 */
router.post('/session', createSession);

/**
 * @route   GET /api/interview/session/:sessionId
 * @desc    Get interview session details
 * @param   sessionId - Session ID
 * @access  Public
 */
router.get('/session/:sessionId', getSession);

/**
 * @route   POST /api/interview/session/:sessionId/answer
 * @desc    Submit an answer for a session question
 * @param   sessionId - Session ID
 * @body    { questionId: string, transcript: string }
 * @access  Public
 */
router.post('/session/:sessionId/answer', submitAnswer);

/**
 * @route   POST /api/interview/session/:sessionId/complete
 * @desc    Complete session and generate summary
 * @param   sessionId - Session ID
 * @access  Public
 */
router.post('/session/:sessionId/complete', completeSession);

/**
 * @route   GET /api/interview/sessions
 * @desc    Get all sessions for a user
 * @query   userId - User ID
 * @access  Public
 */
router.get('/sessions', getUserSessions);

export default router;
