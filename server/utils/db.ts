import mongoose from 'mongoose';
import env from './env';
const dbUrl: string = env.DB_URI || '';
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data) => {
      console.log(`Database connected with ${data.connection.port}`);
    });
  } catch (error) {
    console.log('❄️ ~ file: db.ts:8 ~ error:', error);
  }
};
export default connectDB;
