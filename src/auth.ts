import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { USERS } from '@/data/users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize({ email, password }) {
        if (typeof email !== 'string' || typeof password !== 'string') return null;
        const user = USERS.find((entry) => entry.email === email.trim().toLowerCase() && entry.password === password);
        if (!user) return null;
        const { id, name, email: address, role } = user;
        return { id, name, email: address, role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
