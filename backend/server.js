import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://project-netaji.netlify.app",
    "https://intelligentmanage.netlify.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Validate environment variables
if (!process.env.DEEPSEEK_API_KEY) {
  console.error("DEEPSEEK_API_KEY is not set in environment variables");
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        message: "Invalid request: messages must be an array",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      // If streaming has started, we can't send JSON response
      res.write(
        `data: ${JSON.stringify({ error: "Streaming error occurred" })}\n\n`
      );
      res.end();
    }
  } catch (error) {
    console.error("Error:", error);
    // Only send JSON response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({
        message: "An error occurred while processing your request",
        error: error.message,
      });
    }
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
