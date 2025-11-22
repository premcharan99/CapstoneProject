'use server';

/**
 * @fileOverview Analyzes mental health questionnaire data to provide a preliminary assessment and recommendations.
 *
 * - analyzeMentalHealth - Analyzes the data and provides recommendations.
 * - AnalyzeMentalHealthInput - The input type for the analyzeMentalHealth function.
 * - AnalyzeMentalHealthOutput - The return type for the analyzeMentalHealth function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { symptomQuestionnaireSchema } from '@/lib/schemas';

export type AnalyzeMentalHealthInput = z.infer<typeof symptomQuestionnaireSchema>;

const RecommendationSchema = z.object({
  therapistType: z.string().describe("The type of therapist recommended (e.g., 'Psychiatrist', 'Psychologist', 'Licensed Clinical Social Worker')."),
  reason: z.string().describe("The reason for recommending this type of therapist."),
});

const AnalyzeMentalHealthOutputSchema = z.object({
  preliminaryAnalysis: z.string().describe("A brief, empathetic analysis of the user's questionnaire score, starting with a disclaimer that this is not a medical diagnosis."),
  severity: z.string().describe("The assessed severity level (e.g., 'Minimal', 'Mild', 'Moderate', 'Severe')."),
  score: z.number().describe("The total calculated score from the questionnaire."),
  recommendations: z.array(RecommendationSchema).describe("A list of recommended therapist types and reasons."),
  nextSteps: z.array(z.string()).describe("A list of suggested next steps for the user to take."),
});
export type AnalyzeMentalHealthOutput = zinfer<typeof AnalyzeMentalHealthOutputSchema>;


export async function analyzeMentalHealth(input: AnalyzeMentalHealthInput): Promise<AnalyzeMentalHealthOutput> {
  return analyzeMentalHealthFlow(input);
}

const TriagePromptInputSchema = symptomQuestionnaireSchema.extend({
    score: z.number().describe('The calculated score from the questionnaire answers.'),
});

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: { schema: TriagePromptInputSchema },
  output: { schema: AnalyzeMentalHealthOutputSchema.omit({ score: true }) },
  prompt: `You are a helpful and empathetic AI assistant designed to provide a preliminary analysis of a self-reported mental health questionnaire. Your role is to analyze the provided score, assess the severity, and offer general, supportive recommendations.

IMPORTANT: You are not a healthcare professional. Your analysis is not a diagnosis. Always start your analysis with a clear disclaimer stating this.

The user has completed a mental health screening questionnaire.
- Questionnaire Type: {{{questionnaireType}}}
- Calculated Score: {{{score}}}

Based on the score and questionnaire type, please perform the following actions and return them in the specified JSON format:

1.  **Determine the severity** based on the provided score and questionnaire type.
    - For PHQ-9 (Depression): 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe.
    - For GAD-7 (Anxiety): 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe.
2.  **Write a brief, empathetic analysis** based on the score and return it as 'preliminaryAnalysis'. Acknowledge the user's feelings and the courage it takes to self-assess.
3.  **Recommend therapist types**: Based on the severity and type of questionnaire, suggest 1-2 types of professionals (e.g., Psychologist, Psychiatrist, LCSW, LMFT) and provide a brief reason why each might be a good fit.
4.  **Suggest next steps**: Provide a short, actionable list of next steps, such as 'Talk to a trusted friend or family member', 'Schedule an appointment with your primary care doctor', or 'Explore online therapy platforms'.`,
});


const analyzeMentalHealthFlow = ai.defineFlow(
  {
    name: 'analyzeMentalHealthFlow',
    inputSchema: symptomQuestionnaireSchema,
    outputSchema: AnalyzeMentalHealthOutputSchema,
  },
  async (input) => {
    // Calculate the score server-side to ensure accuracy
    const score = Object.values(input.questionnaireData).reduce((sum, value) => sum + Number(value), 0);
    
    // Call the prompt with the input data AND the calculated score
    const { output } = await triagePrompt({
        ...input,
        score: score
    });
    
    // Ensure the server-calculated score is the one returned
    return {
        ...output!,
        score,
    };
  }
);
