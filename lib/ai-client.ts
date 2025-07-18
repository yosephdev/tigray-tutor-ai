import { GoogleGenerativeAI } from '@google/generative-ai';

class AIClient {
  private genAI!: GoogleGenerativeAI;
  private isConfigured: boolean = false;
  private availableModels = ['gemini-1.5-flash', 'gemini-1.5-pro'];

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_GEMINI_API_KEY is not set');
      this.isConfigured = false;
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.isConfigured = true;
      console.log('✅ Gemini AI Client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI Client:', error);
      this.isConfigured = false;
    }
  }

  private async retryWithFallback<T>(
    operation: (modelName: string) => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: any;

    for (const modelName of this.availableModels) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 Trying ${modelName} (attempt ${attempt}/${maxRetries})`);
          const result = await operation(modelName);
          console.log(`✅ Success with ${modelName}`);
          return result;
        } catch (error: any) {
          lastError = error;
          console.log(`❌ ${modelName} failed (attempt ${attempt}): ${error.message}`);
          
          // If it's a 429 (quota exceeded), don't retry - move to next model
          if (error.status === 429) {
            console.log(`⚠️ Quota exceeded for ${modelName}, trying next model...`);
            break;
          }
          
          // If it's a 503 (overloaded), wait before retry
          if (error.status === 503 && attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`⏳ Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          // If it's a 404 (model not found), try next model immediately
          if (error.status === 404) {
            console.log(`⏭️ Model ${modelName} not found, trying next model...`);
            break;
          }
          
          // For other errors, wait a bit before trying next model
          if (attempt === maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }

    // Enhanced error messages for quota issues
    if (lastError?.status === 429) {
      throw new Error('API quota exceeded. Please wait a few minutes before trying again, or consider upgrading your API plan.');
    } else if (lastError?.status === 503) {
      throw new Error('All AI models are temporarily overloaded. Please try again in a few minutes.');
    } else if (lastError?.status === 404) {
      throw new Error('AI models are not available. Please check your API configuration.');
    }

    throw lastError;
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.isConfigured) {
      return '❌ AI service is not properly configured. Please check your API key.';
    }

    try {
      console.log('🤖 Generating response for:', prompt.substring(0, 50) + '...');
      
      // Shorter prompt to reduce token usage
      const enhancedPrompt = `You are Tigray Tutor for Tigrinya students in Ethiopia.

Respond in both Tigrinya and English. Be educational, supportive, and culturally sensitive.

Question: "${prompt}"

Response:`;

      const result = await this.retryWithFallback(async (modelName) => {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        return response.text();
      });
      
      console.log('✅ AI Response generated successfully');
      return result;
      
    } catch (error: any) {
      console.error('❌ AI Client Error:', error);
      
      if (error.message?.includes('quota') || error.status === 429) {
        return '⚠️ API quota exceeded. Please wait a few minutes before trying again. The free tier has daily limits.';
      }
      
      if (error.status === 503) {
        return '⚠️ AI service is temporarily overloaded. Please try again in a few moments.';
      }
      
      if (error.message?.includes('BLOCKED')) {
        return '🚫 Content was blocked. Please rephrase your question.';
      }
      
      return `❌ Service temporarily unavailable. Please try again in a few minutes.`;
    }
  }

  async analyzeImage(imageData: string, prompt: string = "Describe this image"): Promise<string> {
    if (!this.isConfigured) {
      return '❌ AI service is not properly configured for image analysis.';
    }

    try {
      const enhancedPrompt = `
You are Tigray Tutor analyzing an image for a Tigrinya-speaking student.

Analyze this image and provide educational insights in both Tigrinya and English.
Focus on educational value and cultural context when relevant.

User request: "${prompt}"

Please provide a detailed analysis:
      `;

      const result = await this.retryWithFallback(async (modelName) => {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          enhancedPrompt,
          {
            inlineData: {
              data: imageData,
              mimeType: "image/jpeg"
            }
          }
        ]);
        const response = await result.response;
        return response.text();
      });
      
      return result;
      
    } catch (error: any) {
      console.error('❌ Image Analysis Error:', error);
      
      if (error.status === 503) {
        return '⚠️ Image analysis service is temporarily overloaded. Please try again in a few moments.';
      }
      
      return `❌ Image analysis failed: ${error.message}`;
    }
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    if (!this.isConfigured) {
      return '❌ Translation service is not available.';
    }

    try {
      const prompt = `
Translate the following text to ${targetLanguage}.
Provide ONLY the translation, no additional text or explanations.

Text to translate: "${text}"

Translation:
      `;

      const result = await this.retryWithFallback(async (modelName) => {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
      });
      
      return result;
      
    } catch (error: any) {
      console.error('❌ Translation Error:', error);
      
      if (error.status === 503) {
        return '⚠️ Translation service is temporarily overloaded. Please try again in a few moments.';
      }
      
      return `Translation failed: ${error.message}`;
    }
  }

  async generateExercises(content: string, difficulty: string): Promise<any[]> {
    if (!this.isConfigured) {
      return [];
    }

    try {
      const prompt = `
Create 3 educational exercises for Tigrinya-speaking students based on: "${content}"
Difficulty: ${difficulty}

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Question in both Tigrinya and English",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation in both languages"
  }
]

Focus on Ethiopian curriculum and cultural context.
      `;

      const result = await this.retryWithFallback(async (modelName) => {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      });
      
      try {
        const jsonText = result.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        return [];
      }
    } catch (error) {
      console.error('❌ Exercise Generation Error:', error);
      return [];
    }
  }
}

export const aiClient = new AIClient();
