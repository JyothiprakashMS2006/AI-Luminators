import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { handleChat } from './controllers/agentController.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Config (Memory storage for now to keep it simple)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
// POST /api/chat - Main chat endpoint
// Supports 'messages' (JSON string or object) and 'files' (multipart)
app.post('/api/chat', upload.array('files'), handleChat);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Chat Agent Server running on port ${port}`);
});
