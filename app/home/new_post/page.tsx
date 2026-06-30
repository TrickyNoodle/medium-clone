'use client'
import { ForwardRefEditor } from '@/components/ForwardRefEditor'
import '@mdxeditor/editor/style.css'

import { useState } from 'react'
import { MdNewspaper } from 'react-icons/md'
import { IoTrashBin } from "react-icons/io5";
import Tags from '@/components/Tags'
import { new_post } from '@/app/lib/Post'
import { sessionuser } from '@/components/store'
import { redirect } from 'next/navigation'

export default function Page() {
  const user = sessionuser((state) => state)
  async function Create_post(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.disabled = true
    e.currentTarget.style.backgroundColor = "gray"
    if (!title.trim())
      alert("Title Cannot be Empty")
    else {
      const result = await new_post(title, content, tags, user.uid as number, user.uname as string)
      if (result.msg == "success")
        redirect("/home")
      else
        alert("An Error Occured")
    }
    e.currentTarget.disabled = false
    e.currentTarget.style.backgroundColor = "rgb(34 197 94)"

  }
  const [title, settitle] = useState("")
  const [content, setcontent] = useState("")
  const [tags, settags] = useState<string[]>(["general"])
  return <div className='flex flex-col gap-2'>
    <Tags tags={tags} settags={settags} />
    <div className='w-full p-4'>
      <textarea className='w-full field-sizing-content text-8xl primary-font resize-none outline-none overflow-y-hidden' onChange={(e) => settitle(e.currentTarget.value)} value={title} placeholder='Post Title Here' />
    </div>
    <hr />
    <ForwardRefEditor markdown="" placeholder="Post Content Here" onChange={(e) => setcontent(e)} />
    <hr />
    <div className='flex justify-between md:flex-row flex-col p-4 gap-2'>
      <button onClick={(e) => Create_post(e)} className='bg-green-500 p-3 text-xl text-shadow-2xs font-bold rounded-full text-white cursor-pointer shadow-md hover:shadow-xl  md:w-1/6 justify-center flex gap-2 items-center'><MdNewspaper className='text-2xl' />Post</button>
      <button onClick={() => { redirect("/home") }} className='bg-red-500 p-3 text-xl text-shadow-2xs font-bold  rounded-full text-white cursor-pointer shadow-md hover:shadow-xl md:w-1/6 flex justify-center gap-2 items-center'><IoTrashBin className='text-2xl' /> Discard</button>
    </div>
  </div>
}