// File: src/lib/authOptions.ts
import { NextAuthOptions, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// ──────────────────────────────────────────────────────────────────────────────
// 1) Define “BackendTokens” shape ‒ this is exactly what your backend returns
// ──────────────────────────────────────────────────────────────────────────────
interface BackendTokens {
  accessToken: string; // e.g. JWT string used for API calls
  refreshToken: string; // e.g. refresh token string
  expiresIn: number; // how many seconds until accessToken expires
}

// ──────────────────────────────────────────────────────────────────────────────
// 2) Define exactly what “CustomUser” looks like.
//    This should match whatever your backend is returning under `user`.
// ──────────────────────────────────────────────────────────────────────────────
interface CustomUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  role: string;
  avatar: string; // if your backend sends an “avatar” URL
  employmentStatus: string;
  backendTokens: BackendTokens;
  permissions: string[]; // e.g. ["view_users", "edit_posts"]
}

// ──────────────────────────────────────────────────────────────────────────────
// 3) Module Augmentation: extend NextAuth’s Session & JWT types
//    so that TypeScript knows exactly what lives on `session.user` and `token`.
// ──────────────────────────────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      companyId: string;
      role: string;
      avatar: string;
      employmentStatus: string;
    };
    backendTokens: BackendTokens;
    permissions: string[]; // e.g. ["view_users", "edit_posts"]
  }

  /** When you call `signIn("credentials", { user, backendTokens })`,
   *  NextAuth will pass that “user” object into callbacks as `User`. */
}

declare module "next-auth/jwt" {
  interface JWT {
    /** copy of `CustomUser` minus the tokens themselves */
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      companyId: string;
      role: string;
      avatar: string;
      employmentStatus: string;
    };
    backendTokens: BackendTokens;
    permissions: string[]; // e.g. ["view_users", "edit_posts"]
    accessTokenExpires: number;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 4) Helper: call “/api/auth/refresh” on your backend to get a brand‐new
//    pair of tokens.  This runs whenever `Date.now() >= token.accessTokenExpires`.
// ──────────────────────────────────────────────────────────────────────────────
async function refreshToken(token: JWT): Promise<JWT> {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
    {
      method: "POST",
      headers: {
        authorization: `Refresh ${token.backendTokens.refreshToken}`,
      },
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to refresh token");
  }

  const refreshedTokens: BackendTokens = await resp.json();
  return {
    ...token,
    backendTokens: refreshedTokens,
    accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
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
      credentials: {}, // no built‐in fields; we pass user+tokens manually at signIn()
      async authorize(credentials: unknown) {
        const { user, backendTokens, permissions } = credentials as {
          user: string;
          backendTokens: string;
          permissions: string[];
        };

        const parsedUser = JSON.parse(user);
        const parsedBackendTokens = JSON.parse(backendTokens);

        if (!parsedUser || !parsedBackendTokens) return null;

        return {
          ...parsedUser,
          backendTokens: parsedBackendTokens,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const {
          id,
          email,
          firstName,
          lastName,
          companyId,
          role,
          avatar,
          employmentStatus,
          backendTokens,
          permissions,
        } = user as CustomUser;

        return {
          user: {
            id,
            email,
            firstName,
            lastName,
            companyId,
            role,
            avatar,
            employmentStatus,
          },
          backendTokens,
          permissions,
          accessTokenExpires: backendTokens.expiresIn,
        };
      }

      const REFRESH_BUFFER = 10 * 60 * 1000;

      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - REFRESH_BUFFER
      ) {
        return token; // still valid enough — no refresh needed
      }
      return await refreshToken(token);
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;
      session.permissions = token.permissions;
      session.expires = new Date(token.accessTokenExpires).toISOString();
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
