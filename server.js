import express from "express";
import cors from "cors";
import { ChatOllama } from "@langchain/ollama";

const app = express();

app.use(cors());
app.use(express.json());

// Remove all global probe and async IIFE.
// That probe is what causes Node to exit.

const model = new ChatOllama({
    model: "phi3",
});

// Simple GET to check server
app.get("/chat", (req, res) => {
    res.status(200).send("Chat endpoint is running.");
});

// POST chat route
app.post("/chat", async (req, res) => {
    const { message } = req.body || {};

    if (!message) {
        return res.status(400).json({ error: "Message missing" });
    }

    try {
        const response = await model.invoke(message);
        res.json({ reply: response });
    } catch (err) {
        console.error("Model error:", err);
        res.status(500).json({ error: "Model failed", details: err.message });
    }
});

// KEEP SERVER ALIVE
const server = app.listen(
    {
        port: 5000,
        host: "127.0.0.1",
        family: 4, // << forces IPv4 binding
    },
    () => {
        console.log("Chatbot running on 127.0.0.1:5000 (IPv4 forced)");
    }
);

// This keeps Node alive no matter what
setInterval(() => {}, 1000);
