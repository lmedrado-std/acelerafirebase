'use server';
/**
 * @fileOverview A flow for generating training courses.
 *
 * - generateCourse - A function that creates a course on a given topic.
 * - GenerateCourseInput - The input type for the generateCourse function.
 * - GenerateCourseOutput - The return type for the generateCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).describe('A list of exactly four possible answers for the question.'),
  correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

const QuizSchema = z.object({
  title: z.string().describe('The title of the quiz.'),
  questions: z.array(QuestionSchema),
});

const ModuleSchema = z.object({
  title: z.string().describe("The title of the course module."),
  content: z.string().describe("The content of the course module, in Markdown format."),
});

const GenerateCourseInputSchema = z.object({
  topic: z.string().describe('The topic for the course.'),
});
export type GenerateCourseInput = z.infer<typeof GenerateCourseInputSchema>;

const GenerateCourseOutputSchema = z.object({
  title: z.string().describe('The title of the generated course.'),
  description: z.string().describe('A brief description of the course.'),
  points: z.number().describe('The suggested number of points for completing the course (between 100 and 500).'),
  modules: z.array(ModuleSchema).describe('An array of course modules.'),
  quiz: QuizSchema.describe('A final quiz to test the knowledge from the course.'),
});
export type GenerateCourseOutput = z.infer<typeof GenerateCourseOutputSchema>;

export async function generateCourse(input: GenerateCourseInput): Promise<GenerateCourseOutput> {
  return generateCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoursePrompt',
  input: {schema: GenerateCourseInputSchema},
  output: {schema: GenerateCourseOutputSchema},
  prompt: `You are an expert in creating training materials for retail employees, especially for shoe stores.
Generate a complete training course about "{{topic}}".

The course must include:
1. A clear title and a short description.
2. A suggested number of points for completion (between 100 and 500).
3. At least 3-4 content modules. Each module must have a title and content in Markdown format. The content should be educational and practical for a shoe salesperson.
4. A final quiz with 5 multiple-choice questions to test the course material. Each question must have exactly four options, a correct answer, and an explanation.

You must respond with a valid JSON object that strictly adheres to the output schema.`,
});

const generateCourseFlow = ai.defineFlow(
  {
    name: 'generateCourseFlow',
    inputSchema: GenerateCourseInputSchema,
    outputSchema: GenerateCourseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
