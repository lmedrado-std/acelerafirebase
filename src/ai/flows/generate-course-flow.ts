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
  prompt: `You are an expert in creating training materials for retail employees, especially for shoe stores. Your task is to generate a complete training course about "{{topic}}".

The course must include the following components:
1.  **Title and Description**: A clear title for the course and a short, engaging description.
2.  **Points**: A suggested number of points for completing the course, ranging from 100 to 500.
3.  **Modules**: At least 3-4 content modules. Each module must have a title and its content in Markdown format. The content should be educational and practical for a shoe salesperson.
4.  **Final Quiz**: A quiz to test the material covered. The quiz must have its own title and contain exactly 5 multiple-choice questions. Each question must include four options, the correct answer, and an explanation.

You MUST respond with a valid JSON object that strictly adheres to the provided output schema. Ensure there is no extra text or formatting outside of the JSON structure.`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
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
