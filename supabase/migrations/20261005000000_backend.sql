create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar text not null default '🦅',
  avatar_url text,
  class_level smallint not null default 11 check (class_level between 9 and 12),
  phone text not null default '',
  target_exam text not null default 'JEE Main & Advanced',
  selected_subjects text[] not null default array['mathematics', 'physics', 'chemistry'],
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer not null default 1 check (level >= 1),
  streak integer not null default 0 check (streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= streak),
  last_active_date date,
  leaderboard_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles
  add column if not exists leaderboard_opt_in boolean not null default false;

create table if not exists public.user_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  topic_id text not null,
  mastery smallint not null default 0 check (mastery between 0 and 100),
  last_score smallint not null default 0 check (last_score between 0 and 100),
  attempts integer not null default 0 check (attempts >= 0),
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  is_completed boolean not null default false,
  last_studied timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.quiz_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  topic_id text not null,
  score_percent smallint not null check (score_percent between 0 and 100),
  time_spent_seconds integer not null check (time_spent_seconds >= 0),
  responses jsonb not null default '[]'::jsonb,
  earned_xp integer not null check (earned_xp >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_gaps (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  topic_id text not null,
  misconception_summary text not null,
  mastery_level smallint not null check (mastery_level between 0 and 100),
  suggested_intervention text not null,
  status text not null default 'active' check (status in ('active', 'remediated')),
  identified_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subject text not null,
  chapter text not null,
  due_date timestamptz not null,
  urgency text not null default 'normal' check (urgency in ('low', 'normal', 'medium', 'high')),
  total_questions integer not null check (total_questions > 0),
  completed_questions integer not null default 0 check (completed_questions between 0 and total_questions),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.contests (
  id text primary key,
  title text not null,
  subject text not null,
  start_time timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  prize_pool text not null
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_results enable row level security;
alter table public.knowledge_gaps enable row level security;
alter table public.notifications enable row level security;
alter table public.assignments enable row level security;
alter table public.contests enable row level security;

grant select on public.profiles, public.user_progress, public.quiz_results, public.knowledge_gaps, public.notifications, public.assignments to authenticated;
grant select on public.contests to anon, authenticated;
grant insert, update, delete on public.user_progress to authenticated;
grant update (name, avatar, avatar_url, class_level, phone, target_exam, selected_subjects, updated_at)
  on public.profiles to authenticated;
grant update (leaderboard_opt_in) on public.profiles to authenticated;
grant update (read) on public.notifications to authenticated;
revoke insert, update, delete on public.profiles from anon, authenticated;
revoke insert, update, delete on public.quiz_results from anon, authenticated;
revoke insert, update, delete on public.knowledge_gaps from anon, authenticated;
revoke insert, delete on public.notifications from anon, authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Users can manage their own progress" on public.user_progress;
create policy "Users can manage their own progress" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can read their own quiz results" on public.quiz_results;
create policy "Users can read their own quiz results" on public.quiz_results
  for select using (auth.uid() = user_id);
drop policy if exists "Users can read their own knowledge gaps" on public.knowledge_gaps;
create policy "Users can read their own knowledge gaps" on public.knowledge_gaps
  for select using (auth.uid() = user_id);
drop policy if exists "Users can read their own notifications" on public.notifications;
create policy "Users can read their own notifications" on public.notifications
  for select using (auth.uid() = user_id);
drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can read their own assignments" on public.assignments;
create policy "Users can read their own assignments" on public.assignments
  for select using (auth.uid() = user_id);
drop policy if exists "Anyone can read contests" on public.contests;
create policy "Anyone can read contests" on public.contests
  for select using (true);

insert into public.assignments (user_id, title, subject, chapter, due_date, urgency, total_questions, xp_reward)
select p.id, seed.title, seed.subject, seed.chapter, now() + seed.due_in, seed.urgency, seed.total_questions, seed.xp_reward
from public.profiles p
cross join (values
  ('Mathematics practice set', 'mathematics', 'Algebra', interval '1 day', 'high', 15, 300),
  ('Physics worked examples', 'physics', 'Laws of Motion', interval '3 days', 'medium', 10, 200),
  ('Chemistry flash drills', 'chemistry', 'Chemical Bonding', interval '5 days', 'low', 10, 250)
) as seed(title, subject, chapter, due_in, urgency, total_questions, xp_reward)
where not exists (
  select 1 from public.assignments existing
  where existing.user_id = p.id and existing.title = seed.title
);

insert into public.contests (id, title, subject, start_time, duration_minutes, prize_pool)
values
  ('phoenix-weekly-blitz', 'Phoenix Weekly Blitz', 'Mathematics & Physics', now() + interval '2 days', 60, '5,000 XP + Top Rank Badge'),
  ('jee-sprint-simulation', 'JEE Advanced Sprint Simulation', 'All Subjects', now() + interval '6 days', 180, '15,000 XP + AIR Predictor')
on conflict (id) do nothing;

create or replace view public.leaderboard as
select
  row_number() over (order by total_xp desc, created_at asc) as rank,
  id,
  name,
  'Class ' || class_level::text as class_level,
  total_xp as xp,
  streak,
  avatar,
  case
    when level >= 10 then 'Phoenix Sovereign'
    when level >= 7 then 'Solar Blaze'
    when level >= 4 then 'Crimson Wing'
    else 'Rising Ember'
  end as tier
from public.profiles
where leaderboard_opt_in = true
order by total_xp desc, created_at asc
limit 50;
grant select on public.leaderboard to anon, authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, phone, class_level, selected_subjects)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'class_level', '')::smallint, 11),
    case
      when jsonb_typeof(new.raw_user_meta_data -> 'selected_subjects') = 'array' then
        case
          when jsonb_array_length(new.raw_user_meta_data -> 'selected_subjects') > 0
          then array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'selected_subjects'))
          else array['mathematics', 'physics', 'chemistry']
        end
      else array['mathematics', 'physics', 'chemistry']
    end
  )
  on conflict (id) do nothing;
  insert into public.notifications (user_id, type, title, message)
  values (new.id, 'system', 'Welcome to PhoenixLearn', 'Your learning profile is ready. Start a topic to build your first streak.');
  insert into public.assignments (user_id, title, subject, chapter, due_date, urgency, total_questions, xp_reward)
  values
    (new.id, 'Mathematics practice set', 'mathematics', 'Algebra', now() + interval '1 day', 'high', 15, 300),
    (new.id, 'Physics worked examples', 'physics', 'Laws of Motion', now() + interval '3 days', 'medium', 10, 200),
    (new.id, 'Chemistry flash drills', 'chemistry', 'Chemical Bonding', now() + interval '5 days', 'low', 10, 250);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create or replace function public.record_quiz_submission(
  p_topic_id text,
  p_score_percent integer,
  p_time_spent_seconds integer,
  p_responses jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_prior_mastery integer := 50;
  v_attempts integer := 0;
  v_mastery integer;
  v_xp integer;
  v_speed_bonus numeric;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_topic_id is null or length(trim(p_topic_id)) = 0 or length(p_topic_id) > 160 then
    raise exception 'topic_id is required' using errcode = '22023';
  end if;
  if p_score_percent is null or p_score_percent not between 0 and 100
    or p_time_spent_seconds is null or p_time_spent_seconds not between 0 and 86400 then
    raise exception 'Invalid quiz score or time' using errcode = '22023';
  end if;
  if p_responses is null or jsonb_typeof(p_responses) is distinct from 'array' then
    raise exception 'responses must be an array' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || p_topic_id, 0));

  select mastery, attempts into v_prior_mastery, v_attempts
  from public.user_progress
  where user_id = v_user_id and topic_id = p_topic_id
  for update;

  v_prior_mastery := coalesce(v_prior_mastery, 50);
  v_attempts := coalesce(v_attempts, 0) + 1;
  v_speed_bonus := least(10, greatest(0, 10 - (p_time_spent_seconds::numeric / 60)));
  v_mastery := greatest(5, least(100, round(0.6 * p_score_percent + 0.3 * v_prior_mastery + v_speed_bonus)::integer));
  v_xp := floor(p_score_percent * 0.5)::integer + case when p_score_percent >= 80 then 50 else 20 end;

  insert into public.user_progress (
    user_id, topic_id, mastery, last_score, attempts, time_spent_seconds, is_completed, last_studied
  )
  values (
    v_user_id, p_topic_id, v_mastery, p_score_percent, v_attempts, p_time_spent_seconds, v_mastery >= 80, now()
  )
  on conflict (user_id, topic_id) do update set
    mastery = excluded.mastery,
    last_score = excluded.last_score,
    attempts = excluded.attempts,
    time_spent_seconds = public.user_progress.time_spent_seconds + excluded.time_spent_seconds,
    is_completed = public.user_progress.is_completed or excluded.is_completed,
    last_studied = now();

  insert into public.quiz_results (user_id, topic_id, score_percent, time_spent_seconds, responses, earned_xp)
  values (v_user_id, p_topic_id, p_score_percent, p_time_spent_seconds, p_responses, v_xp);

  update public.profiles set
    total_xp = total_xp + v_xp,
    level = greatest(1, floor(1 + sqrt((total_xp + v_xp)::numeric / 250))::integer),
    updated_at = now()
  where id = v_user_id;

  if v_mastery < 60 then
    insert into public.knowledge_gaps (
      user_id, topic_id, misconception_summary, mastery_level, suggested_intervention, status, identified_at
    )
    values (
      v_user_id,
      p_topic_id,
      'Low mastery detected for ' || p_topic_id || '.',
      v_mastery,
      'Review the topic concepts and attempt targeted practice questions.',
      'active',
      now()
    )
    on conflict (user_id, topic_id) do update set
      mastery_level = excluded.mastery_level,
      status = 'active',
      identified_at = now();
  else
    update public.knowledge_gaps set status = 'remediated'
    where user_id = v_user_id and topic_id = p_topic_id;
  end if;

  insert into public.notifications (user_id, type, title, message)
  values (
    v_user_id,
    'quiz_result',
    case when v_mastery >= 80 then 'Topic mastered' else 'Quiz progress saved' end,
    'Your mastery for ' || p_topic_id || ' is now ' || v_mastery || '%.'
  );

  return jsonb_build_object(
    'success', true,
    'topic_id', p_topic_id,
    'score_percent', p_score_percent,
    'new_mastery', v_mastery,
    'earned_xp', v_xp,
    'attempts', v_attempts,
    'status', case when v_mastery >= 80 then 'mastered' when v_mastery >= 60 then 'in_progress' else 'gap_detected' end
  );
