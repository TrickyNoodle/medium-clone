'use client'
import { ForwardRefEditor } from '@/components/ForwardRefEditor'
import '@mdxeditor/editor/style.css'

import { useEffect, useState } from 'react'
import Tags from '@/components/Tags'
import { get_post } from '@/app/lib/Post'
import { redirect, useParams } from 'next/navigation'
import { User } from '@/app/types/Account'
import { getUserDetails } from '@/app/lib/Account'
import Link from 'next/link'

export default function Page() {
    const { postid }: { postid: string } = useParams()
    const [title, settitle] = useState("")
    const [content, setcontent] = useState("")
    const [tags, settags] = useState<string[]>(["general"])
    const [user, setuser] = useState<User>()
    const [date, setdate] = useState<Date>()
    useEffect(() => {
        async function run() {
            const result = await get_post(parseInt(postid))
            if (result == null) {
                redirect("/home")
            }
            else {
                settitle(result.pname)
                setcontent(result.pcontent || "")
                settags(result.tags)
                setdate(result.created as Date)
                const u = await getUserDetails(result.uid)
                if (u.error)
                    redirect("/home")
                else
                    setuser(u)
            }
        }
        run()
    }, [])
    return <div className='flex flex-col gap-2'>
        <Tags tags={tags} settags={settags} readonly />
        <hr />
        <div className='w-full p-4 flex items-center backdrop-brightness-90'>
            <div className='flex flex-col text-center justify-center items-center h-fit gap'>
                <img src={user?.image} alt="" className='rounded-full border size-1/2' />
                <Link href={"/home/profile/" + user?.uid} className='hover:underline'>{user?.name}</Link>
                <p>{date?.toDateString()} at {date?.toLocaleTimeString()}</p>
            </div>
            <textarea readOnly className='w-full field-sizing-content text-8xl primary-font resize-none outline-none overflow-y-hidden' onChange={(e) => settitle(e.currentTarget.value)} value={title} />
        </div>
        <hr />
        <ForwardRefEditor markdown={content} onChange={(e) => setcontent(e)} readOnly />
    </div>
}