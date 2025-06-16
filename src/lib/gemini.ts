
import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: In production, this should be stored in environment variables
const API_KEY = "AIzaSyD59AKNU8BvlxFrWFFDm1SzBfIwWfX20wE";

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export default genAI;
