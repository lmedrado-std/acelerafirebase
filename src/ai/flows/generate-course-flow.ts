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

export async function generateCourse(
  input: GenerateCourseInput
): Promise<GenerateCourseOutput> {
  return generateCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoursePrompt',
  input: {schema: GenerateCourseInputSchema},
  output: {schema: GenerateCourseOutputSchema},
  prompt: `
Você é um instrutor de vendas para vendedores de calçados. Crie um MINI CURSO sobre o tema "{{topic}}".

O curso deve conter:
- Um título envolvente
- Conteúdo didático curto (3 a 5 parágrafos) em formato Markdown.
- Um quiz com 3 perguntas de múltipla escolha (4 alternativas cada)

Formato da resposta:
{
  "title": "Título do curso",
  "content": "Texto do curso...",
  "quiz": [
    {
      "question": "Pergunta?",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 1,
      "explanation": "Explicação curta da resposta"
    }
  ]
}

⚠️ Não inclua texto fora do JSON.
`,
});

const getFallbackCourse = (): GenerateCourseOutput => ({
  title: 'Curso de Emergência: Atendimento ao Cliente',
  content:
    'Aprenda o básico para encantar seus clientes. A primeira impressão é a que fica. Um sorriso, uma saudação amigável e uma escuta atenta são as ferramentas mais poderosas de um vendedor. Lembre-se de entender a necessidade do cliente antes de oferecer um produto. Fazer as perguntas certas é mais importante do que ter todas as respostas.',
  quiz: [
    {
      question: 'Qual é o primeiro passo para um bom atendimento?',
      options: [
        'Mostrar as promoções',
        'Sorrir e cumprimentar',
        'Perguntar o que o cliente quer',
        'Falar do produto mais caro',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Um cumprimento amigável cria um ambiente acolhedor e abre portas para a venda.',
    },
    {
      question: 'O que é mais importante na venda consultiva?',
      options: [
        'Falar sem parar',
        'Decorar o manual',
        'Ouvir o cliente',
        'Ter pressa para fechar',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Ouvir ativamente para entender a necessidade do cliente é a chave para oferecer a solução certa.',
    },
    {
      question: 'Como lidar com um cliente indeciso?',
      options: [
        'Pressioná-lo a escolher',
        'Deixá-lo sozinho',
        'Fazer perguntas para limitar as opções',
        'Mostrar mais 10 produtos',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Ajudar o cliente a focar, fazendo perguntas-chave, demonstra expertise e cuidado.',
    },
  ],
});

const generateCourseFlow = ai.defineFlow(
  {
    name: 'generateCourseFlow',
    inputSchema: GenerateCourseInputSchema,
    outputSchema: GenerateCourseOutputSchema,
  },
  async input => {
    try {
      const response = await prompt(input);

      if (response.output) {
        if (response.output.quiz.length === 0) {
          console.warn(
            '⚠️ IA retornou um curso válido mas sem quiz. Usando fallback.'
          );
          return getFallbackCourse();
        }
        return response.output;
      }

      const rawText = response.text;
      if (!rawText) {
        console.warn('⚠️ IA retornou uma resposta vazia. Usando fallback.');
        return getFallbackCourse();
      }

      const jsonRegex = /```json\n([\s\S]*?)\n```|({[\s\S]*})/;
      const match = rawText.match(jsonRegex);

      if (!match) {
        console.warn('AI response did not contain valid JSON. Using fallback.');
        return getFallbackCourse();
      }

      const jsonString = match[1] || match[2];
      const parsed = JSON.parse(jsonString);

      const validated = GenerateCourseOutputSchema.parse(parsed);

      if (validated.quiz.length === 0) {
        console.warn(
          '⚠️ IA retornou um curso válido mas sem quiz (após parse). Usando fallback.'
        );
        return getFallbackCourse();
      }

      return validated;
    } catch (error) {
      console.error('❌ Erro no fluxo de geração de curso:', error);
      console.warn('⚠️ Usando fallback local por falha na IA.');
      return getFallbackCourse();
    }
  }
);
