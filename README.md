# GreenVerse – AI Smart Campus Sustainability & Maintenance Platform

GreenVerse is an enterprise-grade AI-powered Smart Campus Sustainability & Operations Management Platform custom-designed for **Shri Phanishwar Nath Renu Engineering College (SPNREC), Simraha, Araria, Bihar, India**.

This platform combines **Artificial Intelligence (AI)**, **Internet of Things (IoT)**, **Geographic Information Systems (GIS)**, and **Cloud Computing** to optimize resource consumption (water, energy), manage smart sanitation bins, and streamline reactive/predictive campus maintenance ticketing workflows.

---

## 🚀 Key Modules & Highlights

1. **CartoDB Dark-Radar Map (GIS)**: Centered on the SPNREC Araria coordinates. Markers for buildings and live IoT sensors with pulsing indicator rings reflecting status conditions (Healthy, Warning, Critical).
2. **AI Image Recognition & Voice presets**: Simulates machine-vision classification that automatically populates ticket category, department routing, repair cost estimates, and priority from diagnostic files.
3. **AI Predictive Maintenance**: Runs regression anomalies on simulated sensor deterioration loops to forecast remaining equipment hours before failures.
4. **Google Gemini Integration**: Powers **GreenBot**, the floating AI campus assistant that streams answers regarding campus telemetry or logs.
5. **Eco-Rewards Gamification**: Earn points by reporting verified complaints or participating in challenges. Features bronze-to-diamond tier badges and a printable HTML ESG Certificate signed by SPNREC administration.
6. **Smart Library Catalog**: Search CSE/ECE textbooks, check digital reservations, and get QR checkout passes.
7. **Role View Switcher**: A header dropdown widget allows developers and reviewers to switch roles in a single click, instantly swap navigation panels, and simulate dashboards without re-logging in.

---

## 🔑 Pre-Seeded Demonstration Accounts

For review and evaluation, access the platform using these pre-seeded accounts or use the **Quick Switcher** widget in the dashboard header:

* **Campus Administrator**:
  * Email: `admin@spnrec.ac.in`
  * Password: `Admin@2026`
* **Super Administrator**:
  * Email: `superadmin@spnrec.ac.in`
  * Password: `SuperAdmin@2026`
* **Maintenance Responder**:
  * Email: `staff@spnrec.ac.in`
  * Password: `Staff@2026`
* **Student Eco Warrior**:
  * Email: `student@spnrec.ac.in`
  * Password: `Student@2026`
* **Guest Reader**:
  * Email: `guest@spnrec.ac.in`
  * Password: `Guest@2026`

---

## 🛠️ Installation & Running Locally

1. **Clone or navigate to the workspace directory**:
   ```bash
   cd "C:\Users\H\Downloads\New folder"
   ```

2. **Verify Node.js Version**:
   Ensure Node.js `v18+` or `v24+` is active.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Configuration

GreenVerse contains a built-in high-fidelity client-side database simulation that runs completely in-browser with zero dependencies. To connect to a live Supabase PostgreSQL backend or run Google Gemini streaming:

1. Copy `.env.example` to `.env`.
2. Fill in the keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GEMINI_API_KEY=your-gemini-key
   ```
3. Copy the schema queries from `supabase/schema.sql` and run them directly in your Supabase SQL editor.
