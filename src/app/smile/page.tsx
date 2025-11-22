'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Zap, Smile as SmileIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { checkSmile } from '../actions';
import type { AnalyzeSmileOutput } from '@/ai/flows/analyze-smile';

const SMILE_THRESHOLD = 75; // Percentage needed to "win"

export default function SmilePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [result, setResult] = useState<AnalyzeSmileOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support the camera API.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
        }
    }
  }, [toast]);
  
  useEffect(() => {
    if (result && result.smilingPercentage >= SMILE_THRESHOLD && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [result, showConfetti]);

  const captureAndAnalyze = useCallback(async () => {
    if (isAnalyzing || !videoRef.current || !canvasRef.current) {
      return;
    }

    setIsAnalyzing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUri = canvas.toDataURL('image/jpeg');

      try {
        const response = await checkSmile(imageDataUri);
        if (response.error) throw new Error(response.error);
        setResult(response.data || null);
      } catch (error) {
        console.error('Analysis failed:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error instanceof Error ? error.message : 'The AI model could not analyze the image. Please try again.',
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
        setIsAnalyzing(false);
    }
  }, [toast]); // isAnalyzing is intentionally not a dependency to prevent race conditions

  const startAnalysis = () => {
    stopAnalysis();
    analysisIntervalRef.current = setInterval(captureAndAnalyze, 2000);
    captureAndAnalyze();
  };

  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    setIsAnalyzing(false);
  };
  
  const Confetti = () => (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
        {[...Array(100)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-yellow-300 w-2 h-4"
                style={{
                    left: `${Math.random() * 100}%`,
                    animation: `fall 5s linear ${Math.random() * 5}s infinite`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`
                }}
            />
        ))}
        <style jsx>{`
            @keyframes fall {
                from { top: -20px; }
                to { top: 100%; }
            }
        `}</style>
    </div>
  );


  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {showConfetti && <Confetti />}
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl">
          Smile Meter
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Let's see that smile! Our AI will tell you how bright it is.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="text-primary" />
              Live Camera Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                </AlertDescription>
              </Alert>
            )}
            <div className="relative aspect-video w-full rounded-md border bg-muted flex items-center justify-center">
              <video
                ref={videoRef}
                className="h-full w-full rounded-md object-cover"
                autoPlay
                muted
                playsInline
                style={{ transform: "scaleX(-1)" }}
              />
              <canvas ref={canvasRef} className="hidden"></canvas>
              {hasCameraPermission === null && (
                  <div className="absolute flex items-center text-muted-foreground">
                      <Loader2 className="mr-2 animate-spin" />
                      Requesting camera access...
                  </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={startAnalysis} disabled={!hasCameraPermission || (isAnalyzing && !!analysisIntervalRef.current)}>
                  {isAnalyzing && !!analysisIntervalRef.current ? ( <> <Loader2 className="mr-2 animate-spin" /> Analyzing... </> ) : ( <> <Zap className="mr-2" /> Start Real-time </> )}
              </Button>
              <Button onClick={stopAnalysis} variant="secondary" disabled={!analysisIntervalRef.current}>
                  Stop
              </Button>
              <Button onClick={captureAndAnalyze} variant="outline" disabled={!hasCameraPermission || isAnalyzing}>
                  {isAnalyzing && !analysisIntervalRef.current ? ( <> <Loader2 className="mr-2 animate-spin" /> Checking... </> ) : ( <> <SmileIcon className="mr-2" /> Check Smile </> )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            {result ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-headline">Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-primary">Smile Percentage</p>
                                <p className="text-2xl font-bold text-primary">{result.smilingPercentage}%</p>
                            </div>
                            <Progress value={result.smilingPercentage} className="w-full" />
                        </div>
                        <Alert>
                            <SmileIcon className="h-4 w-4" />
                            <AlertTitle>AI Encouragement</AlertTitle>
                            <AlertDescription>{result.reason}</AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            ) : (
                <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <CardHeader>
                        <CardTitle>Awaiting Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Your smile analysis will appear here once you start the check.</p>
                        <SmileIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mt-4" />
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
