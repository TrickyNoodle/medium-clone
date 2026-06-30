'use client'
import { searchusers } from '@/app/lib/Account'
import { searchposts } from '@/app/lib/Post'
import { User } from '@/app/types/Account'
import { Post } from '@/app/types/Post'
import Tags from '@/components/Tags'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const SearchPage = () => {
    const router = useRouter()
    const content = useSearchParams().get("content")
    const [posts, setposts] = useState<Post[]>([])
    const [user, setuser] = useState<User[]>([])
    const [tags, settags] = useState<string[]>([])
    useEffect(() => {
        async function run() {
            const post = await searchposts(content as string)
            setposts(post)
            const users = await searchusers(content as string)
            setuser(users)
        }
        if (content)
            run()
    }, [content])
    return (
        <div className='flex flex-col text-center p-4 gap-4'>
            <p className='text-4xl primary-font'>You Searched For <span className='underline'>{content}</span></p>
            <hr />
            <div className='flex flex-col md:flex-row gap-4'>
                {posts.length === 0 ? (
                    <p className='flex flex-wrap text-2xl primary-font'>Found 0 Posts Related to Your Search</p>
                ) : (
                    <div className='w-full md:w-1/2 flex flex-col gap-2'>
                        <p className='primary-font text-2xl flex flex-wrap'>Search Found {posts.length} Post(s)</p>
                        <p className='text-left'>Filter Posts by Tags</p>
                        <Tags tags={tags} settags={settags} />
                        {posts
                            .filter(
                                (p) => tags.length === 0 || tags.every((tag) => p.tags.includes(tag))
                            )
                            .map((p) => {
                                return (    
                                    <div
                                        key={p.pid}
                                        className='border rounded-md text-left hover:shadow-2xl shadow-md cursor-pointer'
                                        onClick={() => router.push("/home/post/" + p.pid)}
                                    >
                                        <textarea
                                            name=""
                                            id=""
                                            className='resize-none rounded-md p-2 field-sizing-content text-xl'
                                            disabled
                                            value={p.pname}
                                        />
                                        <div className='text-sm backdrop-brightness-90 p-2 flex justify-between'>
                                            {p.created?.toDateString()}
                                            <div className='flex gap-2'>
                                                {p.tags.map((t, i) => {
                                                    return (
                                                        <p key={i} className='border inline rounded-full p-1'>
                                                            {t}
                                                        </p>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                )}
                {user.length === 0 ? (
                    <p className='primary-font text-2xl flex flex-wrap'>Found 0 Users Related to Your Search</p>
                ) : (
                    <div className='w-full md:w-1/2 flex flex-col gap-2'>
                        <p className='primary-font text-2xl flex flex-wrap'>Search Found {user.length} Users</p>
                        {user.map((u) => {
                            return (
                                <div
                                    onClick={() => router.push("/home/profile/" + u.uid)}
                                    key={u.uid}
                                    className='border rounded-md text-left p-4 w-full flex gap-4 hover:shadow-2xl shadow-md cursor-pointer'
                                >
                                    <img
                                        src={u.image as string}
                                        alt=""
                                        className='rounded-full border size-24'
                                    />
                                    <div key={u.uid} className='w-full'>
                                        <p className='primary-font text-2xl font-bold backdrop-brightness-90 rounded-md'>
                                            {u.uname}
                                        </p>
                                        <div className='flex flex-col justify-between'>
                                            <textarea
                                                value={u.bio || ""}
                                                maxLength={100}
                                                className='resize-none field-sizing-content'
                                                disabled
                                            />
                                            <hr />
                                            <p className='text-sm'>Joined on {u.joined?.toDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage