=========================================================
YATARA CEYLON - FULL STACK MOBILE SYSTEM
Academic Project Submission - README
=========================================================

1. PROJECT OVERVIEW
Yatara Ceylon is a luxury travel and fleet management mobile application designed to interface with an existing MongoDB database. It provides administrators and staff with on-the-go CRUD capabilities across 6 core business modules, completely digitalizing operations.

2. TECH STACK
- Frontend: React Native (Expo SDK)
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB (Atlas Cloud) + Mongoose ORM
- Authentication: JWT (JSON Web Tokens), bcryptjs
- Network Client: Axios

3. FEATURES
- Secure JWT-based Authentication (Login/Register).
- Glassmorphism UI adapting premium web-design aesthetics to mobile screens natively.
- Full CRUD operations for Users, Tour Packages, Vehicles, Bookings, Invoices, and Payments.
- Dynamic Mobile Navigation using React Native Navigation (Stack & Bottom Tabs).
- Encrypted device storage for persistent login states using Expo Secure Store.

4. WEB TO MOBILE CONVERSION EXPLANATION (Crucial Context)
This project is an evolution of the existing Yatara Ceylon Next.js web application architecture, adapted strictly to a mobile-first paradigm. 
- The MongoDB schemas were preserved entirely and imported into a new, standalone Express REST API to satisfy the academic "Node.js API" requirement while retaining database continuity.
- The web UI (TailwindCSS) was recreated natively utilizing React Native `StyleSheet`, `ScrollViews`, and `KeyboardAvoidingView`.
- A centralized Axios client handles network requests, replacing standard Next.js fetch queries.

5. SETUP INSTRUCTIONS

   [Backend Setup]
   1. Open terminal and navigate to the API folder: `cd yatara-api`
   2. Install dependencies: `npm install`
   3. Ensure `.env.local` exists in the parent directory containing:
      MONGODB_URI=mongodb+srv://<user>:<pass>@...
      JWT_SECRET=your_secret_key
   4. Start development server: `npm run dev` (Runs locally on port 5000)

   [Mobile Setup]
   1. Open a new terminal and navigate to mobile app: `cd yatara-mobile`
   2. Install dependencies: `npm install`
   3. Update API_URL in `src/api/client.js` to your computer's local Wi-Fi IP address (e.g., http://192.168.1.5:5000/api) since emulators/phones cannot route `localhost`.
   4. Start the Expo bundler: `npx expo start`
   5. Scan the QR code using the Expo Go app on your physical mobile device.

6. FOLDER STRUCTURE
/yatara-api
   /src
     /models      (Mongoose Database Schemas shared from Web)
     /routes      (Express API Endpoints for 6 Modules)
     /middleware  (JWT Auth validation & Multer file uploads)

/yatara-mobile
   /src
     /api         (Axios HTTP Client Configuration)
     /context     (Global Authentication State Manager)
     /navigation  (React Navigation Stack and Tab trees)
     /screens     (React Native Mobile View Components)

7. TESTING DETAILS
- Unit testing: Backend endpoints were thoroughly verified and stress-tested using Postman and custom Node test scripts.
- Integration testing: The React Native application was tested on physical hardware (Android) via Expo Go over a local wireless network bridge to ensure network latency and UX flow functioned properly.

8. KNOWN ISSUES
- File Upload Integration: The backend supports `multipart/form-data` uploads via Multer; however, the mobile application currently passes text representations of image URLs in its JSON payload. Moving forward, full `FormData` appending in React Native is required for local image binary processing.

9. FUTURE IMPROVEMENTS
- Cloud Storage: Switch local Multer file storage to a cloud bucket (AWS S3 or Cloudinary) for ephemeral host compatibility (like Render.com).
- Global State Caching: Migrate from the native React Context API to Redux Toolkit (RTK) for more robust local caching of CRUD module lists.
