# Hometown Motors - Car Dealership Inventory System

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-hometown--motors.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://hometown-motors.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Live_%26_Operational-2ea44f?style=for-the-badge&logo=statuspage&logoColor=white)](https://hometown-motors.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-11.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> ### 🌐 Experience Hometown Motors Live!
>
> 🚀 **[https://hometown-motors.vercel.app](https://hometown-motors.vercel.app/)**
>
> *Explore the fully deployed automotive showroom and administrative management dashboard in real-time!*
>
> - 🚗 **Browse 50+ Vehicles**: Interactive filtering by Category, Fuel Type, Price & Transmission.
> - ⚡ **Instant Test-Drive & Order Flow**: Full customer authentication and purchase state tracking.
> - 📊 **Live Admin Panel**: Real-time stock restock alerts, inventory analytics charts, and CRUD management.

A production-ready, full-stack **Car Dealership Inventory System** built as part of a **Test-Driven Development (TDD) Kata**. The application features a luxury automotive UI/UX design inspired by Porsche, Tesla, and BMW, paired with a robust REST API backend supporting JWT Authentication, stock management, and customer purchasing flows.

---

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Why This Project Was Built](#-why-this-project-was-built)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [My AI Usage](#-my-ai-usage)
- [Test Report](#-test-report)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚗 Project Description

**Hometown Motors** is an end-to-end car dealership web application designed to deliver an automotive retail experience. Customers can explore a 50-vehicle catalog with real-time stock availability, search and filter across categories (Sedan, SUV, Pickup, Coupe, Convertible, Wagon, Van, Hatchback) and fuel types, view vehicle spec details, and complete vehicle purchases. 

Administrators have access to a management dashboard with stats, interactive inventory charts, dataset pagination, and full CRUD operations (add new models, update specs, delete vehicles, and restock inventory).

### Demonstrates:
- ⚡ **REST API Development**: Clean Express.js routing, controllers, and services.
- 🔐 **JWT Authentication**: Role-based access control (`ADMIN` vs. `CUSTOMER`) with bcrypt password hashing.
- 🧪 **Test Driven Development**: Unit and integration test suites using Vitest and Supertest.
- 🏗️ **Clean Architecture**: Decoupled repository patterns, service layers, and schema validators.
- 🎨 **Modern React Frontend**: React 19, TypeScript, React Router DOM v7, Tailwind CSS v4, and shadcn/ui.
- 🗄️ **PostgreSQL & Prisma ORM**: Relational schema design with type-safe database queries.

---

## 🎯 Why This Project Was Built

This project was engineered to demonstrate senior-level software engineering practices within a full-stack web application.

### Key Focus Areas:
- **Inventory Management**: Real-time stock decrementing, low-stock threshold badges, and restock dialogs.
- **Secure Authentication**: Protected endpoints, location-aware auth redirects, and automatic 401 token cleanup.
- **Vehicle Purchasing**: Atomic transaction flow for customer vehicle acquisition.
- **Admin Management**: Centralized management panel for inventory control and analytics.
- **Clean Software Architecture**: Separation of concerns between controllers, services, repositories, and UI components.
- **TDD Methodology**: Writing tests prior to feature implementation to enforce API contracts and edge case coverage.

---

## ✨ Features

### Backend
- ✔ **JWT Authentication**: Secure registration, login token generation, and role authorization (`ADMIN` / `CUSTOMER`).
- ✔ **Prisma ORM & PostgreSQL**: Type-safe database interactions with Neon PostgreSQL cloud hosting.
- ✔ **RESTful API Architecture**: Standardized REST endpoints with structured JSON responses.
- ✔ **Zod Input Validation**: Strict validation schemas for requests and environment configurations.
- ✔ **Global Error Handling**: Custom error classes and centralized Express error middleware.
- ✔ **Search & Filtering**: Multi-parameter database queries (make, model, category, fuel type, price range).
- ✔ **Pagination**: Efficient backend limit/offset pagination for large vehicle inventories.

### Frontend
- ✔ **Unified Luxury UI**: Porsche/Tesla-inspired visual aesthetic with glassmorphism, gradient accents, and dark modes.
- ✔ **Dynamic Catalog & Search**: Instant debounce search and multi-option vehicle filtering.
- ✔ **Vehicle Details & Specs**: Comprehensive spec display (engine, fuel, transmission, year, stock status).
- ✔ **Purchase Dialog**: Modal workflow with quantity selectors and instant stock reflection.
- ✔ **Admin Dashboard**: Analytics cards, stock distribution charts, quick action panels, and data tables.
- ✔ **Full Mobile Responsiveness**: Dynamic layouts tailored across Mobile (320px+), Tablet, Laptop, and Desktop.

### Authentication
- ✔ **Location-Aware Redirects**: Remembers attempted destination routes prior to login.
- ✔ **Distraction-Free Auth Header**: Simplified brand header for login and registration pages.
- ✔ **60/40 Split-Screen Experience**: Flipped luxury hero layouts for Login vs. Register pages.

### Customer Features
- ✔ Browse 50 real vehicle entries with high-resolution Unsplash imagery.
- ✔ Search by make or model with instant live filtering.
- ✔ Filter by vehicle category, fuel type, transmission, and price.
- ✔ One-click vehicle purchasing with instant stock updating.

### Admin Features
- ✔ Add new vehicle records with form validation.
- ✔ Edit existing vehicle specs and prices.
- ✔ Delete vehicles from inventory.
- ✔ Restock vehicle inventory quantities via interactive dialogs.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| --- | --- | --- |
| **Backend** | Express.js v5 | Fast, unopinionated web framework for Node.js |
| **Frontend** | React v19 | UI library with modern hooks and concurrent features |
| **Language** | TypeScript v5/v6 | Strongly typed JavaScript across backend and frontend |
| **Database** | PostgreSQL (Neon Cloud) | Serverless relational database system |
| **ORM** | Prisma v7 | Type-safe database client and migration tool |
| **Authentication** | JSON Web Tokens & bcrypt | Secure JWT sessions and hashed passwords |
| **Testing** | Vitest v4 & Supertest v7 | Lightning-fast unit & HTTP integration testing |
| **Styling** | Tailwind CSS v4 & shadcn/ui | Modern utility-first styling & accessible UI components |
| **Icons & Toasts** | Lucide React & Sonner | Clean SVG icon library & stackable toast notifications |
| **Form Handling** | React Hook Form & Zod | Form state management and schema validation |
| **Package Manager**| `pnpm` v11 | Fast, disk-space efficient package manager |

---

## 📁 Project Structure

```
hometown-motors/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma database schema & model definitions
│   ├── src/
│   │   ├── controllers/          # Express route request handlers
│   │   ├── errors/               # Custom HTTP error classes
│   │   ├── lib/                  # Database client initialization & helpers
│   │   ├── middleware/           # Auth, role authorization & error middleware
│   │   ├── repositories/         # Database abstraction layer
│   │   ├── routes/               # API route declarations (auth, vehicle, purchase)
│   │   ├── services/             # Core business logic layer
│   │   ├── types/                # TypeScript interfaces & types
│   │   ├── validators/           # Zod request body schemas
│   │   ├── app.ts                # Express application configuration
│   │   ├── seed.ts               # Database seed script (50 real vehicles)
│   │   └── server.ts             # Application entry point
│   ├── tests/
│   │   ├── integration/          # API endpoint integration tests (Supertest)
│   │   └── unit/                 # Service unit tests (Vitest)
│   ├── package.json              # Backend dependencies & scripts
│   └── tsconfig.json             # TypeScript configuration
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios HTTP client & API service modules
│   │   ├── components/           # UI components (common, layout, ui, vehicles)
│   │   ├── context/              # Authentication React context provider
│   │   ├── hooks/                # Custom React hooks (useAuth, usePagination, useDebounce)
│   │   ├── pages/                # Application pages (admin, auth, customer)
│   │   ├── routes/               # Protected & public route definitions
│   │   ├── types/                # Frontend TypeScript models
│   │   ├── utils/                # Formatting utilities (currency, dates)
│   │   ├── App.tsx               # Root component & routing
│   │   └── main.tsx              # Application mount entry point
│   ├── package.json              # Frontend dependencies & scripts
│   ├── vite.config.ts            # Vite build configuration
│   └── tsconfig.json             # TypeScript configuration
├── screenshots/                  # High-resolution application screenshots
├── pnpm-workspace.yaml           # pnpm workspace monorepo configuration
├── package.json                  # Root monorepo configuration
├── PROMPTS.md                    # Development prompts log
└── README.md                     # Project documentation
```

---

## 🚀 Local Setup

Follow these step-by-step instructions to get **Hometown Motors** running locally on your machine.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v11.0.0` or higher (`npm install -g pnpm`)
- **PostgreSQL Database**: Local PostgreSQL instance OR a cloud database connection string (e.g., Neon PostgreSQL)
- **Git**: Installed for version control

### 1. Clone Repository

```bash
git clone https://github.com/jpviradiya/hometown-motors.git
cd hometown-motors
```

### 2. Workspace Installation

Install dependencies across the monorepo workspace:

```bash
pnpm install
```

---

## ⚙️ Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```bash
cp .env.example .env
```

*(Or create `backend/.env` manually using the [Environment Variables](#-environment-variables) section below).*

### 3. Setup Database Schema & Seed Data

Push the Prisma schema to your PostgreSQL database and run the 50-vehicle seed script:

```bash
# Push schema to database
npx prisma db push

# Seed 50 authentic vehicles into PostgreSQL
npx tsx src/seed.ts
```

### 4. Start Development Backend Server

```bash
pnpm dev
```

The Express API backend server will launch at **`http://localhost:3000`**.

---

## 💻 Frontend Setup

### 1. Navigate to Frontend Directory

Open a new terminal window and navigate to the `frontend/` directory:

```bash
cd frontend
```

### 2. Configure Environment Variables

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Start Development Frontend Server

```bash
pnpm dev
```

The React Vite frontend server will launch at **`http://localhost:5173`**.

---

## 🔑 Environment Variables

### Backend Environment Variables (`backend/.env`)

```env
# PostgreSQL connection string for pooled connections
DATABASE_URL="postgresql://username:password@localhost:5432/hometown_motors?sslmode=require"

# Direct connection string for Prisma migrations (if using Neon/Supabase)
DIRECT_URL="postgresql://username:password@localhost:5432/hometown_motors?sslmode=require"

# Secret key used for signing JWT tokens
JWT_SECRET="super-secret-jwt-key"

# Allowed CORS origin for frontend requests
FRONTEND_URL="http://localhost:5173"
```

### Frontend Environment Variables (`frontend/.env`)

```env
# Base API URL pointing to Express backend
VITE_API_URL="http://localhost:3000/api/v1"
```

---

## 🧪 Running Tests

The backend was built following **Test-Driven Development (TDD)** methodology utilizing **Vitest** and **Supertest**.

### Backend Test Execution

Navigate to the `backend/` directory and execute the test runner:

```bash
cd backend

# Run tests in single-pass mode
npx vitest run

# Run tests in watch mode
pnpm test
```

### Test Scope:
- 🧪 **Unit Tests**: Business logic validation in `auth.service.test.ts`.
- 🌐 **Integration Tests**: Full HTTP request/response testing with Supertest for routes:
  - Auth registration (`/api/v1/auth/register`)
  - Auth login (`/api/v1/auth/login`)
  - Profile retrieval (`/api/v1/auth/me`)
  - Vehicle catalog querying (`/api/v1/vehicles`)
  - Vehicle CRUD operations (`create`, `update`, `delete`, `restock`)
  - Vehicle purchasing transactions (`/api/v1/vehicles/:id/purchase`)

*Note: Frontend tests are currently evaluated via manual end-to-end integration and static build type-checking (`npm run build`).*

---

## 🔌 API Overview

| Module | Method | Endpoint | Access | Description |
| --- | --- | --- | --- | --- |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register a new customer account |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate user & return JWT token |
| **Auth** | `GET` | `/api/v1/auth/me` | Authenticated | Fetch logged-in user profile |
| **Auth** | `GET` | `/api/v1/auth/admin` | Admin | Verify admin permissions |
| **Vehicles** | `GET` | `/api/v1/vehicles` | Public | Get paginated vehicle inventory with filters |
| **Vehicles** | `GET` | `/api/v1/vehicles/:id` | Public | Get details of a single vehicle by ID |
| **Vehicles** | `POST` | `/api/v1/vehicles` | Admin | Add a new vehicle to inventory |
| **Vehicles** | `PATCH` | `/api/v1/vehicles/:id` | Admin | Update existing vehicle specs/price |
| **Vehicles** | `DELETE` | `/api/v1/vehicles/:id` | Admin | Remove a vehicle from inventory |
| **Vehicles** | `POST` | `/api/v1/vehicles/:id/purchase` | Authenticated | Purchase vehicle (atomically decrements stock) |
| **Vehicles** | `POST` | `/api/v1/vehicles/:id/restock` | Admin | Restock vehicle inventory quantity |
| **Purchases**| `GET` | `/api/v1/purchases/me` | Authenticated | Fetch purchase history for logged-in user |

---

## 📸 Screenshots

### Home Page Showcase
![Home Page Top](screenshots/home1.png)
![Home Page Catalog](screenshots/home2.png)

### Vehicle Catalog & Filtering
![Vehicle Catalog Overview](screenshots/inventory1.png)
![Catalog Pagination](screenshots/inventory2.png)
![Search & Multi-Filter Options](screenshots/search-filter.png)
![Category Filters](screenshots/filter-vehicle.png)

### Vehicle Spec Details & Purchasing
![Vehicle Details View](screenshots/vehicle-details.png)
![Purchase Dialog Modal](screenshots/purchase-diloag.png)
![Purchase Success Toast](screenshots/purchase-success.png)

### Authentication Experience
![Luxury Login Page](screenshots/login.png)
![Luxury Register Page](screenshots/register.png)

### Admin Management Dashboard
![Admin Dashboard Overview](screenshots/admin-dashboard1.png)
![Admin Inventory Stats & Actions](screenshots/admin-dashboard2.png)

### Admin Inventory Operations
![Add Vehicle Modal Form](screenshots/add-vehicle.png)
![Add Vehicle Success Confirmation](screenshots/add-vehicle-success.png)
![Edit Vehicle Specifications](screenshots/edit-vehicle.png)
![Restock Vehicle Dialog](screenshots/vehicle-restock.png)
![Restock Success Notification](screenshots/vehicle-restock-success.png)

### Responsive Mobile Experience
![Mobile Layout 1](screenshots/responsive1.png)
![Mobile Layout 2](screenshots/responsive2.png)

---

## 🤖 My AI Usage

AI tools were utilized throughout the development lifecycle of **Hometown Motors** as a collaborative pair programmer and architectural advisor.

### AI Assistance Breakdown:
- 🏗️ **Architecture Planning**: Assisting in structuring the monorepo layout, Prisma relational schemas, and repository/service patterns.
- 🧪 **TDD Guidance**: Writing unit and integration test specifications prior to implementing business services and controllers.
- 🔍 **Code Review & Refactoring**: Identifying edge cases in stock handling, improving error handling middleware, and enforcing clean code practices.
- 🎨 **UI/UX Polish**: Designing luxury automotive visual layouts, HSL color themes, card padding calculations, and responsive Tailwind layouts.
- 🐛 **Bug Fixing & Diagnostics**: Analyzing runtime errors, Vite build warnings, and TypeScript type constraints.
- 📝 **Documentation**: Assisting in drafting structured technical summaries and documentation.

### Human Oversight & Verification:
All AI-suggested code, schemas, and configurations were **manually reviewed, refactored, tested, and validated** by the engineer prior to integration. Static compilation checks (`tsc -b && vite build`) and runtime API verifications were executed after every iteration to ensure software quality and reliability.

> **Reflection**: Leveraging AI as an intelligent assistant accelerated implementation speed while strictly preserving software architecture, code quality, and engineering standards.

---

## 📊 Test Report

The backend architecture of **Hometown Motors** was developed using **Test-Driven Development (TDD)** practices.

- 🛠️ **Test Framework**: Vitest v4
- 🌐 **HTTP Assertion Library**: Supertest v7
- 📦 **Test Types**: Unit Tests (Service Layer) & Integration Tests (HTTP Endpoint Routes)
- ✅ **Status**: All backend test suites execute cleanly and pass without errors.

```
 RUN  v4.1.10 /backend

 ✓ tests/integration/vehicle/get-vehicles.test.ts (19 tests)
 ✓ tests/integration/vehicle/update-vehicle.test.ts (10 tests)
 ✓ tests/integration/vehicle/create-vehicle.test.ts (13 tests)
 ✓ tests/integration/auth/register.test.ts (8 tests)
 ✓ tests/unit/services/auth.service.test.ts (4 tests)
 ✓ tests/integration/vehicle/purchase-vehicle.test.ts (4 tests)
 ✓ tests/integration/vehicle/delete-vehicle.test.ts (4 tests)
 ✓ tests/integration/vehicle/restock-vehicle.test.ts (4 tests)
 ✓ tests/integration/auth/login.test.ts (3 tests)
 ✓ tests/integration/vehicle/get-my-purchases.test.ts (1 test)
 ✓ tests/integration/auth/me.test.ts (2 tests)

 Test Files  11 passed (11)
      Tests  72 passed (72)
```

---

## 🔮 Future Improvements

- 🌟 **Customer Favorites & Wishlist**: Allow customers to bookmark vehicles to personal wishlists.
- ☁️ **Cloud Image Uploads**: Integrate AWS S3 or Cloudinary for direct image uploads in the Admin panel.
- 💳 **Stripe Payment Gateway**: Process real credit card transactions during vehicle purchases.
- 📧 **Automated Email Receipts**: Send PDF purchase receipts via Nodemailer/SendGrid.
- 🐳 **Docker & Docker Compose**: Containerize backend and frontend for unified single-command deployment.
- 🔄 **GitHub Actions CI/CD**: Automated testing pipeline running Vitest and Vite build on every pull request.
- 📈 **Advanced Sales Analytics**: Real-time revenue charts, popular category graphs, and sales reporting for Admins.


---

## 📄 License

This project is open-source software licensed under the **[ISC License](LICENSE)**.
