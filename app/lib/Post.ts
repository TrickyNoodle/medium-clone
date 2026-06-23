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