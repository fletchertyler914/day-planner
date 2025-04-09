import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { timelineItemSchema } from '@/lib/schema';
import { systemMessage } from '@/lib/utils';

export async function POST(request: Request) {
  const { messages } = await request.json();
  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!apiKey) {
    return new Response('Unauthorized', { status: 401 });
  }

  const openai = createOpenAI({ apiKey });
  const result = streamText({
    model: openai('gpt-4o'),
    system: systemMessage,
    messages,
    maxSteps: 10,
    experimental_toolCallStreaming: true,
    tools: {
      addAReasoningStep: {
        description: 'Add a step to the reasoning process.',
        parameters: z.object({
          title: z.string().describe('The title of the reasoning step'),
          content: z
            .string()
            .describe(
              'The content of the reasoning step. Explain your planning decisions in detail.'
            ),
          nextStep: z
            .enum(['continue', 'finalAnswer'])
            .describe(
              'Whether to continue with another step or provide the final answer'
            ),
        }),
        execute: async (params) => params,
      },
      renderTimeline: {
        description: 'Render the final day plan as a timeline.',
        parameters: z.object({
          items: z.array(timelineItemSchema),
        }),
        execute: async (params) => params,
      },
    },
  });

  return result.toDataStreamResponse();
}
