# GreenVerse – AI Smart Campus Sustainability & Maintenance Platform
## Complete Enterprise Master Specification (v5.0)

This master specification defines the architectural requirements, database schemas, feature modules, AI integrations, GIS blueprints, and deployment guidelines for **GreenVerse**, the Smart Campus Sustainability & Maintenance Platform custom-tailored for **Shri Phanishwar Nath Renu Engineering College (SPNREC), Simraha, Araria, Bihar, India**.

---

# PART 1: Project Overview, Branding & Hero Experience

## 1. Project Overview
GreenVerse is an enterprise-grade Software-as-a-Service (SaaS) application designed to automate facility operations, resource management (energy, water, waste), and reactive/predictive maintenance across the SPNREC campus. By combining AI-powered image recognition, IoT sensor telemetry, and leaf-pulsing GIS mapping layers, the platform converts traditional administrative operations into an optimized, self-correcting sustainability ecosystem.

## 2. About GreenVerse
GreenVerse serves as the digital brain of the campus, connecting three distinct user groups:
- **Students**: Eco-warriors who scan QR codes, report facility incidents, and earn gamified points.
- **Maintenance Staff**: Ground technicians who receive dispatched tasks, navigate via radar maps, and submit photo verifications.
- **Administrators**: Facility managers who monitor campus-wide resource usage, review machine-learning predictive failures, and compile ESG auditing reports.

## 3. About SPNREC Araria
- **Institution**: Shri Phanishwar Nath Renu Engineering College (SPNREC), Simraha, Araria, Bihar, India.
- **Established**: 2019, affiliated to Bihar Engineering University (BEU) and managed by the Department of Science & Technology (DST), Government of Bihar.
- **Departments**: Civil, Mechanical, Electrical, and Electronics & Communication Engineering.
- **Key Buildings**: Academic Block, Administrative Block, Central Library, Hostels, Solar Array Plant, and Water Tank Complex.

## 4.  Vision
To establish SPNREC Araria as a premier green-engineering institution in India by utilizing applied AI, cloud computing, and IoT systems to achieve zero-waste operations and carbon-neutral efficiency.

## 5.      Mission
- To empower the student body to    actively identify infrastructure issues.
- To reduce carbon footprints and resource waste through real-time sensors and regression anomaly forecasting.
- To streamline facility maintenance via automated, verifiable, and transparent workflows.

## 6. Objectives
- Resolve 98% of reported campus maintenance complaints within a 24-hour cycle.
- Achieve a 20% reduction in campus water and electricity wastage.
- Maintain 99.9% uptime for all campus-wide IoT assets and reporting panels.

## 7. United Nations SDGs Alignment
- **SDG 6 (Clean Water and Sanitation)**: Real-time leakage flags and water tank volume sensors.
- **SDG 7 (Affordable and Clean Energy)**: Monitoring solar array production and building consumption.
- **SDG 9 (Industry, Innovation, and Infrastructure)**: GIS mapping of college assets and automated ticketing dispatch.
- **SDG 11 (Sustainable Cities and Communities)**: Campus-wide carbon emission tracking and waste segregation alerts.
- **SDG 12 (Responsible Consumption and Production)**: Gamifying waste reporting and recycling.

## 8. Technology Stack
- **Frontend**: Vite + React 19 +  TypeScript + Tailwind CSS v4 + Zustand + Framer Motion & GSAP + Chart.js.
- **Backend / Database**: Next.js Route Handlers + Prisma ORM + PostgreSQL (Production-Ready) + JWT Session Auth.
- **AI Integration**: Google Gemini API + Custom client-side failure predictors.
- **GIS Mapping**: Leaflet.js utilizing CartoDB dark-matter map layers.

## 9. UI Design System
- **Theme**: Default Dark Mode (`#090d16` canvas background) with Apple-inspired glassmorphism panels.
- **Primary Color**: Emerald Green (`#10b981`) symbolizing green campus initiatives.
- **Secondary Color**: Cyber Cyan (`#06b6d4`) representing IoT telemetry.
- **Accent Color**: Warning Amber (`#f59e0b`) indicating unresolved anomalies.
- **Typography**: `Outfit` for headlines, `Inter` for body copy/data, and `Monospace` for telemetry logs.

## 10. Premium Hero Section
- **Floating Glass Navbar**: Transparent blur menu containing links to Home, About, Features, GIS Map, and Login.
- **Visual Canvas**: Full-width cinematic background overlay with a rotating Three.js 3D earth wireframe and green/blue animated network lines.
- **Hero Badges**: Pulsing badges reflecting AI/IoT technologies, DST Government of Bihar partnerships, and Microsoft-supported 1M1B Green Skills internships.
- **CTA Buttons**: Hover-scaling primary buttons ("Launch Dashboard"), secondary video links ("Watch Demo"), and developer specs ("View Docs").
- **Real-time Stats Grid**: Glass cards displaying live counters (e.g. 10k+ Students, 500+ daily predictions, 99.9% Uptime, ESG Scores).

