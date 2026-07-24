# 🌿 GreenVerse AI – Smart Campus Sustainability & Maintenance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-emerald.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-teal.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald.svg)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google_Vision-sky.svg)](https://ai.google.dev/)

> **An Enterprise-Grade, Eco-Futuristic SaaS Platform transforming campus facilities through Artificial Intelligence, Internet of Things (IoT), Spatial GIS Mapping, and Renewable Energy Analytics.**

---

## 🏛️ Institutional Accreditation & Context

* **Institution**: Shri Phanishwar Nath Renu Engineering College (SPNREC), Araria, Bihar, India
* **Affiliation**: Department of Science, Technology & Technical Education, Government of Bihar & Bihar Engineering University (BEU), Patna
* **Internship Sponsor**: **1M1B Green Skills & Applied AI Initiative** *(Supported by Microsoft)*
* **Engineering Team**: **Sustainability Green Warriors**

---

## 🌟 Key Platform Features

### 1. ♻ Smart Waste Monitoring & Dispatches
* Ultrasonic depth sensors continuously broadcast fill percentages for campus waste bins.
* Automated pickup dispatches trigger when capacity reaches 85%, preventing litter spillage.

### 2. 💧 Smart Water Tank & Leakage Telemetry
* Continuous pressure flow sensors guard hostel overhead tanks.
* Detects underground pipe leaks early, recycling over **45,200 Liters of greywater monthly**.

### 3. ⚡ Solar Photovoltaic & Energy Analytics
* Aggregates live power yield from the **250kW solar panel array** vs campus grid utility draw.
* Optimizes HVAC and lighting loads for a **+12% renewable energy margin**.

### 4. 📍 GIS Spatial Campus Radar Map
* Interactive Leaflet 3D radar displaying exact GPS building coordinates (Library, CSE, Hostels).
* Real-time complaint heatmaps and step-by-step route guidance for maintenance technicians.

### 5. 🤖 GreenBot AI Copilot
* Glassmorphic AI assistant supporting voice speech commands, photo diagnostics, and multilingual chat.
* Powered by Google Gemini AI for instant facility troubleshooting.

### 6. 📷 Computer Vision Defect Scanner
* Student photo submissions are processed by neural vision models to draw bounding boxes around defects.
* Calculates 98.4% confidence scores to automatically categorize ticket priority.

### 7. 🛰 IoT Hardware Telemetry Mesh
* Distributed ESP32 and Arduino edge microcontrollers streaming PM2.5 AQI, temperature, and grid load 24/7.

### 8. 🏆 Green Rewards & Gamification
* Gamified eco-points leaderboards rewarding students +50 points for verified recycling and leakage reporting.

---

## 🌍 United Nations Sustainable Development Goals (SDGs)

GreenVerse AI directly advances four UN SDGs:

| Goal | Description | Platform Implementation |
| :--- | :--- | :--- |
| **SDG 7** | Clean & Affordable Energy | Solar PV array monitoring & renewable energy yield optimization |
| **SDG 9** | Industry & Innovation | Edge IoT hardware mesh & spatial GIS campus analytics |
| **SDG 11** | Sustainable Cities | Smart waste bin dispatches & AQI air quality tracking |
| **SDG 12** | Responsible Consumption | Plastic bottle recycling leaderboards & greywater recycling |

---

## 👨‍💻 Development Team ("Sustainability Green Warriors")

| Developer | Role & Specialization | Key Contributions |
| :--- | :--- | :--- |
| **Yash Kumar** | Team Leader • Full-Stack Developer • AI & Cloud | Project architecture, React/Vite frontend, Supabase DB, Gemini AI, GIS maps, security |
| **Neha Kumari** | Research & Sustainability Analyst | Environmental analysis, SDG mapping, user research, technical documentation |
| **Suraj Kumar** | Quality Assurance & Testing Engineer | Functional testing, bug reporting, performance benchmarking, UAT verification |
| **Utkarsh Raj** | UI/UX Designer & Frontend Developer | Glassmorphism design system, responsive layouts, interactive visual prototyping |

---

## 🛠️ Technology Stack Architecture

* **Frontend Framework**: React 19, Vite 8, TypeScript
* **Styling**: Tailwind CSS v4, Liquid Glassmorphism Design Primitives, Custom Keyframe Animations
* **State Management**: Zustand
* **Database & Cloud**: Supabase PostgreSQL, Realtime WebSockets, Row-Level Security (RLS)
* **Spatial GIS Mapping**: Leaflet.js
* **Artificial Intelligence**: Google Gemini AI API, Computer Vision Bounding Box Scanners
* **Animations**: Framer Motion, GSAP, Canvas Confetti

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yashkumar5224/GreenVerse-AI-Smart-Campus-Sustainability-Maintenance-Platform.git
   cd GreenVerse-AI-Smart-Campus-Sustainability-Maintenance-Platform
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` or `http://localhost:5176`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📝 License & Copyright

© 2026 **Shri Phanishwar Nath Renu Engineering College (SPNREC)** & **GreenVerse Platform**.  
Developed for the **1M1B Applied AI & Green Skills Initiative** *(Microsoft Supported)*.
