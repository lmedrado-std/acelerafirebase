'use server';

import { ai } from '@/ai/genkit';
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
Você é especialista em treinamentos para vendedores de lojas de calçados. Crie um quiz sobre "{{topic}}".

Regras:
- Exatamente {{numberOfQuestions}} perguntas.
- Cada pergunta com:
  - Enunciado
  - 4 opções
  - Índice da correta (0-3)
  - Explicação da resposta correta

Responda somente com o JSON no formato:
{
  "title": "Título",
  "questions": [
    {
      "questionText": "Pergunta?",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 1,
      "explanation": "Motivo"
    }
  ]
}
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    try {
      const response = await prompt(input);
      console.log("📤 Resposta da IA:", response);

      if (response.output) {
        return response.output;
      }

      const rawText = response.text || '';
      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);
      const jsonString = match?.[1] || match?.[2];

      if (!jsonString) throw new Error('JSON inválido ou ausente');

      const parsed = JSON.parse(jsonString);
      return GenerateQuizOutputSchema.parse(parsed);
    } catch (error) {
      console.warn('⚠️ Erro ao gerar quiz com a IA:', error);
      console.warn('📄 Retornando fallback local');

      // Fallback local garantido
      return {
        title: "Quiz de Técnicas de Venda - Básico",
        questions: [
          {
            questionText: "Qual a melhor forma de abordar um cliente?",
            options: [
              "Esperar que ele fale primeiro",
              "Cumprimentar com simpatia e oferecer ajuda",
              "Segui-lo silenciosamente",
              "Falar das promoções imediatamente"
            ],
            correctAnswerIndex: 1,
            explanation: "Uma abordagem simpática cria conexão e confiança."
          },
          {
            questionText: "O que caracteriza uma boa venda consultiva?",
            options: [
              "Oferecer o item mais caro",
              "Entender a necessidade do cliente",
              "Focar apenas na comissão",
              "Falar sobre todos os produtos da loja"
            ],
            correctAnswerIndex: 1,
            explanation: "Na venda consultiva, você ajuda o cliente com a melhor solução."
          }
        ]
      };
    }
  }
);
