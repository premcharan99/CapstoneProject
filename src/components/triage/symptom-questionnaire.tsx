"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { symptomQuestionnaireSchema } from "@/lib/schemas";
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, QUESTIONNAIRE_ANSWERS } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ShieldAlert } from "lucide-react";

type SymptomQuestionnaireProps = {
  onSubmit: (data: z.infer<typeof symptomQuestionnaireSchema>) => void;
  isLoading: boolean;
};

type QuestionnaireType = 'PHQ-9' | 'GAD-7';

export default function SymptomQuestionnaire({
  onSubmit,
  isLoading,
}: SymptomQuestionnaireProps) {
  const [questionnaireType, setQuestionnaireType] = useState<QuestionnaireType>('PHQ-9');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const questions = useMemo(() => 
    questionnaireType === 'PHQ-9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS,
    [questionnaireType]
  );
  
  const defaultValues = useMemo(() => {
    const defaults = {
      questionnaireType,
      questionnaireData: {},
      userDetails: ''
    };
    const currentQuestions = questionnaireType === 'PHQ-9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
    currentQuestions.forEach(q => {
      defaults.questionnaireData[q.id] = 0;
    });
    return defaults;
  }, [questionnaireType]);
  
  const form = useForm<z.infer<typeof symptomQuestionnaireSchema>>({
    resolver: zodResolver(symptomQuestionnaireSchema),
    defaultValues,
  });

  const handleFormSubmit = (values: z.infer<typeof symptomQuestionnaireSchema>) => {
    const questionsList = values.questionnaireType === 'PHQ-9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
    
    const transformedData = {
      ...values,
      questionnaireData: Object.entries(values.questionnaireData).reduce((acc, [key, value]) => {
        const questionText = questionsList.find(q => q.id === key)?.text || key;
        acc[questionText] = value;
        return acc;
      }, {}),
    };
    
    onSubmit(transformedData);
  };

  const handleTypeChange = (type: QuestionnaireType) => {
    setQuestionnaireType(type);
    const newQuestions = type === 'PHQ-9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
    const newQuestionnaireData = {};
    newQuestions.forEach(q => {
      newQuestionnaireData[q.id] = 0;
    });
    form.reset({
      questionnaireType: type,
      questionnaireData: newQuestionnaireData,
      userDetails: form.getValues('userDetails')
    });
  };

  if (!isClient) {
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Symptom Triage</CardTitle>
                <CardDescription>
                    This tool helps to understand your current well-being. Please answer the questions based on how you have been feeling over the last 2 weeks.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="h-10 w-48 rounded-md bg-muted animate-pulse" />
                    <div className="space-y-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="p-4 rounded-lg border space-y-3">
                                <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                    <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                                    <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                                    <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
                                    <div className="h-6 w-32 rounded-md bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Symptom Triage</CardTitle>
        <CardDescription>
          This tool helps to understand your current well-being. Please answer the questions based on how you have been feeling over the last 2 weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="questionnaireType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Questionnaire</FormLabel>
                    <Select onValueChange={(value: QuestionnaireType) => handleTypeChange(value)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a questionnaire" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PHQ-9">PHQ-9 (Depression)</SelectItem>
                        <SelectItem value="GAD-7">GAD-7 (Anxiety)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={`questionnaireData.${question.id}` as const}
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 rounded-lg border">
                        <FormLabel className="text-base">{index + 1}. {question.text}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={String(field.value)}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
                          >
                            {QUESTIONNAIRE_ANSWERS.map((answer) => (
                              <FormItem key={answer.value} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={String(answer.value)} />
                                </FormControl>
                                <FormLabel className="font-normal">{answer.text}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  This tool is not a substitute for professional medical advice, diagnosis, or treatment. If you are in a crisis, please seek help immediately.
                </AlertDescription>
              </Alert>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}