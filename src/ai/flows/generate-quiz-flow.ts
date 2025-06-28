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
  prompt: `You are an expert in creating training materials for retail employees. Your task is to generate a quiz about "{{topic}}" for shoe store salespeople.

The quiz must contain:
- A relevant title.
- Exactly {{numberOfQuestions}} multiple-choice questions.

For each question, provide:
- The question text.
- Exactly four distinct answer options.
- The index of the correct answer.
- A brief explanation for the correct answer.

The quiz should be challenging but fair.

You MUST respond with a valid JSON object that strictly adheres to the provided output schema. Do not include any text or formatting outside of the JSON object.`,
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
