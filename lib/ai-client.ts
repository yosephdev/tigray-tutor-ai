
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-flash-latest';

let genAI: GoogleGenerativeAI;

if (GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log('✅ Gemini AI Client initialized successfully');
    } catch (error) {
        console.error('Error initializing Gemini AI Client:', error);
    }
} else {
    console.warn('⚠️ Gemini API Key not found, AI features will be disabled.');
}

class AIClient {
    private model: any;

    constructor() {
        if (genAI) {
            this.model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        }
    }

    private async generateWithRetry(prompt: string, model: any) {
        if (!model) {
            throw new Error('AI model not initialized. Check API Key.');
        }

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error(`Error with model:`, error);
            if (error.message.includes('429') || error.message.includes('503')) {
                throw new Error('AI service is currently overloaded. Please try again later.');
            }
            throw new Error('Failed to get response from AI');
        }
    }

    async generateResponse(prompt: string): Promise<string> {
        return this.generateWithRetry(prompt, this.model);
    }

    async translate(text: string, targetLanguage: string): Promise<string> {
        const prompt = `Translate the following text to ${targetLanguage}: "${text}"`;
        return this.generateWithRetry(prompt, this.model);
    }
    
    async analyzeImage(imageDataBase64: string, prompt: string): Promise<string> {
        if (!this.model) {
            throw new Error('Vision model not initialized. Check API Key.');
        }

        const imagePart = {
            inlineData: {
                data: imageDataBase64,
                mimeType: "image/jpeg",
            },
        };

        try {
            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Error analyzing image:', error);
            throw new Error('Failed to analyze image');
        }
    }
    
    async testModels() {
        if (!genAI) return;
        console.log(`Testing Gemini API with key: ${GEMINI_API_KEY?.substring(0, 10)}...`);

        try {
            console.log(`Testing model: ${GEMINI_MODEL}`);
            await this.generateWithRetry('Hello', this.model);
        } catch (error: any) {
            console.error(`Model ${GEMINI_MODEL} failed:`, error.message);
        }
    }
}

export const aiClient = new AIClient();
if (process.env.NODE_ENV === 'development') {
    aiClient.testModels();
}
