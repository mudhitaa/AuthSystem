# MERN Auth System

A full-stack authentication system built with the MERN stack and TypeScript. The live dashboard explains every implementation detail — libraries used, why they were chosen, and a step-by-step breakdown of each auth flow.

**[Live Demo](https://authsystem-smoky.vercel.app/)** · **[GitHub](https://github.com/mudhitaa/AuthSystem)**

### Demo account
```
Email:    alice@gmail.com
Password: Alice123#
```
> Demo account is read-only — edits and password reset are blocked on both frontend and backend.

---

## Features

- Register with email verification
- Login with JWT access + refresh tokens
- Silent token renewal via httpOnly cookie
- Forgot / reset password via email link
- Edit profile (name, email with re-verification)
- Change password
- Delete account
- Protected routes (frontend guard + backend middleware)
- Rate limiting on auth endpoints
- Demo account protection

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Auth | JSON Web Tokens (access + refresh) |
| Password hashing | bcrypt (12 salt rounds) |
| Email | Brevo (transactional email API) |
| Validation | Joi (backend), Zod + React Hook Form (frontend) |
| Package manager | pnpm workspaces |
| Deployment | Render (backend), Vercel (frontend) |

---


## How auth was implemented

- **Passwords** — hashed with bcrypt before storage, never saved in plain text
- **Login** — returns a short-lived JWT (15min) + a refresh token in an httpOnly cookie (7 days)
- **Token renewal** — Axios interceptor silently refreshes expired tokens, user never notices
- **Email verification** — hashed token stored in DB, plain token sent in link — safe even if DB is breached
- **Forgot password** — same hashed token approach, expires in 10 minutes, always returns the same response to prevent email enumeration
> The dashboard includes a full interactive breakdown.

---

## Email limitations (Brevo free tier)

This project uses **Brevo** for transactional email (300 emails/day free). Since no custom domain is configured:

- Emails are sent from a Brevo shared sender address
- **Verification and reset emails may land in spam** — check your spam folder if the email doesn't arrive
- This is a known limitation of free-tier email without a verified custom domain
- For production use, connecting a custom domain to Brevo resolves deliverability issues

---

## Local setup

```bash
# Clone
git clone https://github.com/mudhitaa/AuthSystem.git
cd AuthSystem

# Install
pnpm install

# Configure
cp server/.env.example server/.env
# Fill in MONGO_URI, JWT secrets, BREVO_API_KEY, CLIENT_URL

# Run
pnpm dev
```

Frontend runs on `http://localhost:5173` · Backend on `http://localhost:5000`

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) |
| `CLIENT_URL` | Frontend URL |
| `BREVO_API_KEY` | Brevo API key for email sending |
| `EMAIL_FROM` | Sender address shown in emails |
| `DEMO_USER_ID` | MongoDB ID of demo account (blocks edits) |

## Author
Mudhita Bajracharya
https://github.com/mudhitaa
