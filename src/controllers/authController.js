const { auth, db } = require('../config/firebase');

const createUser = async (req, res) => {
  try {
    const { email, password, displayName, phoneNumber } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      phoneNumber
    });

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      phoneNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName, phoneNumber } = req.body;

    // Update Auth profile
    await auth.updateUser(userId, {
      displayName,
      phoneNumber
    });

    // Update Firestore profile
    await db.collection('users').doc(userId).update({
      displayName,
      phoneNumber,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update User Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUserProfile,
  updateUserProfile
};