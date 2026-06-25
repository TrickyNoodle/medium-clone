'use server'
import { prisma } from "./prisma";

export async function new_post(title: string, content: string, tags: string[], uid: number) {
    let result = null
    if (tags.length == 0)
        result = await prisma.posts.create({
            data: {
                pname: title,
                pcontent: content,
                uid: uid
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
export async function getrecentposts() {
    const result = await prisma.posts.findMany({
        take: 30,
        orderBy: {
            pid: "desc"
        }
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