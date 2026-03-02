const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('📋 Fetching available Gemini models...\n');
    
    // Try different model names that might work
    const modelsToTry = [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'models/gemini-pro'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log(`✅ ${modelName} WORKS!`);
        console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0,80)}...\n`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
