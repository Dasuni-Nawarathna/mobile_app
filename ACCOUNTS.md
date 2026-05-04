# Yatara Ceylon — Demo Accounts

> [!IMPORTANT]
> **Master Password for all accounts**: `login123`

## **1. Admin & Staff**
Used for managing the platform, approving new users, and viewing system-wide analytics.

| Name | Email | Role | Access |
| :--- | :--- | :--- | :--- |
| Yatara Admin | `admin@yatara.com` | `ADMIN` | Full access to Control Panel & Finance |
| Saman Staff | `staff@yatara.com` | `STAFF` | User approvals and booking management |

---

## **2. Tourist / Customer**
Used for browsing packages, requesting bespoke journeys, and managing personal bookings.

| Name | Email | Role | Status |
| :--- | :--- | :--- | :--- |
| Emma Tourist | `tourist@yatara.com` | `USER` | **Active** |
| James Walker | `james@example.com` | `TOURIST` | **Active** |

---

## **3. Service Providers (Drivers)**
Used for managing fleet vehicles and viewing assigned tourist transport requests.

| Name | Email | Role | Status |
| :--- | :--- | :--- | :--- |
| Kumara Driver | `driver.verified@yatara.com` | `DRIVER` | **Active** |
| Nimal Driver | `driver.pending@yatara.com` | `DRIVER` | **Pending Approval** |

---

## **4. Service Providers (Hotels)**
Used for managing property services and packages.

| Name | Email | Role | Status |
| :--- | :--- | :--- | :--- |
| Priya Manager | `hotel.verified@yatara.com` | `HOTEL_MANAGER` | **Active** |
| Roshan Manager| `hotel.pending@yatara.com` | `HOTEL_MANAGER` | **Pending Approval** |

---

## **System Testing Guide**

1. **Self-Registration**: 
   - New users can sign up as a **Tourist** for immediate access.
   - New **Drivers** and **Hotels** will see a "Pending Approval" banner until an Admin approves them.
2. **Approval Process**:
   - Log in as `admin@yatara.com`.
   - Navigate to the **Users** screen.
   - Find the pending user and click **Approve**.
3. **Immersive UI**:
   - The app uses a "Deep Forest & Gold" premium theme.
   - Navigation is full-screen (headers hidden).
   - Guests can browse **Home** and **Explore** before logging in.
