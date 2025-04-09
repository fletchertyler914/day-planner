'use client';

import { motion } from 'framer-motion';
import { BotIcon, UserIcon } from './icons';
import { ReactNode } from 'react';
import { StreamableValue, useStreamableValue } from 'ai/rsc';
import { Markdown } from './markdown';
import { Message as TMessage, ToolInvocation } from 'ai';
import { ReasoningStep } from './reasoning-step';
import { Timeline } from './timeline';

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className='flex flex-col gap-2 px-4 w-full first-of-type:pt-20'
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className='flex justify-end'>
        <div className='size-[24px] flex justify-center items-center flex-shrink-0 text-muted-foreground'>
          <BotIcon />
        </div>
      </div>

      <div className='text-foreground flex flex-col gap-4'>
        <Markdown>{text}</Markdown>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
  toolInvocations,
  reasoningMessages,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  reasoningMessages: Array<TMessage>;
}) => {
  const usingTool = toolInvocations ?? false;
  const loading = content === '' && toolInvocations === undefined;
  const isInitialResponse =
    role === 'assistant' && !usingTool && reasoningMessages.length === 0;

  return (
    <motion.div
      className='flex flex-col gap-6 mb-8'
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* User Message */}
      {!usingTool && role === 'user' && (
        <div className='flex flex-col gap-2 px-4'>
          <div className='flex justify-end'>
            <div className='size-[32px] flex justify-center items-center flex-shrink-0 rounded-full bg-primary text-primary-foreground'>
              <UserIcon />
            </div>
          </div>
          <div className='text-foreground leading-relaxed bg-primary/10 rounded-2xl px-4 py-2'>
            <Markdown>{content as string}</Markdown>
          </div>
        </div>
      )}

      {/* Loading Animation or Assistant Message */}
      {isInitialResponse && (
        <div className='flex flex-col gap-2 px-4'>
          <div className='flex'>
            <div className='size-[32px] flex justify-center items-center flex-shrink-0 rounded-full bg-primary/10 border border-primary/20'>
              <BotIcon className='text-primary' />
            </div>
          </div>
          {loading ? (
            <div className='flex items-center gap-1'>
              <motion.div
                className='size-2 rounded-full bg-primary/40'
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className='size-2 rounded-full bg-primary/40'
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className='size-2 rounded-full bg-primary/40'
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          ) : (
            <div className='text-foreground leading-relaxed bg-accent/50 rounded-2xl px-4 py-2'>
              <Markdown>{content as string}</Markdown>
            </div>
          )}
        </div>
      )}

      {/* Reasoning Steps */}
      {reasoningMessages.length > 0 && (
        <div className='space-y-6 px-4'>
          {reasoningMessages.map((message, i) => {
            const { toolInvocations } = message;
            if (
              toolInvocations &&
              toolInvocations.length > 0 &&
              toolInvocations[0]
            ) {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                >
                  <ReasoningStep
                    step={
                      toolInvocations[0].state === 'result'
                        ? toolInvocations[0].result
                        : undefined
                    }
                  />
                </motion.div>
              );
            }
          })}
        </div>
      )}

      {/* Timeline and Tool Invocations */}
      {toolInvocations && (
        <div className='space-y-6 px-4'>
          {toolInvocations.map((toolInvocation) => {
            const { toolName, toolCallId, state } = toolInvocation;

            if (state === 'result') {
              const { result } = toolInvocation;

              return (
                <div key={toolCallId}>
                  {toolName === 'addAReasoningStep' ? (
                    <ReasoningStep step={result} />
                  ) : toolName === 'renderTimeline' ? (
                    <Timeline items={result.items} />
                  ) : null}
                </div>
              );
            }
          })}
        </div>
      )}
    </motion.div>
  );
};
