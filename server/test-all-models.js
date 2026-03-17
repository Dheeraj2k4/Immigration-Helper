const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testAllModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Comprehensive list of possible model names
  const models = [
    // Latest 2024/2025 naming
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-pro-001',
    
    // Without version numbers
    'gemini-flash',
    'gemini-pro-latest',
    
    // Experimental
    'gemini-exp-1206',
    'gemini-2.0-flash-exp',
    
    // Legacy with models/ prefix
    'models/gemini-1.5-flash-latest',
    'models/gemini-pro-latest'
  ];
  
  console.log('🔍 Testing all possible model names...\n');
  
  for (const modelName of models) {
    try {
      console.log(`Trying: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      
      console.log(`\n✅✅✅ SUCCESS! Model "${modelName}" works! ✅✅✅`);
      console.log(`Response: ${response.text()}`);
      console.log(`\n🎯 USE THIS MODEL: "${modelName}"\n`);
      return modelName;
    } catch (error) {
      console.log(`   ❌ ${error.status || 'Error'}: ${error.message.substring(0, 80)}`);
    }
  }
  
  console.log('\n❌ No models worked. This is unusual if you see usage in dashboard.');
  console.log('Check: https://ai.google.dev/gemini-api/docs/models/gemini for current model names');
}

testAllModels();
