-- Application schema for a new PostgreSQL database.
-- Safe to run repeatedly: it only creates missing tables and indexes.

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS years (
  year INTEGER PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS years_one_active
  ON years (is_active)
  WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL REFERENCES years(year),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  visit_date DATE NOT NULL,
  pickup_date DATE,
  tree_count INTEGER NOT NULL CHECK (tree_count > 0),
  notes TEXT,
  tree_numbers TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'BOOKED',
  paid_to VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS reservations_year_idx ON reservations (year);
CREATE INDEX IF NOT EXISTS reservations_year_visit_date_idx ON reservations (year, visit_date);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL REFERENCES years(year),
  person VARCHAR(50) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS expenses_year_idx ON expenses (year);

CREATE TABLE IF NOT EXISTS settings (
  year INTEGER PRIMARY KEY REFERENCES years(year),
  available_days TEXT,
  max_bookings_per_day INTEGER NOT NULL DEFAULT 20 CHECK (max_bookings_per_day > 0),
  max_trees_per_season INTEGER NOT NULL DEFAULT 500 CHECK (max_trees_per_season > 0),
  retrieval_days TEXT,
  price NUMERIC NOT NULL DEFAULT 8000 CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS reservation_photos (
  id SERIAL PRIMARY KEY,
  reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_public_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS reservation_photos_reservation_id_idx
  ON reservation_photos (reservation_id);

INSERT INTO years (year, is_active)
VALUES (2026, TRUE)
ON CONFLICT (year) DO NOTHING;

INSERT INTO settings (year, max_bookings_per_day, max_trees_per_season, price)
VALUES (2026, 20, 500, 8000)
ON CONFLICT (year) DO NOTHING;
