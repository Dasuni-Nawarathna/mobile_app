# 3. Database Schema

## 3.1 Design Decisions
The database is structured in MongoDB utilizing Mongoose Object Data Modeling (ODM). A NoSQL document-based approach was deliberately chosen because travel data is highly variable. For instance, a vehicle document has different fields than a user profile, and nested arrays (such as destinations within a tour package) are far more efficient to query in a single BSON document than executing multi-table SQL joins.

## 3.2 Core Collections & Fields

### 1. Users Collection
Stores authentication and profile data.
- `_id`: ObjectId (Primary Key)
- `name`: String (Required, Trimmed)
- `email`: String (Required, Unique, Lowercase)
- `passwordHash`: String (Required, `select: false` by default for security)
- `phone`: String
- `role`: Enum (`ADMIN`, `STAFF`, `USER`, `VEHICLE_OWNER`, `HOTEL_OWNER`)
- `status`: Enum (`ACTIVE`, `DISABLED`, `PENDING_APPROVAL`)

### 2. Packages Collection (Tours & Content)
Stores the physical travel products sold by Yatara Ceylon.
- `_id`: ObjectId
- `title`: String (Required)
- `description`: String
- `price`: Number (LKR)
- `durationDays`: Number
- `destinations`: Array of Strings
- `image`: String (URL path to uploaded asset)

### 3. Vehicles Collection (Fleet Logistics)
Manages the chauffeur-driven fleet.
- `_id`: ObjectId
- `make`: String (e.g., Toyota)
- `model`: String (e.g., Prius)
- `plateNumber`: String (Unique, Required)
- `type`: Enum (`CAR`, `VAN`, `SUV`, `BUS`, `TUK_TUK`)
- `seats`: Number
- `status`: Enum (`AVAILABLE`, `MAINTENANCE`, `UNAVAILABLE`)

### 4. Bookings Collection
Maps users to specific packages or vehicles.
- `_id`: ObjectId
- `bookingNo`: String (Unique, Auto-generated)
- `customerName`: String (Required)
- `email`: String
- `totalCost`: Number
- `type`: Enum (`PACKAGE`, `VEHICLE`, `CUSTOM`)
- `status`: Enum (`NEW`, `PAYMENT_PENDING`, `CONFIRMED`, `CANCELLED`)

### 5. Invoices Collection (Finance A)
Handles billing generation.
- `_id`: ObjectId
- `invoiceNo`: String (Unique)
- `totalAmount`: Number
- `lineItems`: Array of Sub-documents `{ description, amount }`
- `status`: Enum (`DRAFT`, `FINAL`, `VOID`)

### 6. Payments Collection (Finance B)
Records completed transactions.
- `_id`: ObjectId
- `amount`: Number
- `paymentMethod`: Enum (`CASH`, `ONLINE`, `BANK`)
- `type`: Enum (`PAYMENT`, `REFUND`)
- `status`: String (Default: 'COMPLETED')
