'use client';

import { motion } from 'framer-motion';
import { type TimelineItem } from '@/lib/schema';
import { CalendarIcon } from './icons';

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className='rounded-xl border border-border bg-card p-3 sm:p-6'>
      {/* Header */}
      <div className='flex items-center gap-2 sm:gap-3 pb-3 mb-3 sm:pb-6 sm:mb-6 border-b border-border'>
        <CalendarIcon size={24} className='text-primary' />
        <h2 className='text-lg sm:text-xl font-semibold text-foreground'>
          Your Planned Itinerary
        </h2>
      </div>

      <div className='relative'>
        {/* Vertical Line */}
        <div className='absolute left-[1.625rem] top-0 bottom-2 w-px bg-border' />

        {/* Timeline Items */}
        <div className='space-y-4 sm:space-y-6'>
          {items.map((item, i) => (
            <div key={i} className='relative flex gap-3 sm:gap-6'>
              {/* Time and Dot Container */}
              <div className='flex-none'>
                <div className='flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3'>
                  <div className='size-3.5 sm:size-4 rounded-full bg-primary ring-[3px] ring-card flex-shrink-0' />
                  <div className='text-sm font-medium text-primary whitespace-nowrap'>
                    {item.time}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <div className='text-base font-medium text-foreground break-words'>
                  {item.task}
                </div>
                {item.reason && (
                  <div className='mt-1 text-sm text-muted-foreground break-words'>
                    {item.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
