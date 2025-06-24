const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert
} = require('../controllers/alertController');

// All routes are protected
router.use(authenticateUser);

router.post('/', createAlert);
router.get('/', getAlerts);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);

module.exports = router;