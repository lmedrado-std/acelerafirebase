import {z} from 'zod';

export type SalesEntry = {
  id: string;
  date: Date;
  salesValue: number;
  ticketAverage: number;
  productsPerService: number;
};

export type Seller = {
  id: string;
  name: string;
  nickname?: string;
  email?: string;
  password?: string;
  salesValue: number;
  ticketAverage: number;
  pa: number;
  points: number;
  extraPoints: number;
  hasCompletedQuiz?: boolean;
  lastCourseCompletionDate?: string; // YYYY-MM-DD
};

export type Admin = {
  nickname: string;
  email?: string;
  password: string;
};

export type GoalLevel = {
  threshold: number;
  prize: number;
};

export type GoalLevels = {
  metinha: GoalLevel;
  meta: GoalLevel;
  metona: GoalLevel;
  lendaria: GoalLevel;
};

// Add a specific type for SalesValue goals to include the performance bonus
export type SalesValueGoals = GoalLevels & {
  performanceBonus?: {
    per: number;
    prize: number;
  };
};

export type Goals = {
  salesValue: SalesValueGoals; // Use the new type
  ticketAverage: GoalLevels;
  pa: GoalLevels;
  points: GoalLevels;
};


export type Mission = {
  id: string;
  name: string;
  description: string;
  rewardValue: number;
  rewardType: 'points' | 'cash';
  startDate: Date;
  endDate: Date;
};

// AI Flow Schemas

// Analyze Sales Trends
export const AnalyzeSalesTrendsInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      `Sales data in JSON format containing sales value, ticket average, and products per service.
      Example: [{
        "date": "2024-01-01",
        "salesValue": 1000,
        "ticketAverage": 100,
        "productsPerService": 2
      }]`
    ),
  timeFrame: z.enum(['weekly', 'monthly']).describe('Time frame for analysis.'),
});
export type AnalyzeSalesTrendsInput = z.infer<typeof AnalyzeSalesTrendsInputSchema>;

export const AnalyzeSalesTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of the sales trends and anomalies.'),
  topProducts: z.string().describe('List of top-performing products based on the sales data.'),
  insights: z.string().describe('Key insights into what is driving sales performance.'),
});
export type AnalyzeSalesTrendsOutput = z.infer<typeof AnalyzeSalesTrendsOutputSchema>;


// Generate Quiz (For Quiz Page)
export const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).min(4).max(4).describe('A list of four possible answers for the question.'),
  correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

export const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  numberOfQuestions: z.number().min(1).max(10).describe('The number of questions to generate.'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']).describe('The difficulty level for the quiz.'),
  seed: z.string().optional().describe('An optional seed for controlling randomness and uniqueness.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

export const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('The title of the quiz.'),
  questions: z.array(QuizQuestionSchema),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


// Generate Course (For Academia Page)
export const GenerateCourseInputSchema = z.object({
  topic: z.string(),
  seed: z.string().optional().describe('An optional seed for controlling randomness and uniqueness.'),
});
export type GenerateCourseInput = z.infer<typeof GenerateCourseInputSchema>;

const CourseQuizQuestionSchema = z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswerIndex: z.number(),
    explanation: z.string(),
});

export const GenerateCourseOutputSchema = z.object({
  title: z.string(),
  content: z.string(),
  quiz: z.array(CourseQuizQuestionSchema),
});
export type GenerateCourseOutput = z.infer<typeof GenerateCourseOutputSchema>;


// Component-specific types
export type Course = GenerateCourseOutput & {
  id: string;
  points: number; // Manually added in the component
};

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export type QuizResult = {
  score: number;
  total: number;
  date: string;
};
