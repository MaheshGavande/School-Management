const express = require('express');
const router = express.Router();

const { addSchool, listSchools } = require('./controllers');
const { validateAddSchool, validateListSchools } = require('./validators');

// POST /addSchool — Add a new school
router.post('/addSchool', validateAddSchool, addSchool);

// GET /listSchools — List all schools sorted by proximity
router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
