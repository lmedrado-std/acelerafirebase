'use server';
/**
 * @fileOverview A flow for generating training courses.
 *
 * - generateCourse - A function that creates a course on a given topic.
 */

import {ai} from '@/ai/genkit';
import { 
  GenerateCourseInputSchema,
  GenerateCourseOutputSchema,
  type GenerateCourseInput,
  type GenerateCourseOutput,
} from '@/lib/types';

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
    if (!output) {
      throw new Error(
        'A IA não conseguiu gerar o conteúdo do curso. Tente novamente.'
      );
    }
    return output;
  }
);
