/**
 * Validates the request body for the addSchool API.
 * Ensures all required fields are present and have correct data types.
 */
const validateAddSchool = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;
  const errors = [];

  // Check required fields exist and are not empty strings
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }

  if (!address || typeof address !== 'string' || address.trim() === '') {
    errors.push('address is required and must be a non-empty string');
  }

  // latitude must be a number between -90 and 90
  if (latitude === undefined || latitude === null || latitude === '') {
    errors.push('latitude is required');
  } else {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('latitude must be a valid number between -90 and 90');
    }
  }

  // longitude must be a number between -180 and 180
  if (longitude === undefined || longitude === null || longitude === '') {
    errors.push('longitude is required');
  } else {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('longitude must be a valid number between -180 and 180');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitise and attach clean values to req for controller use
  req.cleanBody = {
    name: name.trim(),
    address: address.trim(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };

  next();
};

/**
 * Validates the query parameters for the listSchools API.
 */
const validateListSchools = (req, res, next) => {
  const { latitude, longitude } = req.query;
  const errors = [];

  if (latitude === undefined || latitude === '') {
    errors.push('latitude query parameter is required');
  } else {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('latitude must be a valid number between -90 and 90');
    }
  }

  if (longitude === undefined || longitude === '') {
    errors.push('longitude query parameter is required');
  } else {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('longitude must be a valid number between -180 and 180');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.userLocation = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };

  next();
};

module.exports = { validateAddSchool, validateListSchools };
