// Quick API Test Script
// Run: node test-api.js

const http = require('http');

console.log('🧪 Testing API Endpoints...\n');

// Test 1: Check if server is running
const testServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3100', (res) => {
      console.log('✅ Server is running on port 3100');
      console.log(`   Status: ${res.statusCode}\n`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log('❌ Server is NOT running on port 3100');
      console.log(`   Error: ${err.message}\n`);
      reject(false);
    });

    req.end();
  });
};

// Test 2: Check API routes
const testApiRoute = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3100/api/me', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 401) {
          console.log('✅ API routes are working!');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response: ${data}\n`);
          resolve(true);
        } else if (res.statusCode === 404) {
          console.log('❌ API routes NOT found (404)');
          console.log('   Please restart backend!\n');
          reject(false);
        } else {
          console.log(`⚠️  Unexpected status: ${res.statusCode}`);
          console.log(`   Response: ${data}\n`);
          resolve(true);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Cannot connect to API');
      console.log(`   Error: ${err.message}\n`);
      reject(false);
    });

    req.end();
  });
};

// Run tests
(async () => {
  try {
    await testServer();
    await testApiRoute();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All tests passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Next steps:');
    console.log('   1. Start frontend: cd ramjikisena-nextjs && npm run dev');
    console.log('   2. Open: http://localhost:3000');
    console.log('   3. Test login/register\n');
    
  } catch (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ Tests failed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Fix steps:');
    console.log('   1. Stop backend (Ctrl+C)');
    console.log('   2. Start backend: npm run dev');
    console.log('   3. Run this test again: node test-api.js\n');
  }
})();
