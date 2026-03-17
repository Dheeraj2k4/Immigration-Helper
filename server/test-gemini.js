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
    
    // Try gemini-3-flash-preview (latest working model)
    console.log('\n🧪 Testing with gemini-3-flash-preview...');
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('Response:', text);
    console.log('\n📌 Using model: gemini-3-flash-preview');
  } catch (error) {
    console.error('\n❌ Gemini API Error:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('1. Check if API key is valid: https://makersuite.google.com/app/apikey');
    console.error('2. Verify API is enabled: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.error('3. Check for billing/quota issues');
    console.error('\n📖 Full error details:');
    console.error(JSON.stringify({ 
      message: error.message,
      status: error.status,
      statusText: error.statusText 
    }, null, 2));
  }
}

testGemini();
