import { NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./app/lib/prisma";

const protected_routes = [
    "/home", "/home/new_post", "/home/profile"
]

export const proxy = auth(async (req) => {
    let provider = "credentials"
    if (protected_routes.includes(req.nextUrl.pathname)) {
        if (req.auth?.user) {
            if (req.auth.user.image?.includes("github"))
                provider = "github"
            if (req.auth.user.image?.includes("google"))
                provider = "google"
            const existinguser = await prisma.users.findUnique({
                where: {
                    provider_uemail: { provider: provider, uemail: req.auth.user.email as string}
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