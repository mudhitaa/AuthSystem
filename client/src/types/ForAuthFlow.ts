export interface Step {
  actor: 'client' | 'server' | 'db' | 'email';
  text: string;
  detail: string;
}

export interface Flow {
  id: string;
  title: string;
  color: string;
  activeColor: string;
  steps: Step[];
}

export const actorConfig = {
  client:{ label: 'Browser', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  server:{ label: 'Server', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  db:    { label: 'MongoDB', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  email: { label: 'Email', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
};

export const flows: Flow[] = [
  {
    id: 'register',
    title: 'Register + Email Verify',
    color: 'border-violet-200 bg-violet-50',
    activeColor: 'border-violet-500 bg-violet-50',
    steps: [
      { actor: 'client', text: 'Submit register form', detail: 'POST /api/auth/register with name, email, password' },
      { actor: 'server', text: 'Validate with Joi', detail: 'Checks name ≥ 2 chars, valid email, password ≥ 6 chars' },
      { actor: 'server', text: 'Check duplicate email', detail: 'Queries MongoDB — returns 400 if email already exists' },
      { actor: 'server', text: 'Hash password', detail: 'bcrypt.hash() with 12 salt rounds via Mongoose pre-save hook' },
      { actor: 'server', text: 'Generate verify token', detail: 'crypto.randomBytes(32) — stores SHA-256 hash in DB, sends plain token in email' },
      { actor: 'db', text: 'Save user document', detail: 'isVerified: false, hashed password, hashed verifyToken stored' },
      { actor: 'email', text: 'Send verification email', detail: 'Brevo API sends HTML email with verify link — token is plain in URL, SHA-256 hash stored in DB' },
      { actor: 'client', text: 'Click verify link', detail: 'GET /api/auth/verify-email/:token — server hashes token, finds match, sets isVerified: true' },
    ],
  },
  {
    id: 'login',
    title: 'Login + JWT Flow',
    color: 'border-blue-200 bg-blue-50',
    activeColor: 'border-blue-500 bg-blue-50',
    steps: [
      { actor: 'client', text: 'Submit login form', detail: 'POST /api/auth/login with email + password' },
      { actor: 'server', text: 'Find user by email', detail: 'User.findOne({ email }).select("+password") — password excluded by default' },
      { actor: 'server', text: 'Compare password', detail: 'bcrypt.compare() rehashes input and compares — never decrypts' },
      { actor: 'server', text: 'Check isVerified', detail: 'Returns 403 if email not yet verified' },
      { actor: 'server', text: 'Sign access token', detail: 'jwt.sign({ id }, JWT_SECRET, { expiresIn: "15m" })' },
      { actor: 'server', text: 'Sign refresh token', detail: 'jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: "7d" })' },
      { actor: 'client', text: 'Store tokens', detail: 'Access token → localStorage. Refresh token → httpOnly cookie (JS cannot read)' },
      { actor: 'client', text: 'Access protected routes', detail: 'Axios attaches Bearer token. Server verifies with jwt.verify()' },
    ],
  },
  {
    id: 'refresh',
    title: 'Refresh Token Flow',
    color: 'border-indigo-200 bg-indigo-50',
    activeColor: 'border-indigo-500 bg-indigo-50',
    steps: [
      { actor: 'client', text: 'API request with expired token', detail: 'Access token older than 15 minutes, server returns 401' },
      { actor: 'client', text: 'Axios response interceptor catches 401', detail: 'Original request is queued, refresh flow begins automatically' },
      { actor: 'client', text: 'POST /auth/refresh-token', detail: 'httpOnly cookie sent automatically by browser — JS never touches it' },
      { actor: 'server', text: 'Verify refresh token', detail: 'jwt.verify() with JWT_REFRESH_SECRET — throws if expired or tampered' },
      { actor: 'db', text: 'Find user by decoded ID', detail: 'Confirms user still exists in database' },
      { actor: 'server', text: 'Issue new access token', detail: 'Fresh 15-minute access token signed and returned' },
      { actor: 'client', text: 'Update localStorage + retry', detail: 'Interceptor updates token, retries all queued requests transparently' },
    ],
  },
  {
    id: 'forgot',
    title: 'Forgot + Reset Password',
    color: 'border-amber-200 bg-amber-50',
    activeColor: 'border-amber-500 bg-amber-50',
    steps: [
      { actor: 'client', text: 'Submit forgot password form', detail: 'POST /api/auth/forgot-password with email' },
      { actor: 'server', text: 'Lookup user — always return same message', detail: 'Returns "If that email exists..." regardless — prevents email enumeration attacks' },
      { actor: 'server', text: 'Generate reset token', detail: 'crypto.randomBytes(32) — stores SHA-256 hash + 10 min expiry in DB' },
      { actor: 'email', text: 'Send reset email', detail: 'Brevo API sends HTML email with reset link containing plain token — expires in 10 minutes' },
      { actor: 'client', text: 'Click reset link + submit new password', detail: 'PUT /api/auth/reset-password/:token' },
      { actor: 'server', text: 'Validate token + expiry', detail: 'Hashes incoming token, queries DB: { resetPasswordToken: hash, resetPasswordExpire: { $gt: now } }' },
      { actor: 'db', text: 'Update password + clear token', detail: 'New password saved (triggers pre-save bcrypt hook), token fields wiped' },
    ],
  },
  {
    id: 'protected',
    title: 'Protected Route Guard',
    color: 'border-emerald-200 bg-emerald-50',
    activeColor: 'border-emerald-500 bg-emerald-50',
    steps: [
      { actor: 'client', text: 'Navigate to /dashboard', detail: 'React Router checks ProtectedRoute component before rendering' },
      { actor: 'client', text: 'AuthContext checks user state', detail: 'Reads user from localStorage — if null, redirects to /login' },
      { actor: 'client', text: 'API call to GET /auth/me', detail: 'On mount, verifies token is still valid server-side' },
      { actor: 'server', text: 'protect middleware runs', detail: 'Extracts Bearer token from Authorization header' },
      { actor: 'server', text: 'jwt.verify() validates token', detail: 'Checks signature + expiry — throws on any failure' },
      { actor: 'db', text: 'Fetch user document', detail: 'User.findById(decoded.id).select("-password") — attaches to req.user' },
      { actor: 'client', text: 'Route renders', detail: 'User confirmed — dashboard mounts with real user data from context' },
    ],
  },
];
