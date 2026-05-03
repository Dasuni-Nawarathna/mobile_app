# 7. Mobile App Architecture

## 7.1 Framework and Tooling
The mobile application is built using **React Native**, specifically utilizing the **Expo** toolchain. This allows for rapid cross-platform development (iOS and Android) using a single JavaScript/TypeScript codebase.

## 7.2 Directory Structure
The architecture adheres to a strict Separation of Concerns, organizing the React Native codebase (`yatara-mobile/src/`) logically:
- `/api` - Contains `client.js`, a centralized Axios instance configured with Interceptors to automatically inject JWT Bearer tokens into outbound network requests.
- `/context` - Houses `AuthContext.js`, which encapsulates global authentication logic (login, logout, registration) to avoid excessive prop drilling.
- `/navigation` - Contains `AppNavigator.js` utilizing `react-navigation`. It conditionally renders public or protected stacks based on global auth state.
- `/screens` - Stores the distinct, stateful React components representing the 6 module views (e.g., `HomeScreen`, `FinanceScreen`, `PackagesScreen`).

## 7.3 Navigation Strategy
The application employs a dual-navigator pattern using **React Navigation v6**:
1. **Public Stack Navigator (`PublicStack`):** 
   - A `NativeStackNavigator` configured for unauthenticated users.
   - Defaults to the `HomeScreen`, a beautifully styled, customer-facing landing page.
   - Contains a CTA button pushing the `LoginScreen` onto the stack, allowing users to authenticate while preserving a natural "Back" swipe flow.
2. **Authenticated Tab Navigator (`AppTabs`):**
   - A `BottomTabNavigator` that mounts *only* when the AuthContext verifies a valid user session.
   - Unmounts the public landing pages and grants secure access to the internal administration modules: `Dashboard`, `Users`, `Packages`, `Vehicles`, `Bookings`, and `Finance`.

## 7.4 State Management and Security
- **React Context API:** Instead of relying on heavy third-party stores like Redux for simple state, the application leverages React's native Context API. This provides a lightweight global store for user session data.
- **Persistent Storage:** `expo-secure-store` is used in tandem with the Context API. Unlike standard `AsyncStorage` which stores tokens in plain text, `secure-store` encrypts the JSON Web Token (JWT) locally on the device (using Keychain on iOS and Keystore on Android), ensuring enterprise-grade protection against session hijacking.
- **Conditional Rendering:** Screens are dynamically protected. If the encrypted token expires or is manually deleted during logout, the application's root component immediately falls back to the `PublicStack`, forcibly ejecting the user from protected administrative interfaces.
