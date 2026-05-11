import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The GEMINI_API_KEY is injected by the platform at runtime
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Model Aliases for convenience
export const MODELS = {
  pro: "gemini-3.1-pro-preview",
  flash: "gemini-3-flash-preview",
  live: "gemini-3.1-flash-live-preview",
  veo: "veo-3.1-generate-preview",
  veo_lite: "veo-3.1-lite-generate-preview",
  image: "gemini-3.1-flash-image-preview",
};
