import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import botRoutes from './routes/botRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initTelegramBot } from './services/telegramBotService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parsers form-encoded bodies from Twilio Webhook

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mounted API v1 Routes
app.use('/api/v1/user', profileRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/bot', botRoutes);

// Undefined Route Fallback
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  // Initialize Telegram Bot live polling listener
  initTelegramBot();

  app.listen(PORT, () => {
    console.log(`🚀 Synapse.AI Backend API running on http://localhost:${PORT}/api/v1`);
  });
}

export default app;
