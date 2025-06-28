'use server';

/**
 * @fileOverview AI agent to analyze sales trends and identify key insights.
 *
 * - analyzeSalesTrends - A function that analyzes sales data for trends and anomalies.
 * - AnalyzeSalesTrendsInput - The input type for the analyzeSalesTrends function.
 * - AnalyzeSalesTrendsOutput - The return type for the analyzeSalesTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSalesTrendsInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      `Sales data in JSON format containing sales value, ticket average, and products per service.
      Example: [{
        "date": "2024-01-01",
        "salesValue": 1000,
        "ticketAverage": 100,
        "productsPerService": 2
      }]`
    ),
  timeFrame: z.enum(['weekly', 'monthly']).describe('Time frame for analysis.'),
});
export type AnalyzeSalesTrendsInput = z.infer<typeof AnalyzeSalesTrendsInputSchema>;

const AnalyzeSalesTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of the sales trends and anomalies.'),
  topProducts: z.string().describe('List of top-performing products based on the sales data.'),
  insights: z.string().describe('Key insights into what is driving sales performance.'),
});
export type AnalyzeSalesTrendsOutput = z.infer<typeof AnalyzeSalesTrendsOutputSchema>;

export async function analyzeSalesTrends(
  input: AnalyzeSalesTrendsInput
): Promise<AnalyzeSalesTrendsOutput> {
  return analyzeSalesTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSalesTrendsPrompt',
  input: {schema: AnalyzeSalesTrendsInputSchema},
  output: {schema: AnalyzeSalesTrendsOutputSchema},
  prompt: `You are an expert sales data analyst. Analyze the provided sales data to identify trends,
anomalies, and top-performing products.

Sales Data ({{timeFrame}}): {{{salesData}}}

Provide a summary of the sales trends, identify the top-performing products, and provide key insights
into what is driving sales performance. Be concise and clear.
`,
});

const analyzeSalesTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeSalesTrendsFlow',
    inputSchema: AnalyzeSalesTrendsInputSchema,
    outputSchema: AnalyzeSalesTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
