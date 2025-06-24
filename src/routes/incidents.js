const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  createIncident,
  getIncidents,
  updateIncident,
  deleteIncident
} = require('../controllers/incidentController');

// All routes are protected
router.use(authenticateUser);

router.post('/', createIncident);
router.get('/', getIncidents);
router.put('/:id', updateIncident);
router.delete('/:id', deleteIncident);

module.exports = router;