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
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `
Você é especialista em treinamentos para vendedores de lojas de calçados. Crie um QUIZ com base no tema "{{topic}}".

💡 Regras obrigatórias:
- Gere exatamente {{numberOfQuestions}} perguntas.
- Cada pergunta deve ter:
  - Um enunciado claro.
  - 4 alternativas diferentes.
  - O índice da resposta correta (de 0 a 3).
  - Uma explicação curta sobre a resposta correta.

🧪 Exemplo de estrutura esperada (em JSON):
{
  "title": "Título do Quiz",
  "questions": [
    {
      "questionText": "Qual material é mais indicado para tênis de corrida?",
      "options": ["Couro", "Lona", "Mesh", "Camurça"],
      "correctAnswerIndex": 2,
      "explanation": "O mesh é leve, flexível e respirável — ideal para tênis de corrida."
    }
  ]
}

🛑 IMPORTANTE:
- Responda SOMENTE com o JSON.
- NÃO use blocos \`\`\`, comentários ou texto adicional.
- A resposta **deve ser 100% compatível** com o exemplo acima.
`,
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
    console.log("🔍 AI raw response:", response);

    // 1. Tenta usar a resposta estruturada (ideal)
    if (response.output) {
      return response.output;
    }

    // 2. Tenta extrair JSON mesmo se vier com código markdown ou misturado
    const rawText = response.text;
    if (!rawText) {
      throw new Error('A IA retornou uma resposta vazia.');
    }

    try {
      // Regex para encontrar JSON mesmo com ```json ... ``` ou sem
      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);

      if (!match) {
        console.error('❌ Não foi possível identificar JSON na resposta:', rawText);
        throw new Error('A IA não retornou dados em formato válido.');
      }

      const jsonString = match[1] || match[2];
      const parsed = JSON.parse(jsonString);

      // 3. Valida com o schema
      return GenerateQuizOutputSchema.parse(parsed);

    } catch (error) {
      console.error('❌ Erro ao analisar ou validar o JSON gerado pela IA:', error);
      console.error('📄 Resposta bruta da IA:', rawText);
      throw new Error('Erro ao interpretar a resposta da IA. Tente novamente ou revise o prompt.');
    }
  }
);