end;
$$;
revoke all on function public.record_quiz_submission(text, integer, integer, jsonb) from public;
grant execute on function public.record_quiz_submission(text, integer, integer, jsonb) to authenticated;

create or replace function public.sync_user_streak()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_streak integer;
  v_longest integer;
  v_last_active date;
  v_previous_active date;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select last_active_date into v_previous_active
  from public.profiles
  where id = v_user_id
  for update;
  if not found then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;

  update public.profiles set
    streak = case
      when last_active_date = timezone('utc', now())::date then streak
      when last_active_date = timezone('utc', now())::date - 1 then streak + 1
      else 1
    end,
    longest_streak = greatest(longest_streak, case
      when last_active_date = timezone('utc', now())::date then streak
      when last_active_date = timezone('utc', now())::date - 1 then streak + 1
      else 1
    end),
    last_active_date = timezone('utc', now())::date,
    updated_at = now()
  where id = v_user_id
  returning streak, longest_streak, last_active_date
  into v_streak, v_longest, v_last_active;

  if v_previous_active is distinct from v_last_active then
    insert into public.notifications (user_id, type, title, message)
    values (
      v_user_id,
      'streak_reminder',
      'Study streak updated',
      'Your current study streak is ' || v_streak || ' day(s).'
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'streak', v_streak,
    'longestStreak', v_longest,
    'lastActiveDate', v_last_active
  );
