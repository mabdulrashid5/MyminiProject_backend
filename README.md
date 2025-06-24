# RoadWatch Backend API

Backend service for the RoadWatch mobile app built with Node.js, Express, and Firebase.

## Features

- User Authentication
- Incident Management
- Emergency Alerts
- Image Upload Support
- Real-time Updates

## Prerequisites

- Node.js (v14 or higher)
- Firebase Account
- Firebase Admin SDK credentials

## Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd roadwatch-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure Firebase:
   - Create a new Firebase project
   - Generate a new private key for the Admin SDK
   - Copy the `.env.example` file to `.env`
   - Update the `.env` file with your Firebase credentials

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Incidents
- POST `/api/incidents` - Create a new incident
- GET `/api/incidents` - Get all incidents
- PUT `/api/incidents/:id` - Update an incident
- DELETE `/api/incidents/:id` - Delete an incident

### Alerts
- POST `/api/alerts` - Create a new alert
- GET `/api/alerts` - Get all alerts
- PUT `/api/alerts/:id` - Update an alert
- DELETE `/api/alerts/:id` - Delete an alert

## Environment Variables

Create a `.env` file with the following variables:

\`\`\`
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_STORAGE_BUCKET=your-storage-bucket
NODE_ENV=development
\`\`\`

## Project Structure

\`\`\`
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── routes/         # API routes
└── index.js        # Entry point
\`\`\`

## Development

Start the development server with hot reload:
\`\`\`bash
npm run dev
\`\`\`

## Production

Start the production server:
\`\`\`bash
npm start
\`\`\`
