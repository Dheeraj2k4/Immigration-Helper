const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load .env from root directory (one level up from server/)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Testing Gemini API...');
console.log('API Key present:', !!process.env.GEMINI_API_KEY);
console.log('API Key (last 4 chars):', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'NOT FOUND');

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('\n🧪 Testing simple generation...');
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('Response:', text);
  } catch (error) {
    console.error('\n❌ Gemini API Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.statusText) {
      console.error('Status Text:', error.statusText);
    }
    console.error('\nFull error:', error);
  }
}

testGemini();
