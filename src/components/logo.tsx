import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 128 128" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="64" cy="64" r="56" stroke="hsl(var(--primary))" strokeWidth="8"/>
      <path d="M64 28L80 64L64 100L48 64L64 28Z" fill="hsl(var(--accent))"/>
      <path d="M64 28L80 64L64 100L48 64L64 28Z" stroke="hsl(var(--background))" strokeWidth="4" strokeLinejoin="round"/>
      <circle cx="64" cy="64" r="8" fill="hsl(var(--primary))"/>
      <circle cx="64" cy="64" r="6" stroke="hsl(var(--background))" strokeWidth="2"/>
    </svg>
  );
}
