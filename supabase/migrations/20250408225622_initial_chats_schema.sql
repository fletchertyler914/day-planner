-- Create chats table
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  messages jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS but make it open
alter table public.chats enable row level security;

-- Create policy to allow all operations
create policy "Enable all operations for all users" on public.chats
  for all
  using (true)
  with check (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger handle_updated_at
  before update on public.chats
  for each row
  execute procedure public.handle_updated_at(); 
