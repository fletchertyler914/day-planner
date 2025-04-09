# Smart Day Planner

A responsive web application designed to help users plan their day in a fun, effective, and intelligent way. Simply input your tasks, and let our AI generate an optimal, time-based schedule with thoughtful justifications for task ordering.

## Features

- 📝 Intuitive task input interface
- 🤖 AI-powered schedule generation
- ⏰ Smart time blocking and task organization
- 📱 Mobile-first responsive design
- 🌓 Light/Dark mode support
- ✨ Beautiful, modern UI using shadcn/ui components

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK with OpenAI GPT-4o Reasoning for intelligent scheduling
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/day-planner.git
cd day-planner
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How It Works

1. Enter your tasks for the day
2. Click "Plan My Day"
3. Our AI will analyze your tasks considering:
   - Task dependencies
   - Time-of-day relevance
   - Similar task grouping
4. Receive a beautifully formatted schedule with explanations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Future Enhancements

- Drag-and-drop timeline editing
- Voice input for tasks
- Calendar export (Google Calendar, iCal)
- Daily reminders and notifications
