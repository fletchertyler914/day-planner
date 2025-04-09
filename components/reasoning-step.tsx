'use client';

import { motion } from 'framer-motion';

interface ReasoningStep {
  title: string;
  content: string;
}

export function ReasoningStep({ step }: { step?: ReasoningStep }) {
  if (!step) return null;

  return (
    <div className='rounded-xl border border-border bg-card p-4'>
      <div className='flex items-center gap-2'>
        <div className='size-2 rounded-full bg-primary' />
        <h3 className='font-medium text-foreground'>{step.title}</h3>
      </div>
      <p className='mt-2 text-sm text-muted-foreground'>{step.content}</p>
    </div>
  );
}
