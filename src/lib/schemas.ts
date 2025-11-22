import { z } from "zod";
import { PHQ9Questions, GAD7Questions } from "@/lib/questionnaires";

export const businessCriteriaSchema = z.object({
  serviceType: z.string().min(1, "Service type is required."),
  ownership: z.string().min(1, "Ownership is required."),
  targetAgeGroup: z.string().min(1, "Target age group is required."),
  location: z.string().min(1, "Location is required."),
  marketDemand: z.string().min(1, "Market demand is required."),
  deliveryMode: z.string().min(1, "Delivery mode is required."),
  paymentMethods: z.string().min(1, "Payment methods are required."),
  accessibilityGoal: z.string().min(1,"Accessibility goal is required."),
  targetUsers: z.string().min(1, "Target users description is required."),
  delivery: z.string().min(1, "Delivery description is required."),
  content: z.string().min(1, "Content description is required."),
  regulations: z.string().min(1, "Regulations description is required."),
  funding: z.string().min(1, "Funding description is required."),
  budget: z.string().min(1, "Budget description is required."),
  monetization: z.string().min(1, "Monetization description is required."),
  scope: z.string().min(1, "Scope is required."),
  dataSensitivity: z.string().min(1, "Data sensitivity description is required."),
  clinicalInvolvement: z.string().min(1, "Clinical involvement description is required."),
});

export type BusinessCriteria = z.infer<typeof businessCriteriaSchema>;

const createQuestionnaireSchema = (questions: any[]) => {
  const schemaShape = questions.reduce((acc, question) => {
    acc[question.id] = z.number({ required_error: "Please select an option." }).min(0).max(3);
    return acc;
  }, {} as Record<string, z.ZodNumber>);
  return z.object(schemaShape);
};

const phq9Schema = createQuestionnaireSchema(PHQ9Questions);
const gad7Schema = createQuestionnaireSchema(GAD7Questions);

export const symptomQuestionnaireSchema = z.object({
  questionnaireType: z.enum(["PHQ-9", "GAD-7"]),
  questionnaireData: z.any(),
}).superRefine((data, ctx) => {
  const result = data.questionnaireType === "PHQ-9"
    ? phq9Schema.safeParse(data.questionnaireData)
    : gad7Schema.safeParse(data.questionnaireData);
    
  if (!result.success) {
    result.error.errors.forEach((err) => {
      ctx.addIssue({
        ...err,
        path: ["questionnaireData", ...err.path],
      });
    });
  }
});