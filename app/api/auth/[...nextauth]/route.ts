import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import CoinbaseProvider from 'next-auth/providers/coinbase';

import type { User } from 'next-auth';

const createAnonymousUser = (): User => ({
  id: 'TEST',
  name: 'anonymous',
  email: 'anonymous',
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'anonymous',
      credentials: {},
      async authorize(_credentials, _req) {
        return createAnonymousUser();
      },
    }),
    CoinbaseProvider({
      clientId: process.env.COINBASE_CLIENT_ID,
      clientSecret: process.env.COINBASE_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
