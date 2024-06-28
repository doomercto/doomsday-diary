import NextAuth from 'next-auth';
import CoinbaseProvider from 'next-auth/providers/coinbase';

const handler = NextAuth({
  providers: [
    CoinbaseProvider({
      clientId: process.env.COINBASE_CLIENT_ID,
      clientSecret: process.env.COINBASE_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
