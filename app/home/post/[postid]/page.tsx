'use client'
import { ForwardRefEditor } from '@/components/ForwardRefEditor'
import '@mdxeditor/editor/style.css'

import { useEffect, useState } from 'react'
import Tags from '@/components/Tags'
import { get_post } from '@/app/lib/Post'
import { redirect, useParams, useRouter } from 'next/navigation'
import { User } from '@/app/types/Account'
import { getPosts, getUserDetails } from '@/app/lib/Account'
import Link from 'next/link'
import { Post } from '@/app/types/Post'

export default function Page() {
    const router = useRouter();
    const { postid }: { postid: string } = useParams()
    const [title, settitle] = useState("")
    const [content, setcontent] = useState("")
    const [tags, settags] = useState<string[]>(["general"])
    const [user, setuser] = useState<User>()
    const [date, setdate] = useState<Date>()
    const [error, seterror] = useState<string | null>()
    const [posts, setposts] = useState<Post[]>([])
    useEffect(() => {
        async function run() {
            const result = await get_post(parseInt(postid))
            if (result) {
                settitle(result.pname)
                setcontent(result.pcontent || "")
                settags(result.tags)
                setdate(result.created as Date)
                const u = await getUserDetails(result.uid)
                if (u.error)
                    redirect("/home")
                else
                    setuser(u)
                const post = await getPosts(u.uid as number)
                setposts(post.filter((p) => { return p.pid != parseInt(postid) }))
            }
            else {
                seterror("Post/User not Found")
            }
        }
        run()
    }, [postid])
    if (error)
        throw new Error("Post/User not found / Doesn't Exist")

    return <div className='flex flex-col gap-16'>
        <div className='flex flex-col gap-2'>
            <Tags tags={tags} settags={settags} readonly />
            <hr />
            <div className='w-full p-4 flex backdrop-brightness-90 items-center'>
                <div className='flex flex-col text-center justify-center items-center h-fit gap'>
                    <img src={user?.image as string} alt="" className='rounded-full border size-4/10' />
                    <Link href={"/home/profile/" + user?.uid} className='hover:underline'>{user?.uname}</Link>
                    <p>{date?.toDateString()} at {date?.toLocaleTimeString()}</p>
                </div>
                <textarea readOnly className='w-full field-sizing-content text-8xl primary-font resize-none outline-none overflow-y-hidden' onChange={(e) => settitle(e.currentTarget.value)} value={title} />
            </div>
            <hr />
            <ForwardRefEditor key={user?.uid} markdown={content} onChange={(e) => setcontent(e)} readOnly />
        </div>
        {posts.length != 0 ? <div className='flex flex-col gap-2'>
            <p className='primary-font text-center font-bold text-2xl'>More Posts From {user?.uname}</p>
            <div className='flex gap-2 overflow-x-scroll'>
                {posts.map((p) => {
                    return <div key={p.pid} className='border rounded-md hover:shadow-xl cursor-pointer ' onClick={() => router.push("/home/post/" + p.pid)}>
                        <p className='text-xl primary-font p-4'>{p.pname}</p>
                        <p className='text-sm backdrop-brightness-90 px-2'>{p.created?.toDateString()}</p>
                    </div>
                })}
            </div>
        </div> : null}
    </div>
}