"use client";

import type { AnalyzeMentalHealthOutput } from "@/ai/flows/analyze-mental-health";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Printer,
  RotateCcw,
  HeartPulse,
  Users,
  ClipboardList,
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type TriageResultProps = {
  data: AnalyzeMentalHealthOutput;
  onReset: () => void;
};

export default function TriageResult({
  data,
  onReset,
}: TriageResultProps) {

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "mental-health-analysis.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="printable-area">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardDescription>Your Preliminary Analysis</CardDescription>
            <CardTitle className="font-headline text-4xl text-primary">
              Assessment Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 card-content">
            <Alert>
              <HeartPulse className="h-4 w-4" />
              <AlertTitle>Your Score & Severity</AlertTitle>
              <AlertDescription>
                <p>Your score is <span className="font-bold">{data.score}</span>, which suggests a <span className="font-bold">{data.severity.toLowerCase()}</span> level of symptoms.</p>
              </AlertDescription>
            </Alert>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-xl font-headline">
                    <Info className="mr-2 text-accent" />
                    AI Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{data.preliminaryAnalysis}</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-headline">
                    <Users className="mr-2 text-accent" />
                    Therapist Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.recommendations.map((rec, index) => (
                    <div key={index}>
                      <h4 className="font-semibold">{rec.therapistType}</h4>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-headline">
                    <ClipboardList className="mr-2 text-accent" />
                    Suggested Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {data.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-xs text-muted-foreground font-code mt-4 no-print">
              <span className="font-bold">Disclaimer:</span> This is not a diagnosis. The information provided is for educational purposes only and is not a substitute for professional medical advice.
            </p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-end gap-2 no-print">
            <Button variant="outline" onClick={handleDownloadJson}>
              <FileDown className="mr-2" />
              Download JSON
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2" />
              Print Summary
            </Button>
            <Button onClick={onReset}>
              <RotateCcw className="mr-2" />
              Start Over
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
