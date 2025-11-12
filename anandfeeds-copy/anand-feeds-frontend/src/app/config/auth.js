import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Phone Login",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "Enter your phone number" },
      },
      async authorize(credentials) {
        try {
          const token = process.env.STRAPI_AUTH_API;
          if (!token) {
            throw new Error("Missing STRAPI_API_KEY");
          }
          console.log("cred", credentials)

          const phone = credentials.phone;
          if (!phone) {
            throw new Error("Phone number is required");
          }

          console.log(phone);
          const getResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI}/api/users?filters[email][$eq]=${phone}`,
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );

          if (getResponse.data.length === 0) {


            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_STRAPI}/api/users`,
              {
                email: `${phone}@gmail.com`,
                username: phone,
                provider: "otp",
                phone:phone
              },
              {
                headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Phone user created successfully:", response.data);
          } else {
            console.log("Phone user already exists:", getResponse.data);
          }

          return { id: phone, phone };
        } catch (error) {
          console.error("Error storing phone user in Strapi:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const token = process.env.STRAPI_AUTH_API;
          if (!token) {
            console.error("Missing STRAPI_API_KEY");
            return false;
          }

          const getResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI}/api/users?filters[email][$eq]=${user.email}`,
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );

          if (getResponse.data.length === 0) {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_STRAPI}/api/users`,
              {
                email: user.email,
                username: user.email,
                provider: "google",
              },
              {
                headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Google user created successfully:", response.data);
          } else {
            console.log("Google user already exists:", getResponse.data);
          }

          return true;
        } catch (error) {
          console.error("Error storing Google user in Strapi:", error.response?.data || error.message);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.phone) {
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.phone) {
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
