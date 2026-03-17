// Quick test script to debug NewsData API
const axios = require('axios');

const API_KEY = 'pub_590d52cc4630485aaeef2581a404ba93';
const BASE_URL = 'https://newsdata.io/api/1';

async function testAPI() {
  console.log('🔍 Testing NewsData.io API...\n');

  // Test 1: Basic request without query
  console.log('Test 1: No query (all recent news)');
  try {
    const res1 = await axios.get(`${BASE_URL}/news`, {
      params: {
        apikey: API_KEY,
        language: 'en',
        size: 3
      }
    });
    console.log('✅ Results:', res1.data.totalResults);
    console.log('   Articles:', res1.data.results?.length || 0);
  } catch (err) {
    console.log('❌ Error:', err.response?.data || err.message);
  }

  // Test 2: With OR query
  console.log('\nTest 2: With "visa OR immigration" query');
  try {
    const res2 = await axios.get(`${BASE_URL}/news`, {
      params: {
        apikey: API_KEY,
        q: 'visa OR immigration',
        language: 'en',
        size: 3
      }
    });
    console.log('✅ Results:', res2.data.totalResults);
    console.log('   Articles:', res2.data.results?.length || 0);
    if (res2.data.results?.[0]) {
      console.log('   Sample:', res2.data.results[0].title.substring(0, 80));
    }
  } catch (err) {
    console.log('❌ Error:', err.response?.data || err.message);
  }

  // Test 3: With category
  console.log('\nTest 3: With category filter');
  try {
    const res3 = await axios.get(`${BASE_URL}/news`, {
      params: {
        apikey: API_KEY,
        q: 'visa',
        language: 'en',
        category: 'politics',
        size: 3
      }
    });
    console.log('✅ Results:', res3.data.totalResults);
    console.log('   Articles:', res3.data.results?.length || 0);
  } catch (err) {
    console.log('❌ Error:', err.response?.data || err.message);
  }
}

testAPI().catch(console.error);
