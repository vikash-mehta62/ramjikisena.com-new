// Test script for dual authentication
// Run: node test-dual-auth.js

const API_URL = process.env.API_URL || 'http://localhost:3100';

async function testLogin() {
  console.log('🧪 Testing Dual Authentication...\n');
  
  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginRes = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test',
        password: 'test123'
      })
    });
    
    const loginData = await loginRes.json();
    console.log('   Response:', loginData.success ? '✅ Success' : '❌ Failed');
    
    if (loginData.token) {
      console.log('   Token in response: ✅ Yes');
      console.log('   Token:', loginData.token.substring(0, 20) + '...');
    } else {
      console.log('   Token in response: ❌ No');
    }
    
    // Check cookie
    const cookies = loginRes.headers.get('set-cookie');
    if (cookies && cookies.includes('token=')) {
      console.log('   Cookie set: ✅ Yes');
      console.log('   Cookie:', cookies.substring(0, 50) + '...');
    } else {
      console.log('   Cookie set: ❌ No');
    }
    
    if (!loginData.token) {
      console.log('\n❌ Test Failed: No token in response');
      return;
    }
    
    const token = loginData.token;
    
    // Test 2: API call with Authorization header
    console.log('\n2️⃣ Testing API call with Authorization header...');
    const meRes = await fetch(`${API_URL}/api/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const meData = await meRes.json();
    console.log('   Response:', meData.success ? '✅ Success' : '❌ Failed');
    if (meData.user) {
      console.log('   User:', meData.user.username);
    }
    
    // Test 3: Register
    console.log('\n3️⃣ Testing Register...');
    const randomNum = Math.floor(Math.random() * 10000);
    const registerRes = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `testuser${randomNum}`,
        name: 'Test User',
        city: 'Test City',
        contact: `98765${String(randomNum).padStart(5, '0')}`,
        password: 'test123'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('   Response:', registerData.success ? '✅ Success' : '❌ Failed');
    
    if (registerData.token) {
      console.log('   Token in response: ✅ Yes');
    } else {
      console.log('   Token in response: ❌ No');
    }
    
    console.log('\n✅ All tests completed!');
    console.log('\n📋 Summary:');
    console.log('   - Login returns token: ' + (loginData.token ? '✅' : '❌'));
    console.log('   - Authorization header works: ' + (meData.success ? '✅' : '❌'));
    console.log('   - Register returns token: ' + (registerData.token ? '✅' : '❌'));
    
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
  }
}

// Run test
testLogin();
