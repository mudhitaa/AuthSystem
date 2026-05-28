export interface Feature {
  label: string;
  description: string;
  category: string;
}

export const features: Feature[] = [
  { label: 'User registration', description: 'Name, email, password with Joi server validation', category: 'Core' },
  { label: 'Email verification', description: 'Crypto token hashed before storage, verified on click', category: 'Core' },
  { label: 'JWT login', description: 'Returns access token + sets httpOnly refresh cookie', category: 'Core' },
  { label: 'Silent token refresh', description: 'Axios interceptor transparently renews expired tokens', category: 'Core' },
  { label: 'Forgot password', description: 'Secure email link with 10 minute expiry', category: 'Core' },
  { label: 'Password reset', description: 'Token validated + wiped after single use', category: 'Core' },
  { label: 'Protected routes', description: 'Frontend guard + backend middleware double protection', category: 'Security' },
  { label: 'Password hashing', description: 'bcrypt with 12 salt rounds, never stored in plain text', category: 'Security' },
  { label: 'Rate limiting', description: '10 req/15min on auth routes, 100 globally', category: 'Security' },
  { label: 'httpOnly cookies', description: 'Refresh token inaccessible to JavaScript — XSS resistant', category: 'Security' },
  { label: 'Email enumeration protection', description: 'Forgot password returns same message regardless of email existence', category: 'Security' },
  { label: 'CORS configured', description: 'Only frontend origin allowed, credentials enabled', category: 'Security' },
  { label: 'TypeScript end-to-end', description: 'Strict types on both frontend and backend', category: 'Code Quality' },
  { label: 'Zod + RHF forms', description: 'Type-safe schemas, inline errors, no re-renders', category: 'Code Quality' },
  { label: 'Centralised error handler', description: 'All Express errors caught and formatted consistently', category: 'Code Quality' },
  { label: 'Edit profile + change password', description: 'Full profile management from dashboard', category: 'Features' },
  { label: 'New email verification', description: 'Email verification for updated email addresses', category: 'Features' },
];

export const categories = [...new Set(features.map((f) => f.category))];

export const categoryColors: Record<string, string> = {
  Core: 'text-blue-700 bg-blue-50 border-blue-200',
  Security: 'text-red-700 bg-red-50 border-red-200',
  'Code Quality': 'text-violet-700 bg-violet-50 border-violet-200',
  Features: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};