declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_SECRET: string
    MONGODB_URL: string
    AUTH_RESEND_KEY: string
    AUTH_RESEND_FROM: string
  }
}
