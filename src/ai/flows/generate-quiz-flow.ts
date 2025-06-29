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
Você é especialista em treinamentos para vendedores de lojas de calçados. Crie um QUIZ de nível de dificuldade "{{difficulty}}" sobre o tema "{{topic}}".

💡 Regras obrigatórias:
- Gere exatamente {{numberOfQuestions}} perguntas.
- As perguntas devem variar em complexidade de acordo com a dificuldade solicitada.
- Cada pergunta deve ter:
  - Um enunciado claro.
  - 4 alternativas diferentes.
  - O índice da resposta correta (de 0 a 3).
  - Uma explicação curta sobre a resposta correta.

🧪 Exemplo de estrutura esperada (em JSON):
{
  "title": "Quiz sobre {{topic}} - Nível {{difficulty}}",
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
    try {
      const response = await prompt(input);
      console.log("📤 Resposta da IA:", response);

      if (response.output) {
        if (response.output.questions.length === 0) {
           throw new Error("AI returned a valid structure but with no questions.");
        }
        return response.output;
      }

      const rawText = response.text || '';
      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);
      const jsonString = match?.[1] || match?.[2];

      if (!jsonString) throw new Error('JSON inválido ou ausente');

      const parsed = JSON.parse(jsonString);
      const validated = GenerateQuizOutputSchema.parse(parsed);
      
      if (validated.questions.length === 0) {
        throw new Error("AI returned a valid structure but with no questions after parsing.");
      }
      return validated;

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
          },
          {
            questionText: "Para um cliente que busca conforto, qual tipo de palmilha você recomenda?",
            options: ["Plana e dura", "Com espuma de memória (Memory Foam)", "De borracha simples", "Nenhuma"],
            correctAnswerIndex: 1,
            explanation: "A espuma de memória se molda ao pé, oferecendo máximo conforto e absorção de impacto."
          },
          {
            questionText: "Um cliente reclama que o sapato de couro está apertado. O que você diz?",
            options: [
              "Que ele vai lacear com o tempo",
              "Que ele pegou o número errado",
              "Oferece um produto para lacear o couro e explica o processo",
              "Sugere um modelo sintético"
            ],
            correctAnswerIndex: 2,
            explanation: "Oferecer uma solução proativa demonstra conhecimento e cuidado com o cliente, agregando valor."
          },
          {
            questionText: "O que é 'PA' em vendas de varejo?",
            options: [
              "Produto por Atendimento",
              "Pagamento Aprovado",
              "Preço de Atacado",
              "Promoção Ativa"
            ],
            correctAnswerIndex: 0,
            explanation: "PA (Peças por Atendimento) é um indicador que mede a quantidade de produtos vendidos por cliente atendido."
          }
        ]
      };
    }
  }
);
