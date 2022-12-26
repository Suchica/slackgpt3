-- Drop the table if it exists
-- See https://www.postgresql.org/docs/current/sql-droptable.html
DROP TABLE IF EXISTS installations CASCADE;

-- Create Slack bot installation table
-- See https://www.postgresql.org/docs/current/sql-createtable.html
-- Composite primary key: (enterprise_id, team_id, app_id, user_id)
CREATE TABLE installations (
  id text NOT NULL PRIMARY KEY,
  is_enterprise_install boolean NOT NULL,
  enterprise_id text,
  enterprise_name text,
  team_id text,
  team_name text,
  app_id text,
  user_id text,
  user_scopes text[],
  user_token text,
  token_type text,
  bot_id text,
  bot_user_id text,
  bot_scopes text[],
  bot_token text,
  auth_version text
);

-- Set up Row Level Security
-- See https://www.postgresql.org/docs/current/ddl-rowsecurity.html
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;

-- Set up policies to allow access to the table
-- See https://www.postgresql.org/docs/current/sql-createpolicy.html
CREATE POLICY select_installations ON installations
  FOR ALL
  TO PUBLIC
  USING (true);
