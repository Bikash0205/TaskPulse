# TaskPulse — Enterprise Velocity Engine

Production-ready enterprise task synchronization and colleague workload platform with Next.js 15 App Router (Web), React Native Expo (Mobile), and Firebase RBAC.

---

## 1. Production Architecture Overview

* **Web Application (`web/`)**: Next.js 15, React 19, Tailwind CSS (Light & Dark theme), Framer Motion.
* **Mobile Application (`mobile/`)**: React Native 0.76, Expo SDK 52, Reanimated 3.
* **Backend (`functions/` & `firestore.rules`)**: Firebase Auth (Google OAuth), Cloud Firestore real-time sync, Cloud Functions for Custom Claims RBAC.

---

## 2. Step-by-Step Production Deployment

### Step 1: Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Under **Authentication** &rarr; **Sign-in method**, enable **Google**.
3. Under **Firestore Database**, create a database in production mode.
4. Install the Firebase CLI and log in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
5. Link your project:
   ```bash
   firebase use --add <your-firebase-project-id>
   ```
6. Deploy the Firestore security rules, indexes, and Cloud Functions:
   ```bash
   firebase deploy --only firestore,functions
   ```

---

### Step 2: Web Application Deployment

#### Option A: Deploy to Vercel (Recommended for Next.js)
1. Import the repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `web`.
3. Add the following Environment Variables in the Vercel Project Settings:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```
4. Click **Deploy**.

#### Option B: Deploy via Docker (Google Cloud Run / AWS ECS)
```bash
cd web
docker build -t taskpulse-web .
docker run -p 3000:3000 taskpulse-web
```

---

### Step 3: Mobile Application Deployment (Expo EAS)

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   npm install -g eas-cli
   eas login
   ```
2. Configure project:
   ```bash
   eas project:init
   ```
3. Build for Production:
   * **Android** (creates `.aab` for Google Play Console):
     ```bash
     eas build --platform android --profile production
     ```
   * **iOS** (creates `.ipa` for Apple App Store / TestFlight):
     ```bash
     eas build --platform ios --profile production
     ```

---

## 3. Local Development

### Web Client
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Mobile Client
```bash
cd mobile
npm install
npx expo start
```

---

## 4. Security & Role-Based Access Control (RBAC)

The system enforces three roles via Firebase Custom Claims:

| Role | Permissions |
| :--- | :--- |
| **Admin** | Full read and write access across all organizations, departments, and tasks. |
| **Manager** | Can create, assign, and manage tasks within their department. Cannot elevate roles. |
| **Member** | Read-only access to company tasks; write access strictly limited to `progressPercentage`, `status`, `notes`, and `isBlocked` on tasks assigned to them. |
