// Check if routes are loaded
const app = require('./app');

console.log('\n🔍 Checking Express Routes...\n');

// Get all registered routes
const routes = [];

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // Routes registered directly on the app
    routes.push({
      path: middleware.route.path,
      methods: Object.keys(middleware.route.methods)
    });
  } else if (middleware.name === 'router') {
    // Router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const path = middleware.regexp.source
          .replace('\\/?', '')
          .replace('(?=\\/|$)', '')
          .replace(/\\\//g, '/')
          .replace('^', '');
        
        routes.push({
          path: path + handler.route.path,
          methods: Object.keys(handler.route.methods)
        });
      }
    });
  }
});

console.log('📋 Registered Routes:\n');
routes.forEach(route => {
  console.log(`   ${route.methods.join(', ').toUpperCase().padEnd(10)} ${route.path}`);
});

console.log('\n');

// Check specifically for API routes
const apiRoutes = routes.filter(r => r.path.includes('/api'));
if (apiRoutes.length > 0) {
  console.log('✅ API routes are loaded!');
  console.log(`   Found ${apiRoutes.length} API routes\n`);
} else {
  console.log('❌ API routes NOT loaded!');
  console.log('   Please check routes/api.js\n');
}
