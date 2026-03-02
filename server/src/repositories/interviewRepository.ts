/**
 * Interview Session Repository - Supabase
 */

import { getSupabaseClient } from '../config/database';
import { InterviewResponse, Question } from '../types/interview';

export interface InterviewSession {
  id: string;
  session_id: string;
  user_id?: string;
  questions: Question[];
  responses: InterviewResponse[];
  overall_score: number;
  summary: string;
  started_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class InterviewRepository {
  /**
   * Create a new interview session
   */
  static async create(data: {
    session_id: string;
    user_id?: string;
    questions: Question[];
  }): Promise<InterviewSession> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    const { data: session, error } = await supabase
      .from('interview_sessions')
      .insert({
        session_id: data.session_id,
        user_id: data.user_id,
        questions: data.questions,
        responses: [],
        overall_score: 0,
        summary: '',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create interview session: ${error.message}`);
    }

    return session as InterviewSession;
  }

  /**
   * Find session by session_id
   */
  static async findBySessionId(sessionId: string): Promise<InterviewSession | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to find session: ${error.message}`);
    }

    return data as InterviewSession;
  }

  /**
   * Find active session (not completed) by session_id
   */
  static async findActiveSession(sessionId: string): Promise<InterviewSession | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .is('completed_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to find active session: ${error.message}`);
    }

    return data as InterviewSession;
  }

  /**
   * Find all sessions for a user
   */
  static async findByUserId(userId: string): Promise<InterviewSession[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find user sessions: ${error.message}`);
    }

    return (data as InterviewSession[]) || [];
  }

  /**
   * Add a response to a session and recalculate overall score
   */
  static async addResponse(
    sessionId: string,
    response: InterviewResponse
  ): Promise<InterviewSession> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    // Get current session
    const session = await this.findBySessionId(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add new response
    const updatedResponses = [...session.responses, response];

    // Recalculate overall score
    const overallScore =
      updatedResponses.reduce((sum, r) => sum + r.evaluation.score, 0) / updatedResponses.length;

    // Update session
    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        responses: updatedResponses,
        overall_score: overallScore,
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add response: ${error.message}`);
    }

    return data as InterviewSession;
  }

  /**
   * Complete a session with summary
   */
  static async complete(sessionId: string, summary: string): Promise<InterviewSession> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase
      .from('interview_sessions')
      .update({
        summary,
        completed_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to complete session: ${error.message}`);
    }

    return data as InterviewSession;
  }

  /**
   * Check if session is complete (all questions answered)
   */
  static isComplete(session: InterviewSession): boolean {
    return session.responses.length === session.questions.length;
  }

  /**
   * Delete a session (for cleanup)
   */
  static async delete(sessionId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    const { error } = await supabase
      .from('interview_sessions')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  }
}

export default InterviewRepository;
