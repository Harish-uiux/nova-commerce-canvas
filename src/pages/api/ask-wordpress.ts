
import type { NextApiRequest, NextApiResponse } from 'next';
import { getGeminiModel } from '@/lib/gemini';
import { isWordPressQuestion, getWordPressPrompt } from '@/utils/isWordPressQuestion';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      message: 'Please provide a valid question.',
    });
  }

  if (!isWordPressQuestion(prompt)) {
    return res.status(400).json({
      message: 'This AI tool only answers WordPress-related questions. Please ask about WordPress themes, plugins, development, hooks, or functionality.',
    });
  }

  try {
    const model = getGeminiModel();
    const wordpressPrompt = getWordPressPrompt(prompt);
    
    const result = await model.generateContent(wordpressPrompt);
    const response = await result.response;
    const answer = response.text();

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      message: 'Error generating response. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
