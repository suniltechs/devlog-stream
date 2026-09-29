require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON body parsing for API endpoint

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// Reusable log broadcaster
const broadcastLog = (data) => {
  const logData = {
    type: data.type || 'info', 
    message: data.message || 'Empty log message',
    timestamp: data.timestamp || new Date().toISOString(),
    source: data.source || 'Unknown'
  };
  
  console.log(`[${logData.type.toUpperCase()}] Broadcasting: ${logData.message}`);
  io.emit('new-log', logData);
  return logData;
};

const { GoogleGenAI } = require('@google/genai');

// Phase 3: Express API Endpoint for logs
app.post('/log', (req, res) => {
  const logData = broadcastLog(req.body);
  res.status(202).json({ status: 'Log received', data: logData });
});

// AI Explanation Endpoint
app.post('/api/ai/explain', async (req, res) => {
  const { message, type, source } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert senior software engineer. Please analyze the following ${type} log/error from ${source || 'the application'}. 
Provide a clear, concise explanation of why this happened and concrete steps to fix it. 
Format your response in Markdown, using code blocks for any commands or code snippets.

Log Message:
${message}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ explanation: response.text });
  } catch (error) {
    console.error('AI Explanation Error:', error);
    res.status(500).json({ error: 'Failed to generate explanation.' });
  }
});

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Emit a "welcome" log
  socket.emit('new-log', {
    type: 'success',
    message: `Connected to DevLog server as ${socket.id}`,
    timestamp: new Date().toISOString(),
    source: 'DevLog Server'
  });

  // Listen for incoming 'log' events from any client/app via Socket
  socket.on('log', (data) => {
    broadcastLog(data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Robust error handling for the server
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process and try again.`);
    process.exit(1);
  } else {
    console.error('Server error:', e);
  }
});

server.listen(PORT, () => {
  console.log(`DevLog Server running on http://localhost:${PORT}`);
});
