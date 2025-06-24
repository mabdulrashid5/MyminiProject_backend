const { db } = require('../config/firebase');

const createAlert = async (req, res) => {
  try {
    const { type, message, location, radius } = req.body;
    const userId = req.user.uid;

    const alert = {
      type,
      message,
      location,
      radius,
      createdBy: userId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('alerts').add(alert);

    res.status(201).json({ id: docRef.id, ...alert });
  } catch (error) {
    console.error('Create Alert Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const { status, type, location, limit = 10 } = req.query;
    let query = db.collection('alerts');

    if (status) {
      query = query.where('status', '==', status);
    }
    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    const alerts = [];
    snapshot.forEach(doc => {
      alerts.push({ id: doc.id, ...doc.data() });
    });

    res.json(alerts);
  } catch (error) {
    console.error('Get Alerts Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    const userId = req.user.uid;

    const alertRef = db.collection('alerts').doc(id);
    const doc = await alertRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    if (doc.data().createdBy !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this alert' });
    }

    await alertRef.update({
      status,
      message,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Alert updated successfully' });
  } catch (error) {
    console.error('Update Alert Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const alertRef = db.collection('alerts').doc(id);
    const doc = await alertRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    if (doc.data().createdBy !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this alert' });
    }

    await alertRef.delete();

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete Alert Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert
};