end;
$$;
revoke all on function public.sync_user_streak() from public;
grant execute on function public.sync_user_streak() to authenticated;

create or replace function public.save_topic_progress(
  p_topic_id text,
  p_score integer,
  p_time_spent_seconds integer default 0
)
returns public.user_progress
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_prior_mastery integer := 0;
  v_attempts integer := 0;
  v_total_time integer := 0;
  v_mastery integer;
  v_record public.user_progress;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_topic_id is null or length(trim(p_topic_id)) = 0 or length(p_topic_id) > 160 then
    raise exception 'topic_id is required' using errcode = '22023';
  end if;
  if p_score is null or p_score not between 0 and 100
    or p_time_spent_seconds is null or p_time_spent_seconds not between 0 and 604800 then
    raise exception 'Invalid score or time' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || p_topic_id, 0));

  select mastery, attempts, time_spent_seconds
  into v_prior_mastery, v_attempts, v_total_time
  from public.user_progress
  where user_id = v_user_id and topic_id = p_topic_id
  for update;

  v_prior_mastery := coalesce(v_prior_mastery, 0);
  v_attempts := coalesce(v_attempts, 0) + 1;
  v_total_time := coalesce(v_total_time, 0) + p_time_spent_seconds;
  v_mastery := greatest(0, least(100, round(
    0.6 * p_score + 0.3 * v_prior_mastery + least(v_total_time::numeric / 360, 10)
  )::integer));

  insert into public.user_progress (
    user_id, topic_id, mastery, last_score, attempts, time_spent_seconds, is_completed, last_studied
  )
  values (
    v_user_id, p_topic_id, v_mastery, p_score, v_attempts, v_total_time, v_mastery >= 80, now()
  )
  on conflict (user_id, topic_id) do update set
    mastery = excluded.mastery,
    last_score = excluded.last_score,
    attempts = excluded.attempts,
    time_spent_seconds = excluded.time_spent_seconds,
    is_completed = public.user_progress.is_completed or excluded.is_completed,
    last_studied = now()
  returning * into v_record;

  return v_record;
end;
$$;
revoke all on function public.save_topic_progress(text, integer, integer) from public;
grant execute on function public.save_topic_progress(text, integer, integer) to authenticated;
