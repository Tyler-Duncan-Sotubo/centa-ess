import { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      company_id: string;
      company_name: string;
      job_title: string;
      annual_gross: number;
      group_id: string;
      apply_nhf: boolean;
      avatar: string;
    } & DefaultSession["user"];
    backendTokens: BackendTokens;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      company_id: string;
      company_name: string;
      job_title: string;
      annual_gross: number;
      group_id: string;
      apply_nhf: boolean;
      avatar: string;
    };
    backendTokens: BackendTokens;
  }
}

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
    {
      method: "POST",
      headers: {
        authorization: `Refresh ${token.backendTokens.refreshToken}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to refresh token");

  const backendTokens: BackendTokens = await res.json();

  return {
    ...token,
    backendTokens,
  };
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/employee-login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          throw new Error("Invalid credentials");
        }

        const user = await res.json();

        return user; // Expected to include user + backendTokens
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      if (new Date().getTime() < token.backendTokens.expiresIn) {
        return token;
      }

      return await refreshToken(token);
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
