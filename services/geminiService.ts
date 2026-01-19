
import { GoogleGenAI } from "@google/genai";

const COMPANY_CONTEXT = `
You are Lumina, the AI assistant for Lumina Solutions.
Lumina Solutions is a premium technology consulting firm specializing in:
1. Generative AI Strategy (custom LLMs, RAG systems, AI workflow automation).
2. Cloud Infrastructure (AWS/Azure/GCP, Kubernetes, Serverless).
3. Custom Enterprise Software (React, Node.js, Python, Go).
4. Data Analytics & Business Intelligence.

The company was founded in 2018 by Sarah Jenkins. 
We focus on mid-to-large scale digital transformation projects.
Our tone is professional, innovative, and helpful. 
Keep your answers concise and always try to steer potential clients toward booking a consultation.
`;

export class GeminiService {
  private ai: GoogleGenAI;
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: COMPANY_CONTEXT,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        }
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!";
    }
  }
}

export const geminiService = new GeminiService();
