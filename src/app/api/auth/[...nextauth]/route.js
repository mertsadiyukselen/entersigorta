import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@entersigorta.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials?.email === "admin@entersigorta.com" && credentials?.password === "Enter2026!") {
          return { id: "1", name: "Admin", email: "admin@entersigorta.com" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "ENTER_SIGORTA_SUPER_SECRET_KEY"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
