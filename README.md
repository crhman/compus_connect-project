# CampusConnect – Smart University Hub

Full-stack SaaS app with strict role-based and faculty-based isolation.

## Structure
- `backend/` Express + MongoDB API
- `frontend/` React + Vite + Tailwind UI

## Quick start

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Roles
- `student`: faculty-only events, groups, bookings, lost & found
- `teacher`: subjects, availability, booking decisions, faculty students
- `admin`: full system access (faculties, users, events, buses)

## Faculty isolation
All non-admin queries apply `faculty = req.user.faculty` via middleware and controller filtering.
