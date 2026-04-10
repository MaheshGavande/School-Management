# School Management API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** for managing school data with proximity-based sorting.

---

## Features

- Add new schools with name, address, latitude, and longitude
- List all schools sorted by distance from a user-specified location (Haversine formula)
- Full input validation with descriptive error messages
- MySQL connection pooling for performance
- Ready to deploy on Railway, Render, or any Node.js host

---

## Project Structure

```
school-api/
├── config/
│   └── db.js                          # MySQL connection pool
├── src/
│   ├── index.js                       # Express app entry point
│   ├── routes.js                      # API route definitions
│   ├── controllers.js                 # Business logic
│   ├── validators.js                  # Input validation middleware
│   └── utils.js                       # Haversine distance calculator
├── setup.sql                          # Database & table creation script
├── SchoolManagement.postman_collection.json
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd school-api
npm install
```

### 2. Set Up MySQL

```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
mysql -u root -p < setup.sql
```

This creates the `school_management` database and the `schools` table automatically.

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=8080
```

### 4. Run the Server

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

Server starts at: `http://localhost:8080`

---

## Database Schema

```sql
CREATE TABLE schools (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT         NOT NULL,
  longitude   FLOAT         NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

---

## API Reference

### Base URL
```
http://localhost:8080
```

---

### GET /
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "School Management API is running",
  "version": "1.0.0"
}
```

---

### POST /addSchool

Adds a new school to the database.

**Request Body (JSON):**

| Field     | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| name      | string | Yes      | School name (non-empty)             |
| address   | string | Yes      | Full address (non-empty)            |
| latitude  | float  | Yes      | Between -90 and 90                  |
| longitude | float  | Yes      | Between -180 and 180                |

**Example Request:**
```bash
curl -X POST http://localhost:8080/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Delhi Public School",
    "address": "Sector 45, Gurugram, Haryana",
    "latitude": 28.4089,
    "longitude": 77.0490
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Sector 45, Gurugram, Haryana",
    "latitude": 28.4089,
    "longitude": 77.049
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "name is required and must be a non-empty string",
    "longitude is required"
  ]
}
```

---

### GET /listSchools

Returns all schools sorted by proximity to the user's location (nearest first).

**Query Parameters:**

| Parameter | Type  | Required | Description           |
|-----------|-------|----------|-----------------------|
| latitude  | float | Yes      | User's latitude       |
| longitude | float | Yes      | User's longitude      |

**Example Request:**
```bash
curl "http://localhost:8080/listSchools?latitude=23.2599&longitude=77.4126"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Found 5 school(s), sorted by proximity",
  "user_location": {
    "latitude": 23.2599,
    "longitude": 77.4126
  },
  "count": 5,
  "data": [
    {
      "id": 5,
      "name": "DAV Public School",
      "address": "Bhopal, Madhya Pradesh",
      "latitude": 23.2599,
      "longitude": 77.4126,
      "distance_km": 0
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Sector 45, Gurugram, Haryana",
      "latitude": 28.4089,
      "longitude": 77.049,
      "distance_km": 573.21
    }
  ]
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "latitude query parameter is required",
    "longitude query parameter is required"
  ]
}
```

---

## Distance Calculation

Uses the **Haversine formula** which computes great-circle distance between two points on Earth given their latitude/longitude. Results are in kilometres, rounded to 2 decimal places.

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
d = R × c   (R = 6371 km)
```

---

## Deployment (Railway — Recommended for Free Hosting)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MySQL plugin inside Railway
4. Set environment variables in Railway dashboard:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
5. Railway auto-detects `npm start` and deploys

**Alternative: Render.com**
1. New Web Service → Connect GitHub repo
2. Build command: `npm install`
3. Start command: `npm start`
4. Add a free PostgreSQL or use PlanetScale for MySQL

---

## Postman Collection

Import `SchoolManagement.postman_collection.json` into Postman:

1. Open Postman → Import → Upload file
2. Select `SchoolManagement.postman_collection.json`
3. Update the `base_url` collection variable to your deployed URL
4. Run all requests

Includes:
- Health check
- Add School (success case)
- Add School (missing fields — validation error)
- Add School (invalid coordinates — validation error)
- List Schools (sorted by proximity)
- List Schools (missing params — validation error)

---

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Runtime  | Node.js             |
| Framework| Express.js          |
| Database | MySQL               |
| Driver   | mysql2 (with promises) |
| Config   | dotenv              |
