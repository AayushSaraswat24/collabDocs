import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import {prisma} from "@collabdoc/db"

export const authOptions:NextAuthOptions={
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],

    session:{
        strategy:"database"
    },

    cookies: {
        sessionToken: {
        name: "__Secure-next-auth.session-token",
        options: {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
        },
        },
    },

    callbacks:{
        async session({session,user}){

            if (session.user) {
                session.user.id = user.id;
            }
            return session;

        }
    },

    adapter:PrismaAdapter(prisma),

}

