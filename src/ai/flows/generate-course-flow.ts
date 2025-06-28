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

const getFallbackCourse = (): GenerateCourseOutput => ({
  title: "Curso Básico de Atendimento",
  description: "Um curso de emergência sobre como atender bem os clientes e conhecer os produtos. A IA falhou em gerar o conteúdo, mas você ainda pode aprender!",
  points: 100,
  modules: [
    {
      title: "Módulo 1: A Primeira Impressão",
      content: "Aprenda a importância de um bom dia, um sorriso e de se colocar à disposição. A primeira impressão é a que fica."
    },
    {
      title: "Módulo 2: Escuta Ativa",
      content: "Mais importante do que falar, é ouvir. Entenda a necessidade do cliente para oferecer a solução certa."
    }
  ],
  quiz: {
    title: "Quiz de Atendimento",
    questions: [
      {
        questionText: "Qual é o primeiro passo para um bom atendimento?",
        options: ["Oferecer o produto mais caro", "Sorrir e cumprimentar", "Perguntar o que o cliente quer", "Falar das promoções"],
        correctAnswerIndex: 1,
        explanation: "Um sorriso e um cumprimento criam um ambiente acolhedor e abrem portas para a venda."
      }
    ]
  }
});

const generateCourseFlow = ai.defineFlow(
  {
    name: 'generateCourseFlow',
    inputSchema: GenerateCourseInputSchema,
    outputSchema: GenerateCourseOutputSchema,
  },
  async (input) => {
    try {
      const response = await prompt(input);

      if (response.output) {
         if (response.output.modules.length === 0 || response.output.quiz.questions.length === 0) {
          console.warn("⚠️ IA retornou um curso válido mas sem conteúdo. Usando fallback.");
          return getFallbackCourse();
        }
        return response.output;
      }
      
      const rawText = response.text;
      if (!rawText) {
        console.warn("⚠️ IA retornou uma resposta vazia. Usando fallback.");
        return getFallbackCourse();
      }
      
      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);

      if (!match) {
        throw new Error('AI response did not contain valid JSON.');
      }
      
      const jsonString = match[1] || match[2];
      const parsed = JSON.parse(jsonString);

      const validated = GenerateCourseOutputSchema.parse(parsed);

      if (validated.modules.length === 0 || validated.quiz.questions.length === 0) {
        console.warn("⚠️ IA retornou um curso válido mas sem conteúdo (após parse). Usando fallback.");
        return getFallbackCourse();
      }

      return validated;

    } catch (error) {
      console.error('❌ Erro no fluxo de geração de curso:', error);
      console.warn("⚠️ Usando fallback local por falha na IA.");
      return getFallbackCourse();
    }
  }
);
