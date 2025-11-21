"use client";

import type { AnalyzeTriageOutput } from "@/ai/flows/analyze-triage-recommendations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  RotateCcw, 
  ShieldAlert, 
  HeartPulse, 
  Sparkles, 
  BookOpen,
  Info
} from "lucide-react";

type TriageResultsProps = {
  data: AnalyzeTriageOutput;
  onReset: () => void;
};

export default function TriageResults({ data, onReset }: TriageResultsProps) {
  const getTriageLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'severe':
        return 'text-destructive';
      case 'moderate':
        return 'text-orange-500';
      case 'mild':
        return 'text-yellow-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardDescription>Your Triage Result</CardDescription>
        <CardTitle className={`font-headline text-5xl ${getTriageLevelColor(data.triageLevel)}`}>
          {data.triageLevel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Analysis Explanation</AlertTitle>
          <AlertDescription>
            {data.explanation}
          </AlertDescription>
        </Alert>

        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
          {data.selfHelpRecommendations.length > 0 && (
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-headline">
                <Sparkles className="mr-2 text-accent" />
                Self-Help Strategies
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {data.selfHelpRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {data.productServiceRecommendations.length > 0 && (
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-headline">
                <HeartPulse className="mr-2 text-accent" />
                Product & Service Suggestions
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {data.productServiceRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {data.crisisResources.length > 0 && (
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-headline">
                <BookOpen className="mr-2 text-accent" />
                Learn More
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {data.crisisResources.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Crisis Support</AlertTitle>
          <AlertDescription>
            If you are in a crisis or any other person may be in danger, do not use this site. These resources can provide you with immediate help.
            <ul className="list-disc pl-5 mt-2">
              <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
              <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li><strong>The Trevor Project:</strong> 1-866-488-7386 (for LGBTQ youth)</li>
            </ul>
          </AlertDescription>
        </Alert>

      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </CardFooter>
    </Card>
  );
}
