# **App Name**: Clarity Compass

## Core Features:

- Business Model Recommendation: Analyzes user inputs via rules and ML to suggest the optimal business model, along with confidence score, reasons, MVP features, GTM channels, and monetization forecasts. Uses Gemini API.
- Symptom-Based Triage: Adapts user modules based on a questionnaire (PHQ-9 or GAD-7) to determine triage level, personalized self-help, product/service suggestions, crisis resources, and clinician search. The AI tool identifies patterns and determines recommendations
- Data Export: Allows users to export the business model recommendation as a JSON file and a printable one-page summary PDF.
- Business Criteria Form: Presents a multi-section form to capture business criteria: Service Type, Ownership, Target Age Group, Location, Market Demand, Delivery Mode, Payment Methods, and Accessibility Goal, also the business criteria: target users, delivery, content, regulations, funding, budget, monetization, scope, data sensitivity, and clinical involvement.
- Local Storage: Stores session data in cookies/localStorage with privacy notes and data retention defaults. No server-side storage.
- Safety Guardrails: Implements crisis detection, escalation prompts, flags for clinical risk requiring practitioner involvement, and instructions for legal/regulatory checks per region.
- Dashboard and Graphs: Presents the recommendations using appropriate dashboards and graphs for easy understanding.

## Style Guidelines:

- Primary color: Soft teal (#79D1C3) for a calming and trustworthy feel.
- Background color: Very light blue-green (#E0F4F1) for a clean, approachable look.
- Accent color: Muted violet (#8EA2D1) to provide visual interest without overwhelming the interface.
- Body and headline font: 'PT Sans' for a balance of modern design with a little warmth.
- Code font: 'Source Code Pro' for displaying JSON data formats.
- Use clean, minimalist icons that reflect mental wellness and business concepts.
- Prioritize a clear, linear flow through the forms and results, ensuring accessibility and ease of use.