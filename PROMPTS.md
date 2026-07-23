# AI Development Log — Hometown Motors

This log documents how I used AI tools (ChatGPT and Antigravity AI) while building **Hometown Motors**, a full-stack car dealership web application.

---

## Overview

I used AI throughout this project as a coding assistant and second pair of eyes. It helped me plan the structure, speed up repetitive coding tasks, write test cases, debug errors, and polish the UI.

I didn't rely on AI to build the application blindly. Every route, Prisma query, React component, and CSS style was something I reviewed, tested, and integrated myself. I used backend test suites (Vitest + Supertest) and TypeScript builds (`npm run build`) to make sure everything actually worked.

---

## Timeline & Prompts

### Phase 1: Project Setup & Monorepo Structure

**Goal:** Plan the folder structure and set up the monorepo for backend and frontend.

**How I used AI:** I asked for advice on setting up a pnpm workspace monorepo that keeps backend Express code separated from the frontend React code.

**Prompt Example:**
```text
I am building a full-stack car dealership app named Hometown Motors with Express.js, TypeScript, PostgreSQL, Prisma, React, and Tailwind CSS.

How should I structure the monorepo using pnpm workspaces? Show me a clean folder layout separating backend controllers, services, and repositories from frontend components, pages, and hooks.
```

**Outcome & Takeaways:** I created the workspace layout with `backend/` and `frontend/` directories. Keeping repositories, services, and controllers separated in the backend made it much easier to test later.

---

### Phase 2: Database Schema & Prisma Setup

**Goal:** Design the database models for users, vehicles, and purchases.

**How I used AI:** I asked ChatGPT to help draft the Prisma schema based on the requirements I needed (users with roles, vehicle attributes, stock levels, and purchase records).

**Prompt Example:**
```text
Help me write a Prisma schema for a car dealership.

I need:
- User model with email, password, name, and role (ADMIN or CUSTOMER)
- Vehicle model with make, model, category (SEDAN, SUV, HATCHBACK, COUPE, CONVERTIBLE, WAGON, PICKUP, VAN), year, fuelType, color, transmission, price, quantity, description, and imageUrl
- Purchase model connecting User and Vehicle with quantity, totalPrice, and timestamp
```

**Outcome & Takeaways:** Generated `backend/prisma/schema.prisma`. Using strict Enums for vehicle categories and fuel types saved time later when building search filters on the frontend.

---

### Phase 3: Setting Up TDD with Vitest

**Goal:** Set up test-driven development on the backend using Vitest and Supertest.

**How I used AI:** I used AI to help me quickly draft integration tests before implementing the actual route handlers.

**Prompt Example:**
```text
Help me implement JWT authentication using TDD in Express with Vitest and Supertest.

Write test cases for POST /api/v1/auth/register:
- Success (returns 201 and user object without password)
- Existing email (returns 409)
- Missing required fields (returns 400)
```

**Outcome & Takeaways:** Setting up Vitest and writing tests first forced me to be clear about HTTP status codes and error messages before writing Express code.

---

### Phase 4: JWT Authentication & Role Middleware

**Goal:** Implement registration, password hashing with bcrypt, JWT login tokens, and role-based route protection.

**How I used AI:** I asked AI for a clean pattern to handle JWT authentication middleware and role checking in Express.

**Prompt Example:**
```text
Write two Express middlewares in TypeScript:
1. authenticate: verify Bearer token from header and attach user to req.
2. authorize: check if req.user.role matches allowed roles like ADMIN.
```

**Outcome & Takeaways:** I created `authenticate` and `authorize` middlewares. Testing them with Supertest ensured non-admin users couldn't access admin routes like creating or deleting vehicles.

---

### Phase 5: Vehicle CRUD & Stock Management

**Goal:** Build endpoints for listing vehicles (with search, category/fuel filters, price ranges, and pagination), creating, updating, deleting, restocking, and purchasing.

**How I used AI:** I asked AI to help write the Prisma filter query logic for combining multiple optional search parameters.

**Prompt Example:**
```text
How do I construct a Prisma findMany query in TypeScript that optionally filters by search string (make or model), category enum, fuelType, price range, and handles limit/offset pagination?
```

**Outcome & Takeaways:** Built `vehicle.service.ts` and `vehicle.controller.ts`. I also added atomic stock decrementing when a vehicle is purchased so two users buying at the same time don't cause negative inventory.

---

### Phase 6: Frontend Setup & Axios Client

**Goal:** Set up the React 19 app with React Router, Tailwind CSS, shadcn/ui, and an Axios client.

**How I used AI:** I used AI to generate an Axios instance with request and response interceptors.

**Prompt Example:**
```text
Create an Axios client in src/api/axios.ts for React.

I need:
- Base URL from VITE_API_URL
- Request interceptor that attaches Authorization Bearer token from localStorage
- Response interceptor that catches 401 error, removes token, and redirects to login
```

**Outcome & Takeaways:** Keeping token handling inside Axios made the rest of the frontend much cleaner because component code didn't have to manually check or attach headers.

---

### Phase 7: Redesigning Authentication Pages

**Goal:** Turn standard login and register pages into a luxury automotive split-screen experience (inspired by Porsche, Tesla, and BMW).

**How I used AI:** I asked AI to help build a 60/40 hero split layout with high-contrast text and dark glassmorphic badges.

**Prompt Example:**
```text
Redesign LoginPage.tsx and RegisterPage.tsx in React with Tailwind.

I want:
- Desktop split layout: 60% Hero image on left, 40% Auth form card on right for Login.
- Flip it for Register: 40% Auth form card on left, 60% Hero image on right.
- High contrast headline text so it is easy to read over dark car photos.
- Simplified header showing logo and "Back to Home".
```

