import { z } from 'zod';

export const reasoningStepSchema = z.object({
  title: z.string().describe('The title of the reasoning step'),
  content: z.string().describe('The content of the reasoning step.'),
  nextStep: z
    .enum(['continue', 'finalAnswer'])
    .describe(
      'Whether to continue with another step or provide the final answer'
    ),
});

export type ReasoningStep = z.infer<typeof reasoningStepSchema>;

export const timelineItemSchema = z.object({
  time: z.string().describe("Time for the task, e.g. '11:00 AM'"),
  task: z.string().describe('The task description'),
  reason: z
    .string()
    .optional()
    .describe('Optional explanation for why this time was chosen'),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
