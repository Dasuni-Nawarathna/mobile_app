# 2. System Architecture

## 2.1 Architectural Overview
The Yatara Ceylon mobile system utilizes a modern Client-Server Architecture adopting the MERN stack paradigm, specifically adapted for mobile development (React Native, Express.js, Node.js, MongoDB). This decoupled architecture ensures the frontend and backend can scale independently while adhering to Clean Architecture principles.

## 2.2 Architectural Components

### 1. Presentation Layer (Mobile Client)
- **Technology:** React Native (bootstrapped with Expo).
- **Responsibility:** Handles UI/UX rendering, local state management, and user input. 
- **Tools used:** 
  - `react-navigation` for Stack and Bottom Tab routing.
  - `axios` for centralized HTTP requests.
  - `expo-secure-store` for encrypted local persistence of JSON Web Tokens.
  - React Context API for global state management (Authentication state).

### 2. Application Layer (REST API Backend)
- **Technology:** Node.js, Express.js, TypeScript.
- **Responsibility:** Acts as the secure middleware bridging the mobile client and the database. Handles business logic, request validation, authentication, and file processing.
- **Tools used:**
  - `jsonwebtoken` (JWT) for stateless authentication.
  - `bcryptjs` for secure password hashing.
  - `multer` for handling `multipart/form-data` file and image uploads.
  - `cors` for cross-origin resource sharing configuration.

### 3. Data Layer (Database)
- **Technology:** MongoDB (hosted on MongoDB Atlas), Mongoose ORM.
- **Responsibility:** A NoSQL document-oriented database chosen for its flexibility with nested travel data (e.g., packages and varying vehicle metadata). It guarantees high availability and seamless JSON-like document integration with the Express.js server.

## 2.3 Data Flow Diagram Explanation
1. **Client Request:** The React Native app dispatches an asynchronous HTTP request (GET/POST/PUT/DELETE) via Axios to the deployed API URL.
2. **Authentication Middleware:** The Express server intercepts the request. For protected routes, it verifies the JWT provided in the `Authorization: Bearer <token>` header.
3. **Route Controller:** If authorized, the router forwards the request to the specific module controller (e.g., `routes/bookings.ts`).
4. **Database Transaction:** The Mongoose ORM models the data against predefined schemas and executes the query on the MongoDB Atlas cluster.
5. **Response:** The database returns the BSON document. Express parses this into JSON format and sends it back to the mobile client with the appropriate HTTP status code (e.g., 200 OK, 201 Created, 400 Bad Request). The mobile app then updates the React state to reflect the changes in the UI.
