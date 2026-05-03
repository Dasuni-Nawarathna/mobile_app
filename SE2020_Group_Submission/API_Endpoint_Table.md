# 4. API Endpoint Table

**Base URL:** `https://yatara-api.onrender.com/api` (Production Environment)
**Authentication Strategy:** Bearer Token (JSON Web Token) required via `Authorization` header for protected routes.

| Module Area | Method | Endpoint | Description | Request Format | Authentication Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/register` | Register a new user | `{ name, email, password, phone }` | No |
| **Auth** | POST | `/auth/login` | Authenticate & receive JWT | `{ email, password }` | No |
| **Users** | GET | `/users` | Retrieve all registered users | None | Yes (Admin/Staff) |
| **Users** | PATCH | `/users/:id` | Update user profile data | `{ name, phone }` | Yes |
| **Users** | DELETE | `/users/:id` | Soft delete/deactivate user | None | Yes (Admin) |
| **Packages**| GET | `/packages` | List all travel packages | None | No |
| **Packages**| POST | `/packages` | Create a new tour package | `{ title, description, price, durationDays }` | Yes (Staff/Admin) |
| **Packages**| PATCH | `/packages/:id` | Update package details | `{ price, durationDays }` | Yes (Staff/Admin) |
| **Packages**| DELETE | `/packages/:id` | Permanently remove package | None | Yes (Admin) |
| **Vehicles**| GET | `/vehicles` | List fleet vehicles | None | Yes |
| **Vehicles**| POST | `/vehicles` | Add new vehicle to fleet | `{ make, model, plateNumber, type }` | Yes |
| **Vehicles**| PATCH | `/vehicles/:id` | Update vehicle status/data | `{ status }` | Yes |
| **Vehicles**| DELETE | `/vehicles/:id` | Remove vehicle from fleet | None | Yes |
| **Bookings**| GET | `/bookings` | List all customer bookings | None | Yes |
| **Bookings**| POST | `/bookings` | Create a new booking | `{ customerName, email, totalCost }` | Yes |
| **Bookings**| PATCH | `/bookings/:id` | Update booking status | `{ status }` | Yes |
| **Bookings**| DELETE | `/bookings/:id` | Cancel/delete a booking | None | Yes |
| **Finance** | GET | `/finance/invoices` | List all system invoices | None | Yes |
| **Finance** | POST | `/finance/invoices` | Generate a new draft invoice | `{ invoiceNo, totalAmount }` | Yes |
| **Finance** | GET | `/finance/payments` | List all payment receipts | None | Yes |
| **Finance** | POST | `/finance/payments` | Record a new payment | `{ amount, paymentMethod }` | Yes |

*Note: For endpoints that support File Uploads (e.g., adding a package thumbnail or avatar during registration), the request must use `multipart/form-data` instead of `application/json`.*
