const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function quickTest() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  console.log('Testing gemini-1.5-flash with detailed error...\n');
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    console.log('✅ SUCCESS!');
    console.log('Response:', response.text());
  } catch (error) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('\nFull error:', JSON.stringify(error.errorDetails || {}, null, 2));
  }
}

quickTest();
