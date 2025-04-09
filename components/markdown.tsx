import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    p: ({ children }: any) => {
      return <p className='mb-4 last:mb-0'>{children}</p>;
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-full md:max-w-[600px] overflow-x-auto bg-accent/50 p-4 rounded-lg my-4 font-mono`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-accent/50 py-0.5 px-1.5 rounded font-mono`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol
          className='list-decimal list-outside ml-6 mb-4 space-y-2'
          {...props}
        >
          {children}
        </ol>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className='list-disc list-outside ml-6 mb-4 space-y-2' {...props}>
          {children}
        </ul>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className='leading-relaxed' {...props}>
          {children}
        </li>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <strong className='font-semibold text-foreground' {...props}>
          {children}
        </strong>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className='text-2xl font-bold mb-4 mt-6' {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className='text-xl font-semibold mb-3 mt-5' {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className='text-lg font-medium mb-2 mt-4' {...props}>
          {children}
        </h3>
      );
    },
    a: ({ node, children, href, ...props }: any) => {
      return (
        <a
          href={href}
          className='text-primary hover:underline'
          target='_blank'
          rel='noopener noreferrer'
          {...props}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ node, children, ...props }: any) => {
      return (
        <blockquote
          className='border-l-4 border-primary/20 pl-4 my-4 italic text-muted-foreground'
          {...props}
        >
          {children}
        </blockquote>
      );
    },
  };

  return (
    <div className='prose prose-neutral dark:prose-invert max-w-none'>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
