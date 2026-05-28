import 'dotenv/config';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler';
import connectDB from './config/db';
import router from './routes/router';

const app = express();
const PORT = process.env.PORT ?? 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,        
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean) as string[];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.options('/{*path}', cors(corsOptions));
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/', router);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  });
});