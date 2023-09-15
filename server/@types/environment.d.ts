export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ORIGIN: string;
      NODE_ENV: 'development' | 'production';
      DB_URI: string;

      CLOUD_NAME: string;
      CLOUD_KEY: string;
      CLOUD_SECRET: string;
      CLOUD_API_KEY: string;
      REDIS_URL: string;

      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
      ACCESS_TOKEN_EXPIRE: string;
      REFRESH_TOKEN_EXPIRE: string;

      ACTIVATION_SECRET: string;

      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_SERVICE: string;
      SMTP_EMAIL: string;
      SMTP_PASSWORD: string;
    }
  }
}
