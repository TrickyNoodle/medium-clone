'use client'
import { ForwardRefEditor } from '@/components/ForwardRefEditor'
import '@mdxeditor/editor/style.css'

import dynamic from 'next/dynamic'

const Editor = dynamic(
  () => import('@/components/Editor'),
  { ssr: false }
)

export default function Page() {
  return <div className=''>
    <ForwardRefEditor markdown='# Hello World' />
  </div>
}