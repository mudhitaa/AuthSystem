export interface StackItem {
  name: string;
  category: string;
  color: string;
  accent: string;
  why: string;
  how: string;
  features: string[];
}

export const stack: StackItem[] = [
  {
    name: 'Express + Node.js',
    category: 'Backend',
    color: 'bg-pink-50 border-pink-200',
    accent: 'text-pink-700 bg-pink-100',
    why: 'Minimal, unopinionated web framework giving full control over middleware and routing.',
    how: 'Built 8 REST API endpoints for auth. Each request passes through validation, rate limiting, and JWT middleware before hitting the controller.',
    features: ['REST API', 'Middleware chain', 'Error handling', 'Route protection'],
  },
  {
    name: 'MongoDB + Mongoose',
    category: 'Database',
    color: 'bg-emerald-50 border-emerald-200',
    accent: 'text-emerald-700 bg-emerald-100',
    why: 'Schema-based modeling with built-in hooks for pre-save operations like password hashing.',
    how: 'User schema with pre-save hook to auto-hash passwords via bcrypt. Reset token and expiry fields managed directly on the document.',
    features: ['User schema', 'Pre-save hooks', 'Token storage', 'Indexed email field'],
  },
  {
    name: 'JSON Web Tokens',
    category: 'Authentication',
    color: 'bg-violet-50 border-violet-200',
    accent: 'text-violet-700 bg-violet-100',
    why: 'Stateless auth — no session storage needed on the server. Scales horizontally.',
    how: 'Two-token system: short-lived access token (15m) sent in Authorization header, long-lived refresh token (7d) stored in httpOnly cookie to silently renew sessions.',
    features: ['Access token 15m', 'Refresh token 7d', 'httpOnly cookie', 'Silent renewal'],
  },
  {
    name: 'Bcrypt',
    category: 'Security',
    color: 'bg-red-50 border-red-200',
    accent: 'text-red-700 bg-red-100',
    why: 'One-way hashing with salting — impossible to reverse even if the database is compromised.',
    how: 'Passwords are hashed with 12 salt rounds before storage. Login uses bcrypt.compare() which rehashes the input and compares — the real password is never stored.',
    features: ['12 salt rounds', 'One-way hash', 'Timing-safe compare', 'Pre-save hook'],
  },
  {
    name: 'Brevo',
    category: 'Email',
    color: 'bg-amber-50 border-amber-200',
    accent: 'text-amber-700 bg-amber-100',
    why: "Brevo's free tier sends 300 emails/day to any recipient via HTTPS API — no SMTP means it works on Render and other restricted hosting platforms. Unlike Resend's free tier, no recipient verification required.",
    how: 'Used for three flows: email verification on register (token hashed before DB storage, plain token in link), password reset (10 minute expiry enforced server-side), and email change re-verification. All triggered via a single sendEmail({ to, subject, html }) utility.',
    features: ['Email verification', 'Password reset', 'Email change re-verification', 'HTML templates', 'HTTPS API (no SMTP)', '300 emails/day free'],
  },
  {
    name: 'React Hook Form + Zod',
    category: 'Frontend',
    color: 'bg-blue-50 border-blue-200',
    accent: 'text-blue-700 bg-blue-100',
    why: 'RHF avoids re-renders on every keystroke. Zod provides type-safe schema validation shared across components.',
    how: 'Each auth form has a Zod schema that validates on submit. Errors surface inline per field. The same schema types flow into TypeScript for end-to-end type safety.',
    features: ['No re-renders', 'Zod schemas', 'Inline errors', 'TypeScript types'],
  },
  {
    name: 'Axios + Interceptors',
    category: 'HTTP Client',
    color: 'bg-indigo-50 border-indigo-200',
    accent: 'text-indigo-700 bg-indigo-100',
    why: 'Interceptors allow token attachment and silent refresh without touching any component code.',
    how: 'Request interceptor attaches Bearer token to every call. Response interceptor catches 401s, silently calls /refresh-token, updates localStorage, and retries the original request — the user never notices.',
    features: ['Auto token attach', 'Silent refresh', 'Retry queue', '401 handling'],
  },
  {
    name: 'express-rate-limit',
    category: 'Security',
    color: 'bg-orange-50 border-orange-200',
    accent: 'text-orange-700 bg-orange-100',
    why: 'Prevents brute force attacks on login and forgot-password endpoints.',
    how: 'Auth routes limited to 10 requests per 15 minutes per IP. General API limited to 100. Returns 429 with a clear message when exceeded.',
    features: ['10 req / 15min', 'Per IP tracking', '429 responses', 'Global + route limits'],
  },
];