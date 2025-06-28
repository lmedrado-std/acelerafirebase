'use server';
/**
 * @fileOverview A flow for generating quizzes.
 *
 * - generateQuiz - A function that creates a quiz on a given topic.
 */

import {ai} from '@/ai/genkit';
import { 
  GenerateQuizInputSchema,
  GenerateQuizOutputSchema,
  type GenerateQuizInput,
  type GenerateQuizOutput
} from '@/lib/types';


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert in creating training materials for retail employees.
Generate a quiz with a relevant title and {{numberOfQuestions}} multiple-choice questions about "{{topic}}".
The quiz should be challenging but fair, designed for shoe store salespeople.
For each question, provide exactly four distinct options, identify the correct answer, and give a short explanation.

You must respond with a valid JSON object that strictly adheres to the output schema, containing a "title" string and a "questions" array.`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error(
        'A IA não conseguiu gerar o conteúdo do quiz. Tente novamente.'
      );
    }
    return output;
  }
);
