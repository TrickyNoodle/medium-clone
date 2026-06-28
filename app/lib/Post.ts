'use server'
import { prisma } from "./prisma";

export async function new_post(title: string, content: string, tags: string[], uid: number, uname: string) {
    let result = null
    if (tags.length == 0)
        result = await prisma.posts.create({
            data: {
                pname: title,
                pcontent: content,
                uid: uid,
                uname: uname
            }
        })
    else
        result = await prisma.posts.create({
            data: {
                pname: title,
                pcontent: content,
                tags: tags,
                uid: uid
            }
        })
    if (result == null)
        return { "msg": "error" }
    else
        return { "msg": "success" }
}
export async function get_post(pid: number) {
    const result = await prisma.posts.findUnique({
        where: {
            pid: pid
        }
    })
    return result
}
export async function getrecentposts(after?: number) {
    after = !after ? 0 : after
    const result = await prisma.posts.findMany({
        take: 10,
        orderBy: {
            pid: "desc"
        },
        skip: after
    })
    return result
}
export async function searchposts(name: string) {
    const result = await prisma.posts.findMany({
        where: {
            OR: [{
                pname: {
                    contains: name,
                    mode: "insensitive"
                }
            }, {
                pcontent: {
                    contains: name,
                    mode: "insensitive"
                }
            }]
        }
    })
    return result
}
export async function followingposts(followerlist: number[], after?: number) {
    after = !after ? 0 : after
    const result = await prisma.posts.findMany({
        take: 10,
        skip: after,
        where: {
            uid: {
                in: followerlist
            }
        }
    })
    return result
}