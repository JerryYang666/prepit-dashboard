import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      // profile(profile) {
      //   fetch("https://api.sampleapis.com/coffee/hot")
      //     .then((res) => res.json())
      //     .then((data) => {
      //       console.log(data);
      //       console.log(profile);
      //     });
      //   return {
      //     id: profile.id,
      //     name: profile.login,
      //     email: profile.email,
      //     image: profile.avatar_url,
      //   };
      // },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // profile(profile) {
      //   fetch("https://api.sampleapis.com/coffee/hot")
      //     .then((res) => res.json())
      //     .then((data) => {
      //       console.log(data);
      //       console.log(profile);
      //     });
      //   return {
      //     id: profile.email,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture,
      //   };
      // },
    }),
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
      },
      async authorize(credentials, req) {
        const emailPre = credentials?.email.split("@")[0] ?? "abcd";
        const matches = emailPre.match(/[a-zA-Z]+/g)?.join("") ?? "abcd";
        const user = {
          id: "1",
          name: matches,
          email: credentials?.email,
          image: `https://source.boringavatars.com/beam/120/${matches}?colors=ADE6EA,BDD5EA,CDEADC,89C1E8,B9E1F0`,
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/", //sigin page
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
};
