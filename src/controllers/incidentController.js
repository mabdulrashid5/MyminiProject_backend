const { db, storage } = require('../config/firebase');

const createIncident = async (req, res) => {
  try {
    const { type, description, location, severity } = req.body;
    const userId = req.user.uid;

    const incident = {
      type,
      description,
      location,
      severity,
      reportedBy: userId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: []
    };

    // Handle image uploads if any
    if (req.files?.length) {
      const bucket = storage.bucket();
      const imagePromises = req.files.map(async (file) => {
        const blob = bucket.file(`incidents/${Date.now()}_${file.originalname}`);
        await blob.save(file.buffer);
        return blob.publicUrl();
      });
      incident.images = await Promise.all(imagePromises);
    }

    const docRef = await db.collection('incidents').add(incident);
    
    // Add to user's reported incidents
    await db.collection('users').doc(userId).collection('reportedIncidents').doc(docRef.id).set({
      incidentId: docRef.id,
      type,
      createdAt: incident.createdAt
    });

    res.status(201).json({ id: docRef.id, ...incident });
  } catch (error) {
    console.error('Create Incident Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getIncidents = async (req, res) => {
  try {
    const { status, type, limit = 10 } = req.query;
    let query = db.collection('incidents');

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

    const incidents = [];
    snapshot.forEach(doc => {
      incidents.push({ id: doc.id, ...doc.data() });
    });

    res.json(incidents);
  } catch (error) {
    console.error('Get Incidents Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;
    const userId = req.user.uid;

    const incidentRef = db.collection('incidents').doc(id);
    const doc = await incidentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (doc.data().reportedBy !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this incident' });
    }

    await incidentRef.update({
      status,
      description,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Incident updated successfully' });
  } catch (error) {
    console.error('Update Incident Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const incidentRef = db.collection('incidents').doc(id);
    const doc = await incidentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (doc.data().reportedBy !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this incident' });
    }

    // Delete associated images from storage
    if (doc.data().images?.length) {
      const bucket = storage.bucket();
      const deletePromises = doc.data().images.map(async (imageUrl) => {
        const fileName = imageUrl.split('/').pop();
        return bucket.file(`incidents/${fileName}`).delete();
      });
      await Promise.all(deletePromises);
    }

    await incidentRef.delete();
    
    // Remove from user's reported incidents
    await db.collection('users').doc(userId)
      .collection('reportedIncidents').doc(id).delete();

    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Delete Incident Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  updateIncident,
  deleteIncident
};