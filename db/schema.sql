-- MAYALINES engagement schema for Neon/PostgreSQL.
-- Execute once in the Neon SQL editor.

CREATE TABLE IF NOT EXISTS quote_likes (
  quote_id TEXT NOT NULL,
  visitor_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (quote_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS quote_likes_quote_id_idx ON quote_likes (quote_id);
CREATE INDEX IF NOT EXISTS quote_likes_created_at_idx ON quote_likes (created_at DESC);

CREATE TABLE IF NOT EXISTS quote_copies (
  id BIGSERIAL PRIMARY KEY,
  quote_id TEXT NOT NULL,
  visitor_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quote_copies_quote_id_idx ON quote_copies (quote_id);
CREATE INDEX IF NOT EXISTS quote_copies_created_at_idx ON quote_copies (created_at DESC);

CREATE TABLE IF NOT EXISTS quote_shares (
  id BIGSERIAL PRIMARY KEY,
  quote_id TEXT NOT NULL,
  visitor_id UUID,
  channel TEXT NOT NULL DEFAULT 'native',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quote_shares_quote_id_idx ON quote_shares (quote_id);
CREATE INDEX IF NOT EXISTS quote_shares_created_at_idx ON quote_shares (created_at DESC);

CREATE TABLE IF NOT EXISTS quote_submissions (
  id BIGSERIAL PRIMARY KEY,
  quote TEXT NOT NULL CHECK (char_length(quote) BETWEEN 3 AND 2000),
  author TEXT NOT NULL CHECK (char_length(author) BETWEEN 1 AND 300),
  source TEXT CHECK (source IS NULL OR char_length(source) <= 500),
  category TEXT NOT NULL CHECK (char_length(category) BETWEEN 1 AND 80),
  submitter_name TEXT CHECK (submitter_name IS NULL OR char_length(submitter_name) <= 200),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quote_submissions_status_idx ON quote_submissions (status, created_at DESC);
