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
  salesValue: number;
  ticketAverage: number;
  pa: number;
  points: number;
  extraPoints: number;
  hasCompletedQuiz?: boolean;
  lastCourseCompletionDate?: string; // YYYY-MM-DD
};

export type GoalLevels = {
  metinha: number;
  meta: number;
  metona: number;
  lendaria: number;
};

export type Goals = {
  salesValue: GoalLevels;
  ticketAverage: GoalLevels;
  pa: GoalLevels;
  points: GoalLevels;
};

export type Mission = {
  id: string;
  name: string;
  description: string;
  points: number;
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


// Generate Quiz
export const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).min(4).max(4).describe('A list of four possible answers for the question.'),
  correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

export const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  numberOfQuestions: z.number().min(1).max(10).describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

export const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('The title of the quiz.'),
  questions: z.array(QuizQuestionSchema),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


// Generate Course
export const CourseModuleSchema = z.object({
  title: z.string().describe("The title of the course module."),
  content: z.string().describe("The content of the course module, in Markdown format."),
});

export const QuizSchema = z.object({
  title: z.string().describe('The title of the quiz.'),
  questions: z.array(QuizQuestionSchema),
});

export const GenerateCourseInputSchema = z.object({
  topic: z.string().describe('The topic for the course.'),
});
export type GenerateCourseInput = z.infer<typeof GenerateCourseInputSchema>;

export const GenerateCourseOutputSchema = z.object({
  title: z.string().describe('The title of the generated course.'),
  description: z.string().describe('A brief description of the course.'),
  points: z.number().describe('The suggested number of points for completing the course (between 100 and 500).'),
  modules: z.array(CourseModuleSchema).describe('An array of course modules.'),
  quiz: QuizSchema.describe('A final quiz to test the knowledge from the course.'),
});
export type GenerateCourseOutput = z.infer<typeof GenerateCourseOutputSchema>;


// Component-specific types that use AI schemas
export type Course = GenerateCourseOutput & {
  id: string;
};

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
