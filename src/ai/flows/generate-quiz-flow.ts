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

const getFallbackQuiz = (): GenerateQuizOutput => ({
  title: "Quiz de Técnicas de Venda",
  questions: [
    {
      questionText: "Qual a melhor abordagem com um cliente em loja?",
      options: [
        "Ficar em silêncio até que ele fale",
        "Falar rapidamente sobre promoções",
        "Cumprimentar e se colocar à disposição",
        "Oferecer o produto mais caro primeiro"
      ],
      correctAnswerIndex: 2,
      explanation: "Abordar com simpatia e abertura gera confiança."
    },
    {
      questionText: "O que caracteriza uma venda consultiva?",
      options: [
        "Focar só no valor da venda",
        "Empurrar estoque parado",
        "Entender a real necessidade do cliente",
        "Vender o que dá mais comissão"
      ],
      correctAnswerIndex: 2,
      explanation: "Na venda consultiva, o foco é resolver o problema do cliente."
    },
     {
      questionText: "Qual destes é um exemplo de venda adicional (cross-sell)?",
      options: [
        "Sugerir um modelo mais caro",
        "Oferecer meias junto com o tênis",
        "Dar um grande desconto",
        "Vender apenas o que o cliente pediu"
      ],
      correctAnswerIndex: 1,
      explanation: "Oferecer produtos complementares (meias, produtos de limpeza) aumenta o valor da venda."
    }
  ]
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
      
      if (response.output) {
        if (response.output.questions.length === 0) {
          console.warn("⚠️ IA retornou um quiz válido mas sem perguntas. Usando fallback.");
          return getFallbackQuiz();
        }
        return response.output;
      }
      
      const rawText = response.text;
      if (!rawText) {
        console.warn("⚠️ IA retornou uma resposta vazia. Usando fallback local.");
        return getFallbackQuiz();
      }

      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);

      if (!match) {
        throw new Error('A IA não retornou dados em formato JSON válido.');
      }
      
      const jsonString = match[1] || match[2];
      const parsed = JSON.parse(jsonString);
      
      const validated = GenerateQuizOutputSchema.parse(parsed);

      if (validated.questions.length === 0) {
        console.warn("⚠️ IA retornou um quiz válido mas sem perguntas (após parse). Usando fallback.");
        return getFallbackQuiz();
      }
      
      return validated;

    } catch (error) {
      console.error('❌ Erro no fluxo de geração de quiz:', error);
      console.warn("⚠️ Usando fallback local por falha na IA.");
      return getFallbackQuiz();
    }
  }
);
