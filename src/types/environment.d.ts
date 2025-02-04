declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      HUGGING_FACE_API_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      DB_USER: string;
      DB_HOST: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      DB_PORT: string;
    }
  }
}

export {};
