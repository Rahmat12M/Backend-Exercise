CREATE DATABASE crowds_db;

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('visitor', 'performer', 'controller')),
  position_number INT NOT NULL,
  browser TEXT NOT NULL,
  os TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (event_id, device_id)
);

CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN (
      'joined',
      'disconnected',
      'reconnected',
      'position_updated',
      'animation_triggered',
      'sound_triggered'
    )
  ),
  timestamp TIMESTAMP NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);