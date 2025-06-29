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
Você é um instrutor de vendas especialista e didático, criando materiais para vendedores de calçados. Sua tarefa é criar um MINI CURSO sobre o tema "{{topic}}".

O mini curso deve ter duas partes, em formato JSON:
1.  **Conteúdo Didático:** Um texto curto e objetivo (3 a 5 parágrafos) em formato Markdown. O conteúdo deve ser prático e ensinar algo útil sobre o tema.
2.  **Quiz de Verificação:** Um quiz com EXATAMENTE 3 perguntas de múltipla escolha.

Regras IMPORTANTES:
- O quiz deve ser **baseado EXCLUSIVAMENTE no conteúdo didático** que você acabou de criar. As respostas devem estar no texto.
- As perguntas do quiz devem ser **diferentes** das que seriam geradas em um quiz geral de vendas. Elas testam a leitura e compreensão do material apresentado.
- Responda **APENAS com o JSON**, sem textos adicionais ou blocos de código.

Formato da resposta:
{
  "title": "Título do curso",
  "content": "## Título do Módulo\\n\\nPrimeiro parágrafo do conteúdo...\\n\\nSegundo parágrafo com **destaques**...",
  "quiz": [
    {
      "question": "De acordo com o texto, qual é o primeiro passo para...?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctAnswerIndex": 1,
      "explanation": "A explicação deve reforçar o que foi ensinado no texto."
    }
  ]
}
`,
});

const getFallbackCourse = (): GenerateCourseOutput => ({
  title: 'Curso de Emergência: Atendimento ao Cliente',
  content:
    'Aprenda o básico para encantar seus clientes. A primeira impressão é a que fica. Um sorriso, uma saudação amigável e uma escuta atenta são as ferramentas mais poderosas de um vendedor. Lembre-se de entender a necessidade do cliente antes de oferecer um produto. Fazer as perguntas certas é mais importante do que ter todas as respostas. A chave para a venda consultiva é ouvir mais e falar menos.',
  quiz: [
    {
      question: 'Segundo o texto, qual é a primeira impressão que fica?',
      options: [
        'A do produto mais caro',
        'A primeira',
        'A da promoção',
        'A última',
      ],
      correctAnswerIndex: 1,
      explanation:
        'O texto afirma claramente que "A primeira impressão é a que fica".',
    },
    {
      question:
        'O que o material descreve como as ferramentas mais poderosas de um vendedor?',
      options: [
        'Calculadora e caneta',
        'Catálogo e tablet',
        'Sorriso, saudação e escuta atenta',
        'Argumentos de venda e persuasão',
      ],
      correctAnswerIndex: 2,
      explanation:
        'O curso menciona sorriso, saudação e escuta atenta como as ferramentas mais poderosas.',
    },
    {
      question:
        'Qual é a chave para a venda consultiva mencionada no conteúdo?',
      options: [
        'Falar sobre a concorrência',
        'Ouvir mais e falar menos',
        'Decorar o manual de produtos',
        'Apressar o fechamento da venda',
      ],
      correctAnswerIndex: 1,
      explanation:
        'O texto finaliza dizendo que a chave para a venda consultiva é "ouvir mais e falar menos".',
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
