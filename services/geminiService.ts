import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Task, Priority, TaskStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const FLASH_MODEL = 'gemini-2.5-flash';

export const generateTaskBreakdown = async (projectTitle: string, projectDescription: string): Promise<any[]> => {
  const prompt = `
    I am a project engineer with ADHD. I have a large, intimidating task: "${projectTitle}".
    Context: ${projectDescription}.
    
    Please break this down into 5-10 very small, actionable, non-intimidating steps. 
    Each step should take between 15-60 minutes.
    Return the result as a JSON array of objects with 'title' (string) and 'estimatedMinutes' (integer).
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        estimatedMinutes: { type: Type.INTEGER },
      },
      required: ['title', 'estimatedMinutes'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an executive function assistant. Your goal is to lower the barrier to entry for complex tasks.",
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating breakdown:", error);
    throw error;
  }
};

export const organizeBrainDump = async (dumpText: string): Promise<any[]> => {
  const prompt = `
    Here is a chaotic brain dump from a project engineer:
    "${dumpText}"
    
    Please extract actionable tasks from this text. 
    Assign a priority (Low, Medium, High, Critical) based on urgency implied.
    Return a JSON array of objects with 'title', 'priority', and 'description'.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
      },
      required: ['title', 'priority'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error organizing dump:", error);
    throw error;
  }
};

export const chatWithAssistant = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  // Transform simple history format to SDK format if needed, or use chat session
  // Here we will just use a simple generateContent with history context manually constructed or use Chat object
  
  try {
    const chat = ai.chats.create({
        model: FLASH_MODEL,
        history: history,
        config: {
            systemInstruction: "You are a supportive, calm, and logical assistant for a project engineer with ADHD. Keep answers concise. Use bullet points. Avoid walls of text. Encourage the user gently."
        }
    });

    const response = await chat.sendMessage({
        message: message
    });
    
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting right now. Let's take a deep breath and try again in a moment.";
  }
};