'use client'

import { ForwardRefEditor } from '@/components/ForwardRefEditor'
import '@mdxeditor/editor/style.css'

import { useState, useCallback } from 'react'
import { MdNewspaper } from 'react-icons/md'
import { IoTrashBin } from 'react-icons/io5'
import Tags from '@/components/Tags'
import { new_post } from '@/app/lib/Post'
import { sessionuser } from '@/components/store'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const uid = sessionuser((state) => state.uid)
  const uname = sessionuser((state) => state.uname)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>(['general'])
  const [loading, setLoading] = useState(false)

  const Create_post = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (loading) return

      if (!title.trim()) {
        alert('Title cannot be empty')
        return
      }

      setLoading(true)

      try {
        const result = await new_post(
          title,
          content,
          tags,
          uid as number,
          uname as string
        )

        if (result.msg === 'success') {
          await fetch('/api/push/broadcast', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: uid,
              title: `New Post! by ${uname}`,
              body: `${title}`,
              url: `/home/post/${result.pid}`,
            }),
          });
          router.push('/home')
        } else {
          alert('An error occurred')
        }
      } catch (err) {
        console.error(err)
        alert('An error occurred')
      } finally {
        setLoading(false)
      }
    },
    [title, content, tags, uid, uname, loading, router]
  )

  return (
    <div className="flex flex-col gap-2">
      <Tags tags={tags} settags={setTags} />

      <div className="w-full p-4">
        <textarea
          className="w-full field-sizing-content text-6xl primary-font resize-none outline-none overflow-y-hidden"
          placeholder="Post Title Here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <hr />

      <ForwardRefEditor
        markdown=""
        placeholder="Post Content Here"
        onChange={setContent}
      />

      <hr />

      <div className="flex flex-col justify-between gap-2 p-4 md:flex-row">
        <button
          onClick={Create_post}
          disabled={loading}
          className={`flex items-center justify-center gap-2 rounded-full p-3 text-xl font-bold text-white shadow-md transition-all md:w-1/6 ${loading
            ? 'cursor-not-allowed bg-gray-500'
            : 'cursor-pointer bg-green-500 hover:shadow-xl'
            }`}
        >
          <MdNewspaper className="text-2xl" />
          {loading ? 'Posting...' : 'Post'}
        </button>

        <button
          onClick={() => router.push('/home')}
          className="flex items-center justify-center gap-2 rounded-full bg-red-500 p-3 text-xl font-bold text-white shadow-md hover:shadow-xl md:w-1/6"
        >
          <IoTrashBin className="text-2xl" />
          Discard
        </button>
      </div>
    </div>
  )
} 