-- Run this SQL in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid default uuid_generate_v4() primary key,
  username text unique not null,
  email text unique not null,
  password text not null,
  avatar text default '',
  role text default 'user' check (role in ('user', 'admin', 'creator')),
  created_at timestamp with time zone default now()
);

-- Videos table
create table videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text default '',
  video_url text not null,
  thumbnail_url text default '',
  duration integer default 0,
  category text default 'Other' check (category in ('Entertainment', 'Education', 'Music', 'Sports', 'Gaming', 'News', 'Technology', 'Comedy', 'Lifestyle', 'Other')),
  tags text[] default '{}',
  uploader_id uuid references users(id) on delete cascade,
  views integer default 0,
  likes integer default 0,
  is_published boolean default true,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

-- Comments table
create table comments (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references videos(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  text text not null,
  created_at timestamp with time zone default now()
);

-- Likes table
create table likes (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references videos(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(video_id, user_id)
);

-- Function to increment likes
create or replace function increment_likes(video_id_input uuid)
returns void as $$
begin
  update videos set likes = likes + 1 where id = video_id_input;
end;
$$ language plpgsql;

-- Function to decrement likes
create or replace function decrement_likes(video_id_input uuid)
returns void as $$
begin
  update videos set likes = greatest(likes - 1, 0) where id = video_id_input;
end;
$$ language plpgsql;

-- Disable Row Level Security for simplicity (enable later for production)
alter table users enable row level security;
alter table videos enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

-- Allow all operations (for the backend service key)
create policy "Allow all for users" on users for all using (true) with check (true);
create policy "Allow all for videos" on videos for all using (true) with check (true);
create policy "Allow all for comments" on comments for all using (true) with check (true);
create policy "Allow all for likes" on likes for all using (true) with check (true);
