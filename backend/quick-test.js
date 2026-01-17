// backend/quick-test.js
require('dotenv').config();

console.log(' QUICK GMAIL TEST\n');

const pass = process.env.GMAIL_APP_PASSWORD || '';

console.log('1. Email:', process.env.GMAIL_USER);
console.log('2. Password length:', pass.length);
console.log('3. Password contains spaces?', pass.includes(' '));
console.log('4. First 8 chars:', pass.substring(0, 8) + '...');

if (pass.length === 16 && !pass.includes(' ')) {
  console.log('\n Password format CORRECT!');
  console.log(' Now restart backend and test:');
  console.log('   cd backend');
  console.log('   node server.js');
  console.log('\n Then test email with:');
  console.log('   curl -X POST http://localhost:5000/send-welcome-email \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"email":"nguyenhoangquan0801@gmail.com","name":"Test"}\'');
} else {
  console.log('\n Password format WRONG!');
  console.log('   Expected: 16 characters, NO spaces');
  console.log('   Example:  abcdefghijklmnop');
  console.log('\n Fix: Remove spaces from GMAIL_APP_PASSWORD in .env file');
}