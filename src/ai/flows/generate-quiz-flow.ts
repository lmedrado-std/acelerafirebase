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
- The index of the correct answer (from 0 to 3).
- A brief explanation for the correct answer.

The quiz should be challenging but fair.

You MUST respond with a valid JSON object that strictly adheres to the provided output schema. Do not include any text, formatting, or code fences (like \`\`\`json) outside of the JSON object.

Example of the expected JSON structure:
{
  "title": "Quiz Title Example",
  "questions": [
    {
      "questionText": "What is the best material for running shoes?",
      "options": ["Leather", "Mesh", "Suede", "Canvas"],
      "correctAnswerIndex": 1,
      "explanation": "Mesh is lightweight, breathable, and flexible, making it ideal for running shoes."
    }
  ]
}`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
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
    const response = await prompt(input);
    
    // First, try the structured output. It's the most efficient.
    if (response.output) {
      return response.output;
    }
    
    // If structured output failed, try to manually parse the raw text.
    const rawText = response.text;
    if (!rawText) {
      throw new Error('AI returned an empty response. Please try again.');
    }

    try {
      // Clean up the text: find the JSON block, even if it's inside markdown fences
      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);
      
      if (!match) {
        throw new Error('AI response did not contain valid JSON.');
      }
      
      // Get the JSON part from the match. It can be in group 1 (markdown) or 2 (raw object)
      const jsonString = match[1] || match[2];
      const parsed = JSON.parse(jsonString);
      
      // Validate with Zod schema
      return GenerateQuizOutputSchema.parse(parsed);

    } catch (error) {
      console.error('Failed to parse or validate AI output:', error);
      console.error('Raw AI response was:', rawText);
      throw new Error('AI returned data in an unexpected format. Please try again.');
    }
  }
);
