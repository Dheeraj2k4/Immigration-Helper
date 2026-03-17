const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testNewModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Try the model from Python example
  const modelsToTry = [
    'gemini-3-flash-preview',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-8b-latest',
    'gemini-flash-1.5',
  ];
  
  console.log('🧪 Testing models from Python example...\n');
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      const text = response.text();
      
      console.log(`\n✅ SUCCESS! "${modelName}" works!`);
      console.log(`Response: ${text}\n`);
      console.log(`🎯 Use this in your code: model: "${modelName}"\n`);
      return modelName;
    } catch (error) {
      console.log(`   ❌ Failed: ${error.status} - ${error.message.substring(0, 60)}`);
    }
  }
  
  console.log('\n⚠️ None worked. Let me check API version...');
}

testNewModel();
