const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function checkGemini() {
  try {
    console.log('🔍 Checking Gemini API Setup...\n');
    console.log('API Key (last 4):', process.env.GEMINI_API_KEY?.slice(-4) || 'NOT FOUND');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try new 2024 model names
    const modelsToTry = [
      'gemini-1.5-flash-002',
      'gemini-1.5-pro-002', 
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-pro'
    ];

    console.log('Testing available models...\n');

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS! Model "${modelName}" works!`);
        console.log(`   Response: ${text.substring(0, 50)}...\n`);
        console.log(`🎯 Use this model name in your code: "${modelName}"\n`);
        return; // Stop after first working model
      } catch (err) {
        if (err.status === 404) {
          console.log(`   ❌ Not found (404)`);
        } else if (err.status === 403) {
          console.log(`   ❌ Forbidden (403) - API not enabled`);
        } else if (err.status === 400) {
          console.log(`   ❌ Bad request (400)`);
        } else {
          console.log(`   ❌ Error: ${err.message.substring(0, 60)}...`);
        }
      }
    }
    
    console.log('\n⚠️ No working model found!');
    console.log('\n📝 Action Required:');
    console.log('1. Go to: https://aistudio.google.com/apikey');
    console.log('2. Enable "Generative Language API"');
    console.log('3. Or create a new API key in AI Studio (auto-enables API)');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkGemini();
