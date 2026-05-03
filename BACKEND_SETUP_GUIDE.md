# Express.js Backend Setup Guide

## Step-by-Step Approach for Converting to Standalone Backend

### Current State
- ✅ Directories created: `backend/src/` with subdirectories
- ✅ Existing Next.js API routes in: `src/app/api/`
- ✅ Existing Mongoose models in: `src/models/`
- ✅ JWT auth logic in: `src/lib/auth.ts`

---

## Phase 1: Project Configuration

### Step 1.1: Create `backend/package.json`
**What it does:** Defines dependencies and scripts for the Express backend

**Needs:**
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- multer (file upload)
- joi (validation)
- TypeScript + dev tools

**Should I create this?** YES / NO

---

### Step 1.2: Create `backend/tsconfig.json`
**What it does:** TypeScript configuration for backend compilation

**Settings needed:**
- Output directory: `dist/`
- Source directory: `src/`
- Target: ES2020

**Should I create this?** YES / NO

---

### Step 1.3: Create `backend/.gitignore`
**What it does:** Tells Git which files to ignore (node_modules, .env, dist)

**Should I create this?** YES / NO

---

## Phase 2: Core Server Files

### Step 2.1: Create `backend/src/server.ts`
**What it does:** Main Express server entry point

**Includes:**
- Express app initialization
- Middleware setup (CORS, JSON parsing)
- MongoDB connection
- Route registration
- Error handling

**Should I create this?** YES / NO

---

### Step 2.2: Create `backend/src/config/database.ts`
**What it does:** MongoDB connection logic

**Includes:**
- Connection URI from environment variables
- Error handling
- Connection pooling

**Should I create this?** YES / NO

---

### Step 2.3: Create `backend/src/config/environment.ts`
**What it does:** Load and validate environment variables

**Includes:**
- PORT, NODE_ENV
- Database URL
- JWT secrets
- CORS settings

**Should I create this?** YES / NO

---

## Phase 3: Authentication Module

### Step 3.1: Create `backend/src/utils/jwt.ts`
**What it does:** JWT token generation & verification (extracted from web)

**Includes:**
- `signToken()` - Create JWT
- `verifyToken()` - Validate JWT
- Token types (access, refresh)

**Should I create this?** YES / NO

---

### Step 3.2: Create `backend/src/middleware/auth.ts`
**What it does:** Middleware to protect routes with JWT

**Includes:**
- `authMiddleware` - Verify token from header
- `roleMiddleware` - Check user role (admin, staff, user)

**Should I create this?** YES / NO

---

### Step 3.3: Create `backend/src/controllers/authController.ts`
**What it does:** Authentication logic (login, register, logout)

**Includes:**
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- Password hashing with bcrypt

**Should I create this?** YES / NO

---

### Step 3.4: Create `backend/src/routes/authRoutes.ts`
**What it does:** Routes for authentication endpoints

**Includes:**
- router.post('/register')
- router.post('/login')
- router.post('/logout')

**Should I create this?** YES / NO

---

## Phase 4: Core Entity CRUD (Pick one to start)

### Option A: Packages Module
Files needed:
- `backend/src/controllers/packageController.ts` (CRUD logic)
- `backend/src/routes/packageRoutes.ts` (API endpoints)

### Option B: Bookings Module
Files needed:
- `backend/src/controllers/bookingController.ts` (CRUD logic)
- `backend/src/routes/bookingRoutes.ts` (API endpoints)

### Option C: Users Module
Files needed:
- `backend/src/controllers/userController.ts` (CRUD logic)
- `backend/src/routes/userRoutes.ts` (API endpoints)

**Which module should we start with?** PACKAGES / BOOKINGS / USERS

---

## Phase 5: Utilities & Helpers

### Step 5.1: Create `backend/src/utils/validation.ts`
**What it does:** Input validation schemas (reuse from web app)

**Should I create this?** YES / NO

---

### Step 5.2: Create `backend/src/utils/errorHandler.ts`
**What it does:** Centralized error handling

**Should I create this?** YES / NO

---

### Step 5.3: Create `backend/src/middleware/errorHandler.ts`
**What it does:** Express error middleware

**Should I create this?** YES / NO

---

## Summary

**I'm ready to guide you through each step.** 

For each step, answer:
- **YES** - Create this file, show me what goes in it
- **NO** - Skip this for now
- **EXPLAIN** - Tell me more about what this does

**Start with Phase 1?** (Configuration files)

Then we'll move to Phase 2 (Server setup), Phase 3 (Auth), etc.

---

## After Setup Complete

1. Create `.env.local` with your MongoDB URI
2. Run `npm install` in backend folder
3. Run `npm run dev` to start backend on port 5000
4. Test endpoints with Postman/Thunder Client
5. Update mobile app to use backend API URL