---

# PART 2: Portals, Roles & Feature Modules

## 11. Authentication
- Secured JWT-token session handler.
- Seeded accounts support role switching from a dropdown selector:
  - Super Admin: `superadmin@spnrec.ac.in`
  - Admin: `admin@spnrec.ac.in`
  - Staff: `staff@spnrec.ac.in`
  - Student: `student@spnrec.ac.in`
  - Guest: `guest@spnrec.ac.in`

## 12. User Roles & RBAC Matrix
| Feature / View | Student | Staff | Admin | Super Admin | Guest |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Report Complaint (AI/GIS Picker) | ✓ | ✗ | ✗ | ✗ | ✗ |
| Claim Rewards & Print ESG Certificate | ✓ | ✗ | ✗ | ✗ | ✗ |
| Accept Tasks & Upload Repair Photo | ✗ | ✓ | ✗ | ✗ | ✗ |
| Assign Tickets & Trigger Alerts | ✗ | ✗ | ✓ | ✓ | ✗ |
| View Users Directory & System Settings | ✗ | ✗ | ✓ | ✓ | ✗ |
| Provision Admin Credentials | ✗ | ✗ | ✗ | ✓ | ✗ |
| Read-Only Maps & Analytics | ✓ | ✓ | ✓ | ✓ | ✓ |

## 13. Student Portal
- **Dashboard**: Displays active rewards points, current level badge (Bronze to Diamond), and a chronological feed of their reported tickets.
- **Report Issue**: Page containing simulated AI camera uploading, voice recording presets, and a GIS location selector map.
- **Rewards Shop**: Redeem earned points for eco coupons (canteen, library print passes) and download an official ESG Green Certificate signed by the SPNREC Director.

## 14. Maintenance Portal
- **Dashboard**: Features a focused Leaflet map indicating active tickets assigned to them and a list of job requests.
- **Assigned Tasks**: Detail cards showing diagnostic parameters (AI category, estimated cost, description, voice logs). Ground staff can attach a "resolved" verification photo to update the ticket status.

## 15. Admin Portal
- **KPI Grid**: Track real-time campus metrics (Solar generation, water levels, bin capacities, AQI scores, carbon emission savings).
- **Complaint Dispatcher**: Assign tickets to registered maintenance technicians.
- **IoT Configurator**: View status columns and update coordinates or thresholds for all active sensor assets.

## 16. AI Hub & Insights
- **Duplicate Detector**: Scans active complaints within similar categories and GPS ranges, prompting admins to merge redundant tickets.
- **Predictive Maintenance Logs**: Employs regression algorithms on sensory cycles to forecast hours remaining before equipment failures (e.g. water pumps, batteries).
- **Image Recognition Preview**: Automatically extract parameters (broken furniture, water leak, garbage) from test files to demonstrate automated department routing.

## 17. GreenBot AI Assistant
- Floating chat drawer accessible globally across portals.
- Leverages the Google Gemini API (with in-browser mock fallbacks) to process questions regarding live campus telemetry (active tickets, sensor health, energy offset logs) and provide green engineering advice.

## 18. GIS Mapping Engine
- OpenStreetMap dark tiles focused on SPNREC.
- Pulsing colored indicator rings representing sensor statuses:
  - **Healthy (Cyan/Green)**: Operating normally.
  - **Warning (Amber)**: Exceeding threshold limits.
  - **Critical (Red)**: Failure detected. Requires instant maintenance.

## 19. IoT Telemetry Dashboard
- Displays real-time charts showing energy production curves, water tank drains, trash volumes, and air quality index parameters.
- Feeds live data logs to the Admin portal for anomaly tracking.

## 20. Green Rewards & Gamification
- Students accumulate 50 points per verified incident resolution.
- Levels include:
  - **Bronze**: 0 - 199 pts (Eco Novice)
  - **Silver**: 200 - 499 pts (Eco Warrior)
  - **Gold**: 500 - 999 pts (Eco Specialist)
  - **Diamond**: 1000+ pts (Eco Champion)

---

# PART 3: Database, API & Backend Architecture

## 21. Database Architecture
Designed with strict relational boundaries, foreign key references, and indexes to support high-throughput audit tracking and telemetry writes.

