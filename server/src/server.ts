import connectDB from '../utils/db';
import env from '../utils/env';
import { app } from './app';
/* cloudinary config */
import '../config/cloudinary';
/* create server */
app.listen(env.PORT, () => {
  console.log(`Server is connected with port ${env.PORT}`);
  connectDB();
});
