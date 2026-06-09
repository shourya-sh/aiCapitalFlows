-- AI Capital Flow Observatory — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`) to provision storage
-- for the ETL pipeline output. Mirrors the TypeScript domain model in
-- src/lib/types.ts.

create table if not exists entities (
  id text primary key,
  name text not null,
  sector text not null,
  description text default '',
  headquarters text,
  country text,
  region text,
  founded int,
  "totalFundingUsd" numeric not null default 0,
  "latestValuationUsd" numeric,
  "marketCapUsd" numeric,
  "revenueUsd" numeric,
  users numeric,
  "enterpriseCustomers" numeric,
  tags text[] default '{}',
  website text,
  updated_at timestamptz default now()
);

create table if not exists funding_rounds (
  id text primary key,
  "targetId" text references entities(id) on delete cascade,
  date date not null,
  "roundType" text not null,
  "amountUsd" numeric not null,
  "valuationUsd" numeric,
  "leadInvestorId" text,
  "investorIds" text[] default '{}'
);

create table if not exists capital_flows (
  id text primary key,
  "sourceId" text references entities(id) on delete cascade,
  "targetId" text references entities(id) on delete cascade,
  "amountUsd" numeric not null,
  type text not null,
  date date not null,
  "roundId" text
);

create index if not exists idx_entities_sector on entities(sector);
create index if not exists idx_entities_region on entities(region);
create index if not exists idx_flows_source on capital_flows("sourceId");
create index if not exists idx_flows_target on capital_flows("targetId");
create index if not exists idx_flows_type on capital_flows(type);
create index if not exists idx_rounds_target on funding_rounds("targetId");

-- Read-only access for the anon role (dashboards are public).
alter table entities enable row level security;
alter table funding_rounds enable row level security;
alter table capital_flows enable row level security;

create policy "public read entities" on entities for select using (true);
create policy "public read rounds" on funding_rounds for select using (true);
create policy "public read flows" on capital_flows for select using (true);
