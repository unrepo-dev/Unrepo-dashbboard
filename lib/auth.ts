import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Sync user with backend database after GitHub login
      if (account?.provider === 'github') {
        const githubProfile = profile as any;
        
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
          
          // Call backend to save/update user in database
          const response = await fetch(`${apiUrl}/auth/github/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              githubId: githubProfile.id?.toString(),
              githubUsername: githubProfile.login,
              name: githubProfile.name || githubProfile.login,
              email: user.email || githubProfile.email,
              avatar: githubProfile.avatar_url,
            }),
          });

          if (!response.ok) {
            console.error('Failed to sync user with backend:', await response.text());
            // Still allow login even if backend sync fails
          } else {
            const data = await response.json();
            console.log('User synced with backend:', data.user);
          }
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          // Still allow login even if backend sync fails
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      // Add GitHub info to token on sign in
      if (account && profile) {
        const githubProfile = profile as any;
        token.githubId = githubProfile.id?.toString();
        token.githubUsername = githubProfile.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.githubId) {
        // Add GitHub info to session
        (session.user as any).githubId = token.githubId;
        (session.user as any).githubUsername = token.githubUsername;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to developer portal after successful GitHub login
      if (url.startsWith(baseUrl)) {
        return baseUrl;
      }
      // If it's an external URL (GitHub callback), redirect to home
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
};
