# Backend CRUD Modules - Team Assignment (6 Members)

## Overview
Each team member is responsible for one entity module with full CRUD operations.

---

## Module 1: Account Management & Notification Management
**Team Member:** Member 1
**Files:**
- Controllers: `userController.ts`, `notificationController.ts`
- Routes: `userRoutes.ts`, `notificationRoutes.ts`

**Endpoints:**
```
Users:
  GET    /api/users              - List all users
  POST   /api/users              - Create user
  GET    /api/users/:id          - Get user by ID
  PUT    /api/users/:id          - Update user
  DELETE /api/users/:id          - Delete user

Notifications:
  GET    /api/notifications      - List notifications
  POST   /api/notifications      - Create notification
  GET    /api/notifications/:id  - Get notification
  PUT    /api/notifications/:id  - Update notification
  DELETE /api/notifications/:id  - Delete notification
```

---

## Module 2: Product & Content Management (Packages)
**Team Member:** Member 2
**Files:**
- Controllers: `packageController.ts`
- Routes: `packageRoutes.ts`

**Endpoints:**
```
Packages:
  GET    /api/packages           - List packages (filter, search, pagination)
  POST   /api/packages           - Create package
  GET    /api/packages/:id       - Get package by ID
  PUT    /api/packages/:id       - Update package
  DELETE /api/packages/:id       - Delete package
  POST   /api/packages/bulk      - Bulk operations
```

---

## Module 3: Vehicle Fleet Management
**Team Member:** Member 3
**Files:**
- Controllers: `vehicleController.ts`
- Routes: `vehicleRoutes.ts`

**Endpoints:**
```
Vehicles:
  GET    /api/vehicles           - List vehicles (filter by type, status, availability)
  POST   /api/vehicles           - Create vehicle
  GET    /api/vehicles/:id       - Get vehicle by ID
  PUT    /api/vehicles/:id       - Update vehicle
  DELETE /api/vehicles/:id       - Delete vehicle
  GET    /api/vehicles/available - Check availability for date range
```

---

## Module 4: Booking & Reservation Management
**Team Member:** Member 4
**Files:**
- Controllers: `bookingController.ts`
- Routes: `bookingRoutes.ts`

**Endpoints:**
```
Bookings:
  GET    /api/bookings           - List bookings (with filters, role-based access)
  POST   /api/bookings           - Create booking
  GET    /api/bookings/:id       - Get booking by ID
  PUT    /api/bookings/:id       - Update booking
  DELETE /api/bookings/:id       - Cancel booking
  PUT    /api/bookings/:id/status - Update booking status
```

---

## Module 5: Finance Management
**Team Member:** Member 5
**Files:**
- Controllers: `paymentController.ts`, `invoiceController.ts`
- Routes: `paymentRoutes.ts`, `invoiceRoutes.ts`

**Endpoints:**
```
Payments:
  GET    /api/payments           - List payments (with filters)
  POST   /api/payments           - Create payment
  GET    /api/payments/:id       - Get payment by ID
  PUT    /api/payments/:id       - Update payment
  DELETE /api/payments/:id       - Delete payment
  GET    /api/payments/status    - Check payment status

Invoices:
  GET    /api/invoices           - List invoices
  POST   /api/invoices           - Create invoice
  GET    /api/invoices/:id       - Get invoice
  PUT    /api/invoices/:id       - Update invoice
  DELETE /api/invoices/:id       - Delete invoice
```

---

## Module 6: Supplier/Partner Management
**Team Member:** Member 6
**Files:**
- Controllers: `partnerController.ts`, `partnerServiceController.ts`
- Routes: `partnerRoutes.ts`, `partnerServiceRoutes.ts`

**Endpoints:**
```
Partners:
  GET    /api/partners           - List partners (filter by type, status)
  POST   /api/partners           - Create partner
  GET    /api/partners/:id       - Get partner by ID
  PUT    /api/partners/:id       - Update partner
  DELETE /api/partners/:id       - Delete partner

Partner Services:
  GET    /api/partner-services   - List services
  POST   /api/partner-services   - Create service
  GET    /api/partner-services/:id - Get service
  PUT    /api/partner-services/:id - Update service
  DELETE /api/partner-services/:id - Delete service
```

---

## Implementation Steps

### Phase 1: Create Controllers (Business Logic)
Each controller should have:
- `list()` - Get with filters, pagination
- `create()` - Create new record
- `getById()` - Get single record
- `update()` - Update record
- `delete()` - Delete record
- Input validation
- Error handling

### Phase 2: Create Routes
Each route file should:
- Import controller
- Define routes
- Apply auth middleware
- Apply role middleware where needed
- Handle errors

### Phase 3: Register Routes in Server
Update `server.ts` to include all route modules

### Phase 4: Test Each Endpoint
Use Postman or similar tool to test CRUD operations

---

## Database Models (Already Exist)
- User
- Notification
- Package
- Vehicle
- Booking
- Payment
- Invoice
- Partner
- PartnerService

---

## Viva Questions to Prepare
Each team member should be able to explain:
1. How their CRUD operations work
2. How they integrated with the backend
3. Error handling & validation
4. Authentication/Authorization
5. Database schema for their entity
6. API integration with mobile app

