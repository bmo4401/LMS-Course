import 'dotenv/config';
const env = {
  PORT: process.env.PORT,
  ORIGIN: process.env.ORIGIN,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.DB_URI,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_KEY: process.env.CLOUD_KEY,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_SECRET: process.env.CLOUD_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
  ACTIVATION_SECRET: process.env.ACTIVATION_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};

export default env;
