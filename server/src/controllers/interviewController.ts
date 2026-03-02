/**
 * Interview Controllers
 * Handle all interview-related API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import questionService from '../services/questionService';
import geminiService from '../services/geminiService';
import speechToTextService from '../services/speechToTextService';
import InterviewRepository from '../repositories/interviewRepository';
import { deleteUploadedFile } from '../utils/audioUpload';
import {
  EvaluateAnswerRequest,
  CreateSessionRequest,
} from '../types/interview';
import { MulterRequest } from '../types/express';

/**
 * GET /api/interview/questions/random
 * Get random interview questions (predefined or AI-generated)
 */
export const getRandomQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      count = 5,
      ai = 'false',
      category,
      difficulty,
    } = req.query;

    const questionCount = parseInt(count as string);
    const useAI = ai === 'true';

    if (isNaN(questionCount) || questionCount < 1 || questionCount > 20) {
      return res.status(400).json({
        success: false,
        message: 'Question count must be between 1 and 20',
      });
    }

    const questions = await questionService.getQuestions(
      questionCount,
      useAI,
      category as string,
      difficulty as string
    );

    res.json({
      success: true,
      data: {
        questions,
        count: questions.length,
        aiGenerated: useAI,
      },
    });
  } catch (error: any) {
    return next(error);
  }
};

/**
 * POST /api/interview/speech-to-text
 * Convert audio file to text transcript
 */
export const convertSpeechToText = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required',
      });
    }

    const audioFilePath = req.file.path;

    try {
      // Convert speech to text
      const result = await speechToTextService.convertSpeechToText(audioFilePath);

      res.json({
        success: true,
        data: result,
      });
    } finally {
      // Clean up uploaded file
      deleteUploadedFile(audioFilePath);
    }
  } catch (error: any) {
    // Clean up file if it exists
    if (req.file) {
      deleteUploadedFile(req.file.path);
    }
    return next(error);
  }
};

/**
 * POST /api/interview/evaluate
 * Evaluate user's answer using Gemini AI
 */
export const evaluateAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, transcript }: EvaluateAnswerRequest = req.body;

    // Validation
    if (!question || !transcript) {
      return res.status(400).json({
        success: false,
        message: 'Question and transcript are required',
      });
    }

    if (transcript.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Transcript is too short. Please provide a more complete answer.',
      });
    }

    // Evaluate using Gemini AI
    const evaluation = await geminiService.evaluateAnswer(question, transcript);

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error: any) {
    return next(error);
  }
};

/**
 * POST /api/interview/session
 * Create a new interview session
 */
export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      questionCount = 5,
      useAI = false,
      category,
      difficulty,
    }: CreateSessionRequest = req.body;

    // Get questions for the session
    const questions = await questionService.getQuestions(
      questionCount,
      useAI,
      category,
      difficulty
    );

    // Create session
    const session = await InterviewRepository.create({
      session_id: uuidv4(),
      user_id: userId,
      questions,
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.session_id,
        questions: session.questions,
        startedAt: session.started_at,
      },
    });
  } catch (error: any) {
    return next(error);
  }
};

/**
 * GET /api/interview/session/:sessionId
 * Get interview session details
 */
export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewRepository.findBySessionId(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    return next(error);
  }
};

/**
 * POST /api/interview/session/:sessionId/answer
 * Submit an answer for a session question
 */
export const submitAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;
    const { questionId, transcript } = req.body;

    if (!questionId || !transcript) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and transcript are required',
      });
    }

    // Find session
    const session = await InterviewRepository.findBySessionId(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Check if session is already completed
    if (session.completed_at) {
      return res.status(400).json({
        success: false,
        message: 'Session is already completed',
      });
    }

    // Find the question
    const question = session.questions.find((q) => q.id === questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in this session',
      });
    }

    // Check if already answered
    const existingResponse = session.responses.find(
      (r) => r.questionId === questionId
    );

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: 'This question has already been answered',
      });
    }

    // Evaluate the answer
    const evaluation = await geminiService.evaluateAnswer(
      question.text,
      transcript
    );

    // Add response to session
    const response = {
      questionId: question.id,
      question: question.text,
      transcript,
      evaluation,
      timestamp: new Date(),
    };

    const updatedSession = await InterviewRepository.addResponse(sessionId, response);

    // Check if session is complete
    if (InterviewRepository.isComplete(updatedSession)) {
      // Generate summary
      const responsesForSummary = updatedSession.responses.map((r) => ({
        question: r.question,
        score: r.evaluation.score,
        evaluation: r.evaluation,
      }));

      const summary = await geminiService.generateSessionSummary(responsesForSummary);
      await InterviewRepository.complete(sessionId, summary);
    }

    res.json({
      success: true,
      data: {
        response,
        sessionComplete: InterviewRepository.isComplete(updatedSession),
        overallScore: updatedSession.overall_score,
      },
    });
  } catch (error: any) {
    return next(error);
  }
};

/**
 * POST /api/interview/session/:sessionId/complete
 * Manually complete a session and generate summary
 */
export const completeSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewRepository.findBySessionId(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    if (session.completed_at) {
      return res.status(400).json({
        success: false,
        message: 'Session is already completed',
      });
    }

    if (session.responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete session without any responses',
      });
    }

    // Generate summary
    const responsesForSummary = session.responses.map((r) => ({
      question: r.question,
      score: r.evaluation.score,
      evaluation: r.evaluation,
    }));

    const summary = await geminiService.generateSessionSummary(responsesForSummary);
    const completedSession = await InterviewRepository.complete(sessionId, summary);

    res.json({
      success: true,
      data: {
        sessionId: completedSession.session_id,
        overallScore: completedSession.overall_score,
        summary: completedSession.summary,
        totalQuestions: completedSession.questions.length,
        answeredQuestions: completedSession.responses.length,
        completedAt: completedSession.completed_at,
      },
    });
  } catch (error: any) {
    return next(error);
  }
};

/**
 * GET /api/interview/sessions
 * Get all sessions for a user
 */
export const getUserSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const sessions = await InterviewRepository.findByUserId(userId as string);

    res.json({
      success: true,
      data: {
        sessions,
        count: sessions.length,
      },
    });
  } catch (error: any) {
    return next(error);
  }
};
