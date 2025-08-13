import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import app from './app.js'; 

dotenv.config({ path: '../.env' });
connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.error('Server error:', error);
      throw error;
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`✅ Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  });
