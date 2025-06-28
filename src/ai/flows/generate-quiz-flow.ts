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

const getFallbackQuiz = (): GenerateQuizOutput => ({
  title: "Quiz de Vendas - Básico",
  questions: [
    {
      questionText: "Qual a melhor abordagem inicial com um cliente?",
      options: [
        "Esperar que ele pergunte",
        "Cumprimentar com simpatia e se colocar à disposição",
        "Falar imediatamente das promoções",
        "Segui-lo pela loja em silêncio"
      ],
      correctAnswerIndex: 1,
      explanation: "Abordagem empática gera confiança e abertura para a venda."
    },
    {
      questionText: "O que caracteriza um bom atendimento?",
      options: [
        "Vender o produto mais caro",
        "Atender rápido e sem perguntas",
        "Compreender as necessidades do cliente",
        "Falar bastante sobre os produtos"
      ],
      correctAnswerIndex: 2,
      explanation: "Ouvir o cliente e entender suas necessidades é essencial."
    },
    {
      questionText: "Qual destes é um exemplo de venda consultiva?",
      options: [
        "Empurrar qualquer produto para o cliente",
        "Entender o que ele busca e sugerir a melhor solução",
        "Oferecer apenas o que está na promoção",
        "Vender rápido para atender mais pessoas"
      ],
      correctAnswerIndex: 1,
      explanation: "A venda consultiva foca em resolver o problema do cliente."
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
