'use server';

/**
 * @fileOverview Analyzes questionnaire data to determine triage levels and provide personalized recommendations.
 *
 * - analyzeTriage - A function that analyzes questionnaire data and returns personalized recommendations.
 * - AnalyzeTriageInput - The input type for the analyzeTriage function.
 * - AnalyzeTriageOutput - The return type for the analyzeTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTriageInputSchema = z.object({
  questionnaireType: z.enum(['PHQ-9', 'GAD-7']).describe('The type of questionnaire used (PHQ-9 or GAD-7).'),
  questionnaireData: z.record(z.string(), z.number()).describe('The data from the questionnaire, with question keys and numeric answers.'),
  userDetails: z.string().optional().describe('Optional details about the user for personalization.'),
});
export type AnalyzeTriageInput = z.infer<typeof AnalyzeTriageInputSchema>;

const AnalyzeTriageOutputSchema = z.object({
  triageLevel: z.string().describe('The determined triage level (e.g., Mild, Moderate, Severe).'),
  selfHelpRecommendations: z.array(z.string()).describe('Personalized self-help strategies.'),
  productServiceRecommendations: z.array(z.string()).describe('Relevant product/service suggestions.'),
  crisisResources: z.array(z.string()).describe('Essential crisis resources.'),
  explanation: z.string().describe('Explanation of why the model returned this triage level.'),
});
export type AnalyzeTriageOutput = z.infer<typeof AnalyzeTriageOutputSchema>;

export async function analyzeTriage(input: AnalyzeTriageInput): Promise<AnalyzeTriageOutput> {
  return analyzeTriageFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: AnalyzeTriageInputSchema},
  output: {schema: AnalyzeTriageOutputSchema},
  prompt: `You are an AI assistant designed to analyze mental health questionnaire data and provide personalized recommendations.

  Based on the provided questionnaire data ({{{questionnaireType}}} - {{{JSON.stringify(questionnaireData)}}}), determine the appropriate triage level (Mild, Moderate, Severe).  Consider the user details if provided ({userDetails}}).

  Provide personalized self-help strategies, relevant product/service suggestions, and essential crisis resources.

  Return the results in JSON format.
  Explain your reasoning for the triage level determination.

  The output should be in the following format:
  {
    "triageLevel": "[Triage Level]",
    "selfHelpRecommendations": ["Recommendation 1", "Recommendation 2"],
    "productServiceRecommendations": ["Product/Service 1", "Product/Service 2"],
    "crisisResources": ["Resource 1", "Resource 2"],
    "explanation": "[Explanation of the triage level determination]"
  }
  `,
});

const analyzeTriageFlow = ai.defineFlow(
  {
    name: 'analyzeTriageFlow',
    inputSchema: AnalyzeTriageInputSchema,
    outputSchema: AnalyzeTriageOutputSchema,
  },
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
