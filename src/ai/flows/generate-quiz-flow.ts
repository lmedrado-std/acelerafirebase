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
Você é um coach de vendas rigoroso e criativo, especializado em treinar equipes de lojas de calçados para a excelência. Crie um QUIZ desafiador sobre o tema "{{topic}}" com exatamente {{numberOfQuestions}} perguntas.

O nível de dificuldade deve ser "{{difficulty}}". Siga estas diretrizes para a complexidade das perguntas:
- **Fácil**: Perguntas sobre conceitos básicos, definições de materiais ou termos comuns.
- **Médio**: Perguntas situacionais sobre atendimento, melhores práticas e como lidar com clientes típicos.
- **Difícil**: Perguntas complexas sobre como contornar objeções, cenários de crise, e cálculo de KPIs (Ticket Médio, PA).

Regras RÍGIDAS:
1.  Gere perguntas **únicas e variadas**. Evite repetir temas ou estruturas de perguntas.
2.  A resposta deve ser **SOMENTE o JSON**, sem nenhum texto, comentário ou \`\`\`json\`\`\` antes ou depois.
3.  O formato do JSON deve ser exatamente:
{
  "title": "Quiz Avançado de Vendas - Nível {{difficulty}}",
  "questions": [
    {
      "questionText": "Um cliente diz: 'Achei caro'. Qual a MELHOR resposta para contornar essa objeção sem dar desconto?",
      "options": [
        "Concordar e mostrar um mais barato",
        "Explicar que o preço é justo",
        "Perguntar 'Caro em relação a quê?' e focar no valor e benefícios do produto",
        "Dizer que a qualidade tem seu preço"
      ],
      "correctAnswerIndex": 2,
      "explanation": "Focar no valor (durabilidade, conforto, tecnologia) justifica o preço e desvia o foco do custo."
    }
  ]
}
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