## 22. Database Schema (Prisma Representation)
```prisma
// Prisma Schema for GreenVerse Smart Campus Backend

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  ADMIN
  MAINTENANCE
  STUDENT
  GUEST
}

enum TicketCategory {
  ELECTRICAL
  PLUMBING
  HVAC
  WASTE
  INFRASTRUCTURE
  OTHER
}

enum TicketStatus {
  PENDING
  ACCEPTED
  IN_PROGRESS
  RESOLVED
}

enum SensorStatus {
  HEALTHY
  WARNING
  CRITICAL
}

enum SensorType {
  SMART_BIN
  SOLAR_PANEL
  WATER_TANK
  LEAKAGE
  ENERGY_METER
  AQI
}

model User {
  id            String        @id @default(uuid())
  email         String        @unique
  name          String
  role          Role          @default(STUDENT)
  avatar        String?
  dept          String?
  points        Int           @default(0)
  badge         String        @default("Eco Novice")
  created_at    DateTime      @default(now())
  updated_at    DateTime      @updatedAt
  reported      Ticket[]      @relation("ReporterRelation")
  assigned      Ticket[]      @relation("AssigneeRelation")
  audit_logs    AuditLog[]
}

model Building {
  id          String   @id @default(uuid())
  name        String   @unique
  code        String   @unique
  latitude    Float
  longitude   Float
  description String?
}

model Sensor {
  id           String       @id
  name         String
  type         SensorType
  location     String
  latitude     Float
  longitude    Float
  status       SensorStatus @default(HEALTHY)
  last_reading Float
  battery      Int          @default(100)
  unit         String
  updated_at   DateTime     @default(now())
  logs         SensorLog[]
}

model SensorLog {
  id        String   @id @default(uuid())
  sensor_id String
  sensor    Sensor   @relation(fields: [sensor_id], references: [id], onDelete: Cascade)
  value     Float
  status    String
  timestamp DateTime @default(now())
}

model Ticket {
  id               String         @id @default(uuid())
  title            String
  description      String?
  category         TicketCategory
  priority         String         @default("MEDIUM")
  status           TicketStatus   @default(PENDING)
  location         String
  latitude         Float
  longitude        Float
  reporter_id      String?
  reporter         User?          @relation("ReporterRelation", fields: [reporter_id], references: [id], onDelete: SetNull)
  reporter_name    String
  assignee_id      String?
  assignee         User?          @relation("AssigneeRelation", fields: [assignee_id], references: [id], onDelete: SetNull)
  assignee_name    String?
  image_url        String?
  after_image_url  String?
  voice_url        String?
  repair_notes     String?
  created_at       DateTime       @default(now())
  updated_at       DateTime       @updatedAt
}

model Notification {
  id         String   @id @default(uuid())
  user_id    String   // Specific user UUID or 'u-all'
  title      String
  message    String
  read       Boolean  @default(false)
  type       String   @default("INFO")
  created_at DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(uuid())
  user_id   String?
  user      User?    @relation(fields: [user_id], references: [id], onDelete: SetNull)
  action    String
  details   String?
  timestamp DateTime @default(now())
}
```

## 23. Folder Structure & Layout Guidelines
To scale into an enterprise product, components are grouped logically by domains (features vs shared utils). This avoids cluttered roots and simplifies import maps:
- `src/app/`: Routing wrappers, context providers.
- `src/components/`: Global shared views (Nav, Footer, 3D Canvas, Leaflet Map).
- `src/features/`: Contains module sub-directories:
  - `ai/`: Anomaly predictors, GreenBot interfaces.
  - `tickets/`: Incident reports, Dispatcher list, Kanban layouts.
  - `sensors/`: Live IoT meters, configurators.
  - `rewards/`: Leaderboard grids, voucher items.
  - `library/`: Search filters, checkout cards.
- `src/hooks/`: Shared state triggers (`useStore`).
- `src/services/`: API layer & simulation loops (`supabaseMock`, `simulator`).
- `src/utils/`: Formatting tools, helpers.

## 24. API Reference Documentation
### A. Authenticate User (`POST /api/auth/login`)
- **Request**:
  ```json
  { "email": "admin@spnrec.ac.in", "password": "..." }
  ```
- **Response (200)**:
  ```json
  {
    "user": { "id": "u-admin", "name": "Dr. Yashasvi Raj", "role": "ADMIN" },
    "token": "jwt-token-example"
  }
  ```

### B. Fetch Live Telemetry (`GET /api/sensors`)
- **Response (200)**:
  ```json
  [
    { "id": "solar-01", "name": "CSE Roof Array", "type": "SOLAR_PANEL", "last_reading": 184.2, "unit": "kW" }
  ]
  ```

