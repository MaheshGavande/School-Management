const db = require('../config/db');
const { haversineDistance } = require('./utils');

/**
 * POST /addSchool
 * Adds a new school to the database after validation.
 */
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.cleanBody;

    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    return res.status(200).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error('Error in addSchool:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Could not add school.',
      error: error.message,
    });
  }
};

/**
 * GET /listSchools?latitude=XX&longitude=YY
 * Fetches all schools and returns them sorted by distance from user's location.
 */
const listSchools = async (req, res) => {
  try {
    const { latitude: userLat, longitude: userLon } = req.userLocation;

    const [schools] = await db.execute(
      'SELECT id, name, address, latitude, longitude FROM schools'
    );

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found in the database',
        data: [],
      });
    }

    // Calculate distance for each school and attach it
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance_km: haversineDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      ),
    }));

    // Sort ascending by distance (nearest first)
    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: `Found ${schoolsWithDistance.length} school(s), sorted by proximity`,
      user_location: { latitude: userLat, longitude: userLon },
      count: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error('Error in listSchools:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Could not fetch schools.',
      error: error.message,
    });
  }
};

module.exports = { addSchool, listSchools };
