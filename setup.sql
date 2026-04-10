-- Run this script in MySQL before starting the server
-- Command: mysql -u root -p < setup.sql

-- Create database
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT         NOT NULL,
  longitude   FLOAT         NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Optional: seed some sample data for testing
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Delhi Public School',    'Sector 45, Gurugram, Haryana',         28.4089, 77.0490),
  ('Kendriya Vidyalaya',     'IIT Campus, Powai, Mumbai',            19.1334, 72.9133),
  ('St. Xavier School',      'Park Street, Kolkata, WB',             22.5535, 88.3522),
  ('Ryan International',     'Bannerghatta Road, Bangalore',         12.8830, 77.5967),
  ('DAV Public School',      'Bhopal, Madhya Pradesh',               23.2599, 77.4126);
