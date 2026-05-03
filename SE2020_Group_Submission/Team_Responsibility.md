# 5. Team Responsibility

## 5.1 Project Distribution Strategy
To ensure a balanced workload and adhere strictly to the academic assignment criteria, the project's six core modules were distributed equally among the six team members. Each member is responsible for the "Full Stack" implementation of their respective module, meaning they handled the backend Express.js route creation, MongoDB integration, and the React Native frontend mobile screen development.

## 5.2 Roles and Assignments

### Member 1: User Authentication & Account Management
**Responsibilities:**
- Configured the `/auth` and `/users` API endpoints in Express.
- Handled the bcryptjs password hashing and JWT (JSON Web Token) generation logic.
- Developed the mobile frontend `LoginScreen` (incorporating web-parity Glassmorphism UI) and the `UsersScreen` for account administration.
- Integrated `expo-secure-store` to persist authentication states securely across app restarts.

### Member 2: Tour Packages & Content Management
**Responsibilities:**
- Configured the `/packages` CRUD endpoints.
- Handled `multer` middleware configuration for processing `multipart/form-data` image uploads for travel packages.
- Developed the `PackagesScreen` in the mobile app, implementing dynamic FlatLists and Modals for creating and updating tour content dynamically.

### Member 3: Vehicle Fleet Logistics
**Responsibilities:**
- Designed the `/vehicles` REST API schema to handle unique license plates and varying vehicle types.
- Implemented status enumeration validation (`AVAILABLE`, `MAINTENANCE`) in the backend.
- Developed the mobile `VehiclesScreen`, allowing dispatchers to easily track and modify fleet statuses via mobile context menus.

### Member 4: Bookings & Reservations
**Responsibilities:**
- Developed the `/bookings` API logic mapping customers to specific travel packages or custom trips.
- Implemented state-transition safeguards (e.g., ensuring a booking cannot be set to 'CONFIRMED' without initial payment logic).
- Developed the mobile `BookingsScreen` to list, approve, and cancel bookings via React Native interface.

### Member 5: Financial Operations (Invoices)
**Responsibilities:**
- Designed the `/finance/invoices` schema handling nested line-items and auto-generated invoice strings.
- Responsible for cross-module integration (e.g., connecting a confirmed booking to an invoice trigger).
- Co-developed the mobile `FinanceScreen` component, specifically the "Invoices" tab and dynamic invoice creation form.

### Member 6: Financial Operations (Payments) & Deployment
**Responsibilities:**
- Engineered the `/finance/payments` REST API to log real-time cash, bank, or online payment gateways interactions.
- Managed the physical deployment of the `yatara-api` Node.js instance to Render.com using YAML configurations.
- Co-developed the mobile `FinanceScreen` component, specifically the "Payments" tab, and conducted final holistic E2E (End-to-End) testing on Android devices via Expo Go.
