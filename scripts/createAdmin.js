// Script to create an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  city: String,
  password: String,
  contact: String,
  role: { type: String, default: 'user' },
  currCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  mala: { type: Number, default: 0 },
  dailyCounts: [{ date: Date, count: Number }],
  joiningDate: { type: Date, default: Date.now }
});

const User = mongoose.model('user', userSchema);

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Updating existing admin user to admin role...');
      
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('✅ Admin role updated successfully!');
      console.log('\nAdmin Details:');
      console.log('Username:', existingAdmin.username);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
    } else {
      console.log('Creating new admin user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create admin user
      const admin = await User.create({
        username: 'admin',
        name: 'Admin User',
        city: 'Admin City',
        password: hashedPassword,
        contact: '9999999999',
        role: 'admin',
        currCount: 0,
        totalCount: 0,
        rank: 0,
        mala: 0,
        dailyCounts: []
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('\nAdmin Credentials:');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

// Run the script
createAdmin();
