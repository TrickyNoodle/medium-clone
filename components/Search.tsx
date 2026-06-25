'use client'
import { getrecentposts } from '@/app/lib/Post'
import { Post } from '@/app/types/Post'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'

const Search = () => {
    const router=useRouter()
    const [searchopen, setsearchopen] = useState(false)
    const [recentposts, setrecentposts] = useState<Post[]>([])
    const [searchcontent, setsearchcontent] = useState("")
    useEffect(() => {
        async function run() {
            const result = await getrecentposts()
            setrecentposts(result)
        }
        run()
    }, [])
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setsearchopen(false)
        }
    }
    return (
        <div className='flex flex-col z-500 relative w-2/3' onFocus={() => setsearchopen(true)} onBlur={handleBlur}>
            <label className='flex items-center h-full focus-within:text-black text-gray-400'>
                <CiSearch className='text-2xl flex items-center' />
                <input onKeyDownCapture={(k) => ["Enter", "NumpadEnter"].includes(k.code) ? router.push("/home/search?content=" + searchcontent) : null} value={searchcontent} type="text" placeholder='Search' className='w-full px-2 text-sm outline-none h-full items-center flex' onChange={(e) => setsearchcontent(e.currentTarget.value)} />
            </label>
            <div className='h-fit w-full absolute border top-10 bg-white shadow-2xl' hidden={!searchopen}>
                {
                    recentposts.filter((p) => {
                        return p.pname.toLowerCase().includes(searchcontent.toLowerCase())
                    }).map((p, i) => {
                        return i < 5 ? <button key={p.pid} onClick={() => { setsearchopen(false); router.push(`/home/post/${p.pid}`) }} className='block p-4 hover:shadow-md cursor-pointer overflow-hidden w-full text-left'>{p.pname}</button> : null
                    })
                }
            </div>
        </div>
    )
}

export default Search