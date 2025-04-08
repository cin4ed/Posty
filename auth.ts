import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Resend from 'next-auth/providers/resend'
import client from './lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Resend({
      from: process.env.AUTH_RESEND_FROM,
      apiKey: process.env.AUTH_RESEND_KEY,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
