// Each provider represents a way for the user to log in
import nextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import azureADProvider from 'next-auth/providers/azure-ad';
import emailProvider from 'next-auth/providers/email';
import googleProvider from 'next-auth/providers/google';
// Adapters give NextAuth a way to communicate with the database
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { JWT } from 'next-auth/jwt';
import clientPromise from '../../../lib/mongodb';

export const AuthOptions: NextAuthOptions = {
  providers: [
    azureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    googleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    emailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token }: { token: JWT }) {
      return token;
    },
    async session({ session, user }: { session: Session; user: User }) {
      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        courses: user.courses || [],
      };

      return session;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
};

export default nextAuth(AuthOptions);
