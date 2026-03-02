/**
 * Gemini AI Service
 * Handles question generation and answer evaluation using Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, EvaluationResult } from '../types/interview';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  private initialize() {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error(
          'GEMINI_API_KEY is not configured. Please set it in your .env file.\n' +
          'Get your API key from: https://makersuite.google.com/app/apikey'
        );
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  /**
   * Generate visa interview questions using Gemini AI
   * @param count Number of questions to generate
   * @param category Question category
   * @returns Array of generated questions
   */
  async generateQuestions(
    count: number = 5,
    category: string = 'general'
  ): Promise<Question[]> {
    this.initialize();
    try {
      const prompt = `You are a visa interview expert. Generate exactly ${count} realistic visa interview questions for the category: ${category}.

For each question, provide:
- A clear, professional interview question
- Category (general, work, study, travel, or family)
- Difficulty level (easy, medium, or hard)

Return ONLY a valid JSON array with this exact structure:
[
  {
    "text": "question text here",
    "category": "category_name",
    "difficulty": "difficulty_level"
  }
]

Do not include any markdown formatting, code blocks, or additional text. Return ONLY the JSON array.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response - remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const questionsData = JSON.parse(cleanedText);

      // Map to Question interface with generated IDs
      return questionsData.map((q: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        text: q.text,
        category: q.category || category,
        difficulty: q.difficulty || 'medium',
      }));
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  /**
   * Evaluate user's answer using Gemini AI acting as a visa officer
   * @param question The interview question
   * @param transcript User's answer transcript
   * @returns Detailed evaluation result
   */
  async evaluateAnswer(
    question: string,
    transcript: string
  ): Promise<EvaluationResult> {
    this.initialize();
    try {
      const prompt = `You are an experienced visa officer evaluating an interview answer.

Question: "${question}"
Candidate's Answer: "${transcript}"

Evaluate this answer and provide STRICT JSON output with NO additional text, markdown, or formatting.

Your evaluation must include:
1. Score (0-10 based on relevance, clarity, confidence, and completeness)
2. Strengths (2-4 specific positive points)
3. Weaknesses (2-4 areas for improvement)
4. Grammar issues (if any, be specific)
5. An improved version of the answer
6. Overall confidence level (low/medium/high)

Return ONLY this JSON structure:
{
  "score": <number 0-10>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "grammarIssues": ["issue 1", "issue 2"],
  "improvedAnswer": "improved version of the answer",
  "confidenceLevel": "low|medium|high"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up response - remove any markdown formatting
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const evaluation = JSON.parse(cleanedText);

      // Validate the response structure
      if (
        typeof evaluation.score !== 'number' ||
        !Array.isArray(evaluation.strengths) ||
        !Array.isArray(evaluation.weaknesses) ||
        !Array.isArray(evaluation.grammarIssues) ||
        typeof evaluation.improvedAnswer !== 'string' ||
        !['low', 'medium', 'high'].includes(evaluation.confidenceLevel)
      ) {
        throw new Error('Invalid evaluation response format');
      }

      return evaluation as EvaluationResult;
    } catch (error) {
      console.error('Error evaluating answer with Gemini:', error);
      throw new Error('Failed to evaluate answer. Please try again.');
    }
  }

  /**
   * Generate overall interview session summary
   * @param responses Array of interview responses
   * @returns Summary text
   */
  async generateSessionSummary(
    responses: Array<{ question: string; score: number; evaluation: EvaluationResult }>
  ): Promise<string> {
    this.initialize();
    try {
      const averageScore =
        responses.reduce((sum, r) => sum + r.score, 0) / responses.length;

      const prompt = `You are a visa interview expert providing feedback on a complete interview session.

Average Score: ${averageScore.toFixed(1)}/10
Total Questions: ${responses.length}

Performance per question:
${responses.map((r, i) => `
Question ${i + 1}: "${r.question}"
Score: ${r.score}/10
Confidence: ${r.evaluation.confidenceLevel}
`).join('\n')}

Provide a comprehensive 2-3 paragraph summary that includes:
1. Overall performance assessment
2. Key strengths across all answers
3. Main areas for improvement
4. Specific recommendations for visa interview success

Write in a professional, encouraging tone. Focus on actionable feedback.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating session summary:', error);
      return 'Session completed successfully. Review individual question feedback for detailed insights.';
    }
  }
}

// Export singleton instance
export default new GeminiService();
