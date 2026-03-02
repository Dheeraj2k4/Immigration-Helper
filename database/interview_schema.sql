-- ============================================
-- Interview Practice Tables - Supabase Schema
-- ============================================

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    questions JSONB NOT NULL,
    responses JSONB DEFAULT '[]'::jsonb,
    overall_score DECIMAL(4,2) DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 10),
    summary TEXT DEFAULT '',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_session_id ON interview_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_created ON interview_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_completed_at ON interview_sessions(completed_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON interview_sessions;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE interview_sessions IS 'Stores interview practice sessions with questions and user responses';
COMMENT ON COLUMN interview_sessions.session_id IS 'Unique session identifier (UUID string)';
COMMENT ON COLUMN interview_sessions.user_id IS 'User identifier (optional for anonymous sessions)';
COMMENT ON COLUMN interview_sessions.questions IS 'Array of interview questions in JSON format';
COMMENT ON COLUMN interview_sessions.responses IS 'Array of user responses with evaluations in JSON format';
COMMENT ON COLUMN interview_sessions.overall_score IS 'Average score across all responses (0-10)';
COMMENT ON COLUMN interview_sessions.summary IS 'AI-generated overall session feedback';
COMMENT ON COLUMN interview_sessions.started_at IS 'When the interview session started';
COMMENT ON COLUMN interview_sessions.completed_at IS 'When the interview session was completed (null if in progress)';


