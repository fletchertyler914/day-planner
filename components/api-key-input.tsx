'use client';

import { useState } from 'react';
import { useOpenAI } from '../app/(preview)/providers';
import { EyeIcon, EyeOffIcon, TrashIcon } from './icons';

export function ApiKeyInput() {
  const { apiKey, setApiKey } = useOpenAI();
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSave = () => {
    setApiKey(tempKey);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempKey(apiKey);
    setIsEditing(true);
  };

  const handleDelete = () => {
    setApiKey('');
    setTempKey('');
    setIsEditing(true);
  };

  if (!isEditing && apiKey) {
    return (
      <div className='flex flex-col gap-2'>
        <label className='text-sm text-muted-foreground px-2'>
          OpenAI API Key
        </label>
        <div className='flex items-center gap-2 p-2 rounded-lg bg-accent'>
          <div className='flex-1 truncate font-mono text-sm'>
            {showKey ? apiKey : `${apiKey.slice(0, 3)}...${apiKey.slice(-4)}`}
          </div>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setShowKey(!showKey)}
              className='p-1.5 rounded-md hover:bg-accent-foreground/10 text-muted-foreground hover:text-foreground transition-colors'
              title={showKey ? 'Hide API Key' : 'Show API Key'}
            >
              {showKey ? (
                <EyeOffIcon className='w-4 h-4' />
              ) : (
                <EyeIcon className='w-4 h-4' />
              )}
            </button>
            <button
              onClick={handleEdit}
              className='p-1.5 rounded-md hover:bg-accent-foreground/10 text-muted-foreground hover:text-foreground transition-colors'
              title='Edit API Key'
            >
              <svg
                width='15'
                height='15'
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4'
              >
                <path
                  d='M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.22541 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z'
                  fill='currentColor'
                  fillRule='evenodd'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className='p-1.5 rounded-md hover:bg-accent-foreground/10 text-muted-foreground hover:text-foreground transition-colors'
              title='Delete API Key'
            >
              <TrashIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor='apiKey' className='text-sm text-muted-foreground px-2'>
        OpenAI API Key
      </label>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <input
            type={showKey ? 'text' : 'password'}
            id='apiKey'
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder='sk-...'
            className='flex-1 px-3 py-1.5 bg-accent rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground'
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className='p-1.5 rounded-md hover:bg-accent-foreground/10 text-muted-foreground hover:text-foreground transition-colors'
            title={showKey ? 'Hide API Key' : 'Show API Key'}
          >
            {showKey ? (
              <EyeOffIcon className='w-4 h-4' />
            ) : (
              <EyeIcon className='w-4 h-4' />
            )}
          </button>
        </div>
        <div className='flex justify-end gap-2'>
          {apiKey && (
            <button
              onClick={() => setIsEditing(false)}
              className='px-3 py-1.5 text-sm hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors'
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!tempKey}
            className='px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}
