'use server';

/**
 * @fileOverview Suggests the most suitable business model based on user-provided criteria.
 *
 * - suggestBusinessModel - Analyzes business criteria and suggests a business model.
 * - SuggestBusinessModelInput - The input type for the suggestBusinessModel function.
 * - SuggestBusinessModelOutput - The return type for the suggestBusinessModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBusinessModelInputSchema = z.object({
  serviceType: z.string().describe('The type of service the business provides.'),
  ownership: z.string().describe('The ownership structure of the business.'),
  targetAgeGroup: z.string().describe('The target age group for the business.'),
  location: z.string().describe('The location of the business.'),
  marketDemand: z.string().describe('The market demand for the business.'),
  deliveryMode: z.string().describe('The delivery mode of the business.'),
  paymentMethods: z.string().describe('The payment methods for the business.'),
  accessibilityGoal: z.string().describe('The accessibility goal of the business.'),
  targetUsers: z.string().describe('Description of target users.'),
  delivery: z.string().describe('Description of delivery methods.'),
  content: z.string().describe('Description of content provided.'),
  regulations: z.string().describe('Description of relevant regulations.'),
  funding: z.string().describe('Description of funding sources.'),
  budget: z.string().describe('The budget for the business.'),
  monetization: z.string().describe('Description of monetization strategies.'),
  scope: z.string().describe('The scope of the business.'),
  dataSensitivity: z.string().describe('Description of data sensitivity considerations.'),
  clinicalInvolvement: z.string().describe('Description of clinical involvement, if any.'),
});
export type SuggestBusinessModelInput = z.infer<typeof SuggestBusinessModelInputSchema>;

const SuggestBusinessModelOutputSchema = z.object({
  businessModel: z.string().describe('The suggested business model.'),
  confidenceScore: z.number().describe('A score indicating the confidence level in the suggested business model (0-1).'),
  reasons: z.string().describe('The reasons for suggesting the business model.'),
  mvpFeatures: z.string().describe('Potential MVP features for the business.'),
  gtmChannels: z.string().describe('Potential Go-To-Market channels for the business.'),
  monetizationForecasts: z.string().describe('Monetization forecasts for the business.'),
});
export type SuggestBusinessModelOutput = z.infer<typeof SuggestBusinessModelOutputSchema>;

export async function suggestBusinessModel(input: SuggestBusinessModelInput): Promise<SuggestBusinessModelOutput> {
  return suggestBusinessModelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBusinessModelPrompt',
  input: {schema: SuggestBusinessModelInputSchema},
  output: {schema: SuggestBusinessModelOutputSchema},
  prompt: `You are an AI assistant that provides business model recommendations based on user-provided criteria. Analyze the following criteria and suggest the most suitable business model. Provide a confidence score (0-1), reasons for the suggestion, potential MVP features, Go-To-Market channels, and monetization forecasts.

Service Type: {{{serviceType}}}
Ownership: {{{ownership}}}
Target Age Group: {{{targetAgeGroup}}}
Location: {{{location}}}
Market Demand: {{{marketDemand}}}
Delivery Mode: {{{deliveryMode}}}
Payment Methods: {{{paymentMethods}}}
Accessibility Goal: {{{accessibilityGoal}}}
Target Users: {{{targetUsers}}}
Delivery: {{{delivery}}}
Content: {{{content}}}
Regulations: {{{regulations}}}
Funding: {{{funding}}}
Budget: {{{budget}}}
Monetization: {{{monetization}}}
Scope: {{{scope}}}
Data Sensitivity: {{{dataSensitivity}}}
Clinical Involvement: {{{clinicalInvolvement}}}

{{#if clinicalInvolvement}}
WARNING: Clinical involvement detected. Ensure all suggestions comply with relevant healthcare regulations and ethical guidelines.
{{/if}}`,
});

const suggestBusinessModelFlow = ai.defineFlow(
  {
    name: 'suggestBusinessModelFlow',
    inputSchema: SuggestBusinessModelInputSchema,
    outputSchema: SuggestBusinessModelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
