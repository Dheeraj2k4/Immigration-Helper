/**
 * MongoDB Model for Interview Sessions
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { InterviewResponse, Question } from '../types/interview';

interface IInterviewSession extends Document {
  sessionId: string;
  userId?: string;
  questions: Question[];
  responses: InterviewResponse[];
  overallScore: number;
  summary: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance Methods
  addResponse(response: InterviewResponse): Promise<this>;
  complete(summary: string): Promise<this>;
  isComplete(): boolean;
}

interface IInterviewSessionModel extends Model<IInterviewSession> {
  // Static methods
  findByUserId(userId: string): Promise<IInterviewSession[]>;
  findActiveSession(sessionId: string): Promise<IInterviewSession | null>;
}

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  category: {
    type: String,
    enum: ['general', 'work', 'study', 'travel', 'family'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
});

const EvaluationSchema = new Schema({
  score: { type: Number, required: true, min: 0, max: 10 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  grammarIssues: [{ type: String }],
  improvedAnswer: { type: String, required: true },
  confidenceLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
});

const InterviewResponseSchema = new Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  transcript: { type: String, required: true },
  evaluation: { type: EvaluationSchema, required: true },
  timestamp: { type: Date, default: Date.now },
});

const InterviewSessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: {
        validator: function (questions: Question[]) {
          return questions.length > 0;
        },
        message: 'At least one question is required',
      },
    },
    responses: {
      type: [InterviewResponseSchema],
      default: [],
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    summary: {
      type: String,
      default: '',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
InterviewSessionSchema.index({ userId: 1, createdAt: -1 });
InterviewSessionSchema.index({ completedAt: 1 });

// Methods
InterviewSessionSchema.methods.addResponse = function (response: InterviewResponse) {
  this.responses.push(response);
  
  // Recalculate overall score
  if (this.responses.length > 0) {
    this.overallScore =
      this.responses.reduce((sum: number, r: InterviewResponse) => sum + r.evaluation.score, 0) /
      this.responses.length;
  }
  
  return this.save();
};

InterviewSessionSchema.methods.complete = function (summary: string) {
  this.completedAt = new Date();
  this.summary = summary;
  return this.save();
};

InterviewSessionSchema.methods.isComplete = function (): boolean {
  return this.responses.length === this.questions.length;
};

// Static methods
InterviewSessionSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

InterviewSessionSchema.statics.findActiveSession = function (sessionId: string) {
  return this.findOne({ sessionId, completedAt: { $exists: false } });
};

export default mongoose.model<IInterviewSession, IInterviewSessionModel>('InterviewSession', InterviewSessionSchema);
