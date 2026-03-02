/**
 * Question Service
 * Manages predefined interview questions and integrates with AI generation
 */

import { Question } from '../types/interview';
import geminiService from './geminiService';

class QuestionService {
  // Predefined visa interview questions database
  private readonly predefinedQuestions: Question[] = [
    // General Questions
    {
      id: 'q1',
      text: 'Can you tell me about yourself?',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: 'q2',
      text: 'Why do you want to visit the United States?',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: 'q3',
      text: 'How long do you plan to stay?',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: 'q4',
      text: 'Have you ever been to the United States before?',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: 'q5',
      text: 'Do you have family or friends in the United States?',
      category: 'family',
      difficulty: 'easy',
    },

    // Work-related Questions
    {
      id: 'q6',
      text: 'What do you do for a living?',
      category: 'work',
      difficulty: 'easy',
    },
    {
      id: 'q7',
      text: 'Who is your employer and what does your company do?',
      category: 'work',
      difficulty: 'medium',
    },
    {
      id: 'q8',
      text: 'How long have you been working for your current employer?',
      category: 'work',
      difficulty: 'easy',
    },
    {
      id: 'q9',
      text: 'What is your annual salary?',
      category: 'work',
      difficulty: 'medium',
    },
    {
      id: 'q10',
      text: 'Why is your employer sending you to the United States?',
      category: 'work',
      difficulty: 'medium',
    },

    // Study-related Questions
    {
      id: 'q11',
      text: 'Which university are you planning to attend?',
      category: 'study',
      difficulty: 'easy',
    },
    {
      id: 'q12',
      text: 'What will you study and why did you choose this program?',
      category: 'study',
      difficulty: 'medium',
    },
    {
      id: 'q13',
      text: 'How will you finance your education?',
      category: 'study',
      difficulty: 'hard',
    },
    {
      id: 'q14',
      text: 'What do you plan to do after completing your studies?',
      category: 'study',
      difficulty: 'medium',
    },
    {
      id: 'q15',
      text: 'Why did you choose to study in the United States instead of your home country?',
      category: 'study',
      difficulty: 'hard',
    },

    // Travel Questions
    {
      id: 'q16',
      text: 'What places do you plan to visit in the United States?',
      category: 'travel',
      difficulty: 'easy',
    },
    {
      id: 'q17',
      text: 'Have you made hotel reservations?',
      category: 'travel',
      difficulty: 'easy',
    },
    {
      id: 'q18',
      text: 'Who will be traveling with you?',
      category: 'travel',
      difficulty: 'easy',
    },
    {
      id: 'q19',
      text: 'How will you cover your travel expenses?',
      category: 'travel',
      difficulty: 'medium',
    },
    {
      id: 'q20',
      text: 'Do you have a detailed itinerary for your trip?',
      category: 'travel',
      difficulty: 'medium',
    },

    // Family Questions
    {
      id: 'q21',
      text: 'Are you married? Do you have children?',
      category: 'family',
      difficulty: 'easy',
    },
    {
      id: 'q22',
      text: 'What does your spouse do for a living?',
      category: 'family',
      difficulty: 'easy',
    },
    {
      id: 'q23',
      text: 'Will your family be accompanying you?',
      category: 'family',
      difficulty: 'easy',
    },
    {
      id: 'q24',
      text: 'Do you own property in your home country?',
      category: 'family',
      difficulty: 'medium',
    },
    {
      id: 'q25',
      text: 'What ties do you have to your home country that will ensure your return?',
      category: 'family',
      difficulty: 'hard',
    },
  ];

  /**
   * Get predefined questions by category and difficulty
   * @param category Optional category filter
   * @param difficulty Optional difficulty filter
   * @returns Array of matching questions
   */
  getPredefinedQuestions(
    category?: string,
    difficulty?: string
  ): Question[] {
    let questions = [...this.predefinedQuestions];

    if (category) {
      questions = questions.filter((q) => q.category === category);
    }

    if (difficulty) {
      questions = questions.filter((q) => q.difficulty === difficulty);
    }

    return questions;
  }

  /**
   * Get random questions from predefined list
   * @param count Number of questions to return
   * @param category Optional category filter
   * @param difficulty Optional difficulty filter
   * @returns Array of random questions
   */
  getRandomQuestions(
    count: number = 5,
    category?: string,
    difficulty?: string
  ): Question[] {
    const availableQuestions = this.getPredefinedQuestions(category, difficulty);

    if (availableQuestions.length === 0) {
      throw new Error('No questions available matching the criteria');
    }

    // Shuffle and return requested count
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Get questions - either predefined or AI-generated
   * @param count Number of questions
   * @param useAI Whether to use AI generation
   * @param category Optional category
   * @param difficulty Optional difficulty
   * @returns Array of questions
   */
  async getQuestions(
    count: number = 5,
    useAI: boolean = false,
    category?: string,
    difficulty?: string
  ): Promise<Question[]> {
    if (useAI) {
      // Generate questions using Gemini AI
      return await geminiService.generateQuestions(count, category || 'general');
    } else {
      // Return predefined questions
      return this.getRandomQuestions(count, category, difficulty);
    }
  }

  /**
   * Get a specific question by ID
   * @param id Question ID
   * @returns Question or undefined
   */
  getQuestionById(id: string): Question | undefined {
    return this.predefinedQuestions.find((q) => q.id === id);
  }

  /**
   * Get all available categories
   * @returns Array of category names
   */
  getCategories(): string[] {
    return ['general', 'work', 'study', 'travel', 'family'];
  }

  /**
   * Get all difficulty levels
   * @returns Array of difficulty levels
   */
  getDifficultyLevels(): string[] {
    return ['easy', 'medium', 'hard'];
  }
}

// Export singleton instance
export default new QuestionService();
