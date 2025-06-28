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

You MUST respond with a valid JSON object that strictly adheres to the provided output schema. Ensure there is no extra text, formatting, or code fences (like \`\`\`json) outside of the JSON structure.

Example of the expected JSON structure:
{
  "title": "Course Title Example",
  "description": "A brief description of the course.",
  "points": 250,
  "modules": [
    {
      "title": "Module 1: Introduction",
      "content": "This is the content for module 1 in Markdown."
    }
  ],
  "quiz": {
    "title": "Final Quiz Example",
    "questions": [
      {
        "questionText": "What is a key feature of our new shoe model?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswerIndex": 0,
        "explanation": "Explanation for the correct answer."
      }
    ]
  }
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

const generateCourseFlow = ai.defineFlow(
  {
    name: 'generateCourseFlow',
    inputSchema: GenerateCourseInputSchema,
    outputSchema: GenerateCourseOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);

    if (response.output) {
      return response.output;
    }
    
    const rawText = response.text;
    if (!rawText) {
      throw new Error('AI returned an empty response. Please try again.');
    }
    
    try {
      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);

      if (!match) {
        throw new Error('AI response did not contain valid JSON.');
      }
      
      const jsonString = match[1] || match[2];
      const parsed = JSON.parse(jsonString);

      return GenerateCourseOutputSchema.parse(parsed);

    } catch (error) {
      console.error('Failed to parse or validate AI output:', error);
      console.error('Raw AI response was:', rawText);
      throw new Error('AI returned data in an unexpected format. Please try again.');
    }
  }
);