**Outcome & Takeaways:** Built cohesive split-screen auth pages. I had to tweak the text colors manually because AI initially used dark gradient text that blended into the dark background. Changing the text to pure white made it look much cleaner.

---

### Phase 8: Customer Vehicle Catalog & Purchase Flow

**Goal:** Build the home page showcase, vehicle catalog with search and filters, vehicle detail page, and purchase modal.

**How I used AI:** I asked for UI component ideas for rendering vehicle cards with specs and stock status badges.

**Prompt Example:**
```text
Review this VehicleCard component and suggest improvements for a luxury car dealership look.

I want:
- Flush top image container
- Category tag overlay
- Stock status badges (In Stock, Low Stock, Out of Stock)
- Attribute chips for Year, Fuel Type, and Transmission
- Primary CTA button with hover animation
```

**Outcome & Takeaways:** Created `VehicleCard.tsx` and the purchase dialog. I fixed an issue where the top padding of shadcn Card was causing a gap above the image by adding `p-0 pt-0 gap-0` to the card container.

---

### Phase 9: Admin Dashboard & Inventory Operations

**Goal:** Build the admin section with dashboard stats, category distribution charts, data tables, and restock dialogs.

**How I used AI:** I asked AI for ideas on creating a simple SVG category distribution chart and a restock dialog modal.

**Prompt Example:**
```text
Help me build an Admin Dashboard in React with:
- Stat cards (Total Vehicles, Low Stock Count, Valuation)
- SVG progress bar chart for category breakdown
- Vehicle management table with edit, delete, and restock buttons
```

**Outcome & Takeaways:** Built `DashboardPage.tsx`, `VehicleManagementPage.tsx`, and `RestockDialog.tsx`. Adding a dedicated restock modal saved admins from opening the full edit form just to update stock quantities.

---

### Phase 10: UI/UX & Legibility Adjustments

**Goal:** Improve contrast, badge readability, and visual hierarchy across all pages.

**How I used AI:** I asked AI to help debug visual contrast issues where badges and car type icons were blending into dark car images.

**Prompt Example:**
```text
The car category badge icon inside VehicleCard is black and not visible over the dark background photo. How can I fix the text and icon color to be solid white?
```

**Outcome & Takeaways:** Replaced low-contrast classes with solid high-contrast badges (`bg-amber-500 text-slate-950 font-bold`) and white icons (`CarIcon className="text-white"`).

---

### Phase 11: Making the App Responsive

**Goal:** Ensure the app looks great on mobile, tablet, and desktop screens.

**How I used AI:** I asked AI for assistance in building a responsive mobile navigation drawer menu.

**Prompt Example:**
```text
How do I add a mobile navigation slide-out drawer in Navbar.tsx that opens with a hamburger button on screens smaller than 768px?
```

**Outcome & Takeaways:** Updated `Navbar.tsx` and grid layouts across all pages (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Mobile screens hide the 60% hero split image on auth pages and center the form card automatically.

---

### Phase 12: Refactoring & Build Check

**Goal:** Clean up duplicate code, create formatting utilities, and ensure the frontend compiles with zero errors.

**How I used AI:** I used AI to check for duplicate code and refactor currency formatting into a shared helper.

**Prompt Example:**
```text
Refactor price formatting into a shared utility function formatCurrency(price) that handles USD formatting cleanly.
```

**Outcome & Takeaways:** Created `src/utils/format.ts`. Ran `npm run build` (`tsc -b && vite build`) to verify that all components, pages, and hooks compiled without TypeScript errors.

---

### Phase 13: Database Seeding & Documentation

**Goal:** Populate the database with 50 real vehicles with matching images and write documentation.

**How I used AI:** I asked AI to help generate a seed script with 50 realistic car models, specs, and matching Unsplash image URLs.

**Prompt Example:**
```text
Help me expand seed.ts to seed 50 real vehicles (Toyota Camry, Tesla Model 3, Porsche 911, Ford F-150, etc.) with accurate categories, prices, specs, and matching Unsplash car photos so pagination works across multiple pages.
```

**Outcome & Takeaways:** Ran `npx tsx src/seed.ts` to populate 50 real car entries across 9 pages of pagination. I also wrote `README.md` documenting the tech stack, API endpoints, setup instructions, and screenshot links.

---

## How I Used AI

Here is a summary of what AI helped me with during this project:

- **Structure & Layout:** Brainstorming monorepo setups, repository pattern layers, and component hierarchy.
- **Boilerplate Code:** Speeding up repetitive Express controllers, Zod schemas, and React form fields.
- **Test Generation:** Writing initial Vitest test cases and Supertest request expectations.
- **Troubleshooting:** Figuring out why tests failed, fixing Vite build warnings, and resolving CSS contrast issues.
- **UI Tweaks:** Suggesting layout styles, responsive Tailwind utility classes, and glassmorphism overlays.

---

## My Role & Hands-On Work

AI helped speed things up, but I was responsible for making the application work properly:

- **Logic & Edge Cases:** I wrote the actual stock validation rules, role permission checks, and purchase flows.
- **Reviewing AI Code:** I caught and fixed several AI mistakes, like dark text gradients on black backgrounds, missing top padding fixes on card containers, and broken path aliases.
- **Testing & Debugging:** I ran the Vitest test runner (72 passing backend tests), tested API endpoints locally, and verified UI flows in the browser.
- **Final Decisions:** I chose the tech stack, designed the visual style, structured the database models, and decided how the application should behave.

---

## Reflection

Using AI during this project saved me a lot of time on repetitive boilerplate and syntax lookups. However, it also showed me that AI code cannot be accepted blindly. 

AI frequently suggested CSS classes that looked bad on dark backgrounds or missed edge cases in stock logic. Having a strong test suite and verifying everything manually ensured that the project stayed clean, well-structured, and fully working.
