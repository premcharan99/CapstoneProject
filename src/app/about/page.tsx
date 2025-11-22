"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl xl:text-6xl/none">
                About Clarity Compass
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Empowering your journey with AI-driven insights for business innovation and personal well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Mission</div>
                <h2 className="text-3xl font-bold tracking-tighter font-headline sm:text-5xl">Clarity in a Complex World</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We believe that everyone deserves a clear path forward, whether you're launching a new business or navigating the complexities of personal wellness. Clarity Compass was built to provide accessible, intelligent tools that help you make informed decisions and find direction.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
                <svg 
                  viewBox="0 0 128 128" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-64 h-64 lg:w-96 lg:h-96"
                >
                  <circle cx="64" cy="64" r="60" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <path d="M64 16L96 64L64 112L32 64L64 16Z" fill="hsl(var(--accent) / 0.6)" stroke="hsl(var(--foreground) / 0.5)" strokeWidth="2" />
                  <circle cx="64" cy="64" r="12" fill="hsl(var(--primary))" />
                  <circle cx="64" cy="64" r="8" stroke="hsl(var(--background))" strokeWidth="2"/>
                </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter font-headline md:text-4xl/tight">Our Core Principles</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our work is guided by a commitment to accessibility, privacy, and responsible AI.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <Card className="text-left">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="text-accent" /> Accessibility
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        We strive to make our tools easy to use and available to everyone, regardless of their technical expertise.
                    </p>
                </CardContent>
            </Card>
            <Card className="text-left">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="text-accent" /> User-Centric AI
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Our AI is designed to be a helpful assistant, providing guidance and suggestions, not making decisions for you. You are always in control.
                    </p>
                </CardContent>
            </Card>
            <Card className="text-left">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="text-accent" /> Privacy & Safety
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Your data is yours. We are committed to protecting your privacy and ensuring our tools are used responsibly and ethically.
                    </p>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