### C. Create Incident Ticket (`POST /api/tickets`)
- **Request**:
  ```json
  {
    "title": "Water leakage in Hostel B",
    "category": "PLUMBING",
    "latitude": 26.1978,
    "longitude": 87.4940,
    "reporter_name": "Aarav Singh"
  }
  ```
- **Response (201)**:
  ```json
  { "id": "t-84920", "status": "PENDING", "created_at": "2026-07-22..." }
  ```

## 25. AI Services
- **Gemini API**: Sends the user's message accompanied by structured context JSON parameters (active tickets, solar production, water logs) to return concise sustainability instructions.
- **Image Recognition**: Simulates computer-vision routing that maps diagnostic images to target categories and estimated costs.
- **ML Failure Predictors**: Uses linear regression models to project battery depletion thresholds or water pump breakdowns.

## 26. Real-time Notification System
- Listens to Supabase channel subscriptions (`INSERT` / `UPDATE` triggers).
- Emits instantaneous notification banners and increments indicator bells when:
  - A student reports a new complaint.
  - An IoT sensor enters a warning or critical threshold state.
  - An administrator assigns a task to a maintenance technician.

## 27. Sustainability Analytics
- Monitors solar offset statistics (daily production peaks vs campus loads).
- Tracks water usage (overhead supply vs consumption profiles).
- Computes carbon footprints offsets (carbon saved = solar output * conversion factor).

## 28. Automated Audit Reports & Exports
- Supports compiling ESG (Environmental, Social, and Governance) summary PDF sheets.
- Generates downloadable CSV/Excel files for active ticket listings and telemetry logs.

## 29. QR Maintenance Workflows
- Generates unique QR codes for campus equipment (overhead tanks, smart bins, solar modules).
- Scanning opens the asset details drawer directly inside student/maintenance portals, allowing users to inspect maintenance histories, check battery statuses, or file reports instantly.

## 30. Smart Library Management
- Search catalogue for BEU engineering textbooks.
- Renders occupancy gauges for digital reading rooms based on live energy telemetry.
- Dispatches reservation checkout QR passes to student devices.

---

# PART 4: Verification, Security & Deployment

## 31. Three.js Experience
- Interactive 3D rotating earth wireframe rendered directly inside the hero landing page.
- Animated green and blue nodes representing satellite orbits and campus connectivity grids.
- Optimized canvas loops matching browser requestAnimationFrame frames for lag-free rendering.

## 32. Dashboard UI Designs
- Modeled on a dark-slate theme with border overlays, glassmorphic panels, and neon accent dividers.
- Responsive grids scale panels to fit mobile viewports, tablets, laptops, and wide screens.

## 33. Team Section
- Lists members of the Green Warriors Sustainability Team:
  - **Yash Kumar**: Team Leader & Full Stack Developer
  - **Neha Kumari**: Research & Sustainability Analyst
  - **Suraj Kumar**: QA & Testing
  - **Utkarsh Raj**: UI/UX Designer

## 34. About Us Section
- Highlights the establishing history of SPNREC Araria (est. 2019) and the platform's vision to align the campus with United Nations SDG goals.

## 35. Footer Specification
- Clear links to institutional pages, DST Government of Bihar portals, Microsoft-supported 1M1B programs, and developer contact details.

## 36. Security Policies
- **Role-Based Access Control (RBAC)**: Protects views using router middleware checks.
- **SQL Injection Protection**: Prisma parameterizes all database queries.
- **Cross-Site Scripting (XSS)**: Escapes outputs in React views.
- **Secure Headers**: Employs Helmet-equivalent headers to shield sessions from intercept attacks.

## 37. Deployment Architecture
- **Development**: SQLite database with local storage database mocks.
- **Production**: PostgreSQL instance hosted on Supabase, with Next.js compiled and deployed via Vercel.
- **Media CDN**: Static assets and uploaded images are hosted in Supabase Storage buckets.

## 38. Testing Strategy
- **Unit Testing**: Vitest checks for Zustand store operations and data parsers.
- **E2E Testing**: Playwright checks for user logins, ticket creations, and task dispatching steps.
- **Performance Auditing**: Lighthouse check targets: Uptime, page speed, mobile response time, and WCAG accessibility standards.

## 39. CI/CD Pipeline
- **GitHub Actions**: Triggers automated ESLint, TypeScript compiler builds, and database migration checks on pull requests.
- **Vercel Hook**: Deploys successful branch checks automatically to staging/production.

## 40. Production Checklist
- [x] Configure `.env` file with live Supabase URLs and database keys.
- [x] Populate PostgreSQL database by executing `supabase/schema.sql`.
- [x] Set up Google Gemini API key to activate streaming responses.
- [x] Run `npm run build` to confirm a warning-free compilation.
- [x] Validate cross-device responsiveness and accessibility parameters.
