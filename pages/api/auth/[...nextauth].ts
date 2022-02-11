import nextAuth from 'next-auth';
import githubProvider from 'next-auth/providers/github';
import azureADProvider from 'next-auth/providers/azure-ad';

export default nextAuth({
  providers: [
    githubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    azureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin';
      return token;
    },
  },
});
