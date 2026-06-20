import { NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./app/lib/prisma";
import { sessionuser } from "./components/store";
import { User } from "next-auth";

const protected_routes = [
    "/home"
]

export const proxy = auth(async (req) => {
    let provider = "credentials"
    if (protected_routes.some((route) => { return req.nextUrl.pathname.startsWith(route) })) {
        if (req.auth?.user) {
            if (req.auth.user.image?.includes("github"))
                provider = "github"
            if (req.auth.user.image?.includes("google"))
                provider = "google"
            const existinguser = await prisma.users.findUnique({
                where: {
                    provider_uemail: { provider: provider, uemail: req.auth.user.email as string }
                }
            })
            if (!existinguser)
                return NextResponse.redirect(new URL("/create-account", req.nextUrl))
            else
                return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
})