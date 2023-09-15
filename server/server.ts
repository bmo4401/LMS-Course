import { app } from './app';
import connectDB from './utils/db';
import env from './utils/env';
/* cloudinary config */
import './config/cloudinary';
/* create server */
app.listen(env.PORT, () => {
  console.log(`Server is connected with port ${env.PORT}`);
  connectDB();
});
