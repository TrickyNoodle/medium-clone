import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "./app/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
export const { handlers, auth, signIn, signOut } =
    NextAuth({
        providers: [GitHub, Google,
            Credentials({
                name: "Email and Password",
                type: "credentials",
                credentials: {
                    email: { label: "email" },
                    password: {
                        label: "password", type: "password"
                    }
                },
                async authorize({ password, email }) {
                    if (!(email && password)) {
                        throw new CredentialsSignin("Invalid Credentials")
                    }
                    const existinguser = await prisma.users.findUnique({
                        where: {
                            provider_uemail: {
                                uemail: email as string,
                                provider: "credentials"
                            }
                        }
                    })
                    if (!existinguser) {
                        throw new CredentialsSignin()
                    }
                    const passwordmatch = bcrypt.compareSync(password as string, existinguser.upassword as string)
                    if (passwordmatch) {
                        return {
                            "email": existinguser.uemail as string,
                            "id": existinguser.uid.toString(),
                            "image": null,
                            "name": existinguser.uname
                        }
                    }
                    else
                        throw new CredentialsSignin("Wrong Password or Email")
                }
            })
        ],
    });