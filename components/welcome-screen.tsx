import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, SparklesIcon } from '@/components/icons';

const suggestedActions = [
  {
    title: 'Plan My Workday',
    label: 'Schedule meetings, deep work, and breaks',
    action:
      'I need to plan my workday. I have a team meeting at 2pm, need to prepare a presentation, and want to do some deep work on a project. I also need to take a lunch break and some short breaks throughout the day.',
  },
  {
    title: 'Plan My Weekend',
    label: 'Balance chores, relaxation, and social activities',
    action:
      'I want to plan my Saturday. I need to do laundry, go grocery shopping, meet friends for brunch, and have some time to relax. I also want to go for a run and read a book.',
  },
  {
    title: 'Plan My Study Day',
    label: 'Organize study sessions, breaks, and review time',
    action:
      'I need to plan my study day. I have three subjects to review: math, history, and biology. I want to include breaks and some exercise. I study best in the morning and need to finish by 6pm.',
  },
];

interface WelcomeScreenProps {
  onSuggestedActionClick: (action: string) => void;
}

export function WelcomeScreen({ onSuggestedActionClick }: WelcomeScreenProps) {
  return (
    <div className='mt-12 space-y-8'>
      <motion.div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-2xl border rounded-2xl p-8 flex flex-col items-center gap-8 text-muted-foreground text-sm border-border bg-card'>
          <div className='text-center space-y-2 mb-8'>
            <h2 className='text-3xl font-semibold text-foreground'>
              Day Planner
            </h2>
            <p className='text-lg text-muted-foreground'>
              Make the most of your time
            </p>
          </div>

          <div className='w-full max-w-xl space-y-4'>
            <div className='p-6 rounded-lg bg-accent/50'>
              <div className='flex items-center gap-3 mb-3'>
                <SparklesIcon
                  size={20}
                  className='text-primary flex-shrink-0'
                />
                <span className='font-medium text-foreground'>
                  Smart Planning
                </span>
              </div>
              <p className='text-muted-foreground pl-8'>
                Optimized for your natural rhythm and energy levels
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='p-6 rounded-lg bg-accent/50 h-full flex flex-col'>
                <div className='flex items-center gap-3 mb-3'>
                  <ClockIcon size={20} className='text-primary flex-shrink-0' />
                  <span className='font-medium text-foreground'>
                    Focus Time
                  </span>
                </div>
                <p className='text-muted-foreground pl-8'>
                  Deep work sessions when you're at your best
                </p>
              </div>
              <div className='p-6 rounded-lg bg-accent/50 h-full flex flex-col'>
                <div className='flex items-center gap-3 mb-3'>
                  <CalendarIcon
                    size={20}
                    className='text-primary flex-shrink-0'
                  />
                  <span className='font-medium text-foreground'>Balance</span>
                </div>
                <p className='text-muted-foreground pl-8'>
                  Strategic breaks to stay refreshed
                </p>
              </div>
            </div>
          </div>

          <div className='w-full pt-8 mt-4 border-t border-border'>
            <p className='text-center text-sm text-muted-foreground mb-6'>
              Choose a template or describe your day
            </p>
            <div className='grid grid-cols-1 gap-3 max-w-xl mx-auto'>
              {suggestedActions.map((suggestedAction, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  key={index}
                >
                  <button
                    onClick={() =>
                      onSuggestedActionClick(suggestedAction.action)
                    }
                    className='w-full text-left p-5 rounded-lg border border-border text-foreground hover:bg-accent hover:border-border/60 transition-colors'
                  >
                    <div className='font-medium'>{suggestedAction.title}</div>
                    <div className='text-sm text-muted-foreground mt-1'>
                      {suggestedAction.label}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
