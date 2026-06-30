"use client"
import { deletePost, getFollowers, getfollowing, getPosts, getUserDetails, updatebio } from '@/app/lib/Account'
import ShowUsers from '@/components/ShowUsers'
import { sessionuser } from '@/components/store'
import { redirect, useRouter, } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Followers, User } from '@/app/types/Account'
import { Post } from '@/app/types/Post'
import { BiEdit } from 'react-icons/bi'
import { signOut } from 'next-auth/react'


const Page = () => {
  const [showusers, setshowusers] = useState<string | null>(null)
  const [userdetails, setuserdetails] = useState<User>({})
  const [posts, setposts] = useState<Post[]>([]);
  const [followers, setfollowers] = useState<Followers[]>([])
  const [following, setfollowing] = useState<Followers[]>([])
  const suser = sessionuser((state) => state)
  const userid = suser.uid as number
  const [editbio, seteditbio] = useState(false)
  const bio = useRef(null)
  const [biotext, setbiotext] = useState(userdetails.bio)
  const router = useRouter()
  const [order, setorder] = useState('ascending')
  const [search, setsearch] = useState("")

  async function changevalue(e: React.ChangeEvent<HTMLInputElement>) {
    setsearch(e.currentTarget.value)
  }
  async function deletepost(pid: number) {
    const ask = confirm("Delete Post?")
    if (ask.valueOf()) {
      const result = await deletePost(pid)
      console.log(result)
      if (result.msg == "success")
        setposts(posts.filter((post) => {
          return post.pid != pid
        }))
    }
  }
  async function editable() {
    if (editbio) {
      const result = await updatebio(userid, biotext as string)
      if (result.msg == "success")
        router.refresh()
    }
    seteditbio(!editbio)
  }
  useEffect(() => {
    async function run() {
      if (userid != null) {
        const data = await getUserDetails(userid)
        setuserdetails(data)
        setbiotext(data.bio)
        const data1 = await getPosts(userid)
        setposts(data1)
        const data2 = await getFollowers(userid)
        setfollowers(data2)
        const data3 = await getfollowing(data?.following as number[])
        setfollowing(data3)
      }
    }
    run()
  }, [userid])
  return (
    <div className='flex flex-col gap-4 py-2'>
      <div className='flex md:flex-row flex-col md:p-8 p-2 rounded-md shadow-md hover:shadow-xl border gap-4 justify-between transition-all duration-300 w-full'>
        <div className='flex gap-4 w-full items-center md:flex-row flex-col md:text-left'>
          <img src={userdetails.image as string} className='rounded-full size-20' />
          <div className='flex flex-col md:w-2/3 md:items-center md:text-left w-full text-center'>
            <p className='text-sm w-full'>Joined Medium on {userdetails.joined?.toDateString()}</p>
            <p className='primary-font text-2xl font-bold w-full'>{userdetails.uname}</p>
            <div className='flex w-full md:flex-row flex-col text-center items-center'>
              <textarea ref={bio} maxLength={500} className='text-md md:min-w-1/2 w-full text-center md:text-left max-w-full resize' disabled={!editbio} onChange={(e) => setbiotext(e.currentTarget.value)} value={biotext || undefined} />
              <p onClick={() => editable()} className={`${editbio ? "backdrop-brightness-75 rounded-md" : ""} text-xl flex items-center cursor-pointer`}>
                <BiEdit className='text-2xl' />
                Edit Bio
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center md:w-1/3 md:justify-end justify-center gap-2 text-center md:flex-row flex-col'>
          <ul className='flex gap-4 [&>li]:hover:underline items-center [&>li]:transition-all [&>li]:duration-300'>
            <li className='text-xl' onClick={() => setshowusers("Following")}>{userdetails.following?.length} Following</li>
            <li className='text-xl' onClick={() => setshowusers("Followers")}>{followers.length} Followers</li>
            {showusers ? <ShowUsers follows={userdetails.following as number[]} users={showusers == "Following" ? following : followers} setshowusers={setshowusers} showusers={showusers} /> : null}
          </ul>
          <button onClick={() => { confirm("Are You Sure You Want to Sign Out from this Account?") ? signOut() : null }} className='cursor-pointer border-2 w-fit p-2 transition-all duration-300 rounded-md hover:bg-red-400 border-red-600'>SignOut?</button>
        </div>
      </div>
      <div className='md:grid flex flex-col md:grid-cols-3 gap-2'>
        {posts.length != 0 ? <div className='primary-font text-2xl col-span-3 flex justify-between items-center gap-4 md:flex-row flex-col'>
          <label htmlFor="" className='flex gap-2 w-full'>
            Search:
            <input type="text" name="" id="" className='px-2 border rounded-md w-full' value={search} onChange={changevalue} />
          </label>
          <div className='flex rounded-md justify-end'>
            <label htmlFor="newest" onClick={() => setorder("ascending")} className={`${order == "ascending" ? "backdrop-brightness-90" : ""} cursor-pointer p-2 text-xl border border-r-0 text-nowrap`}>
              Newest First
            </label>
            <input type="radio" name="sort" id="newest" className='size-0' />
            <label htmlFor='oldest' onClick={() => setorder("descending")} className={`${order == "descending" ? "backdrop-brightness-90" : ""} cursor-pointer p-2 text-xl border border-l-0 text-nowrap`}>
              Oldest First
            </label>
            <input type="radio" name="sort" id="oldest" className='size-0' />
          </div>
        </div> : null}
        {posts.length == 0 ? <div className='col-span-3 border p-4 backdrop-brightness-90 rounded-md'>
          <p className='text-center text-xl font-bold'>You Have Not Posted Anything Yet</p>
        </div> : order == "ascending" ? posts.map((post) => {
          if (post.pname.includes(search))
            return <div key={post.pid} onClick={() => redirect("/home/post/" + post.pid)} className='border-2 flex flex-col w-full justify-between pt-2 rounded-md shadow-md hover:shadow-2xl'>
              <p className='flex primary-font text-xl p-2 flex-wrap max-w-full overflow-x-clip  '>{post.pname}</p>
              <div className='text-sm backdrop-brightness-90 rounded-md rounded-t-none justify-between w-full flex items-center' >
                <span className='py-1 px-4'>{post.created?.toDateString()}</span>
                <button className='flex cursor-pointer bg-red-400 hover:bg-red-500 h-full p-2 px-8 hover:font-bold' onClick={(e) => { e.stopPropagation(); deletepost(post.pid) }}>Delete</button>
              </div>
            </div>
        }) : posts.toReversed().map((post) => {
          if (post.pname.includes(search))
            return <div key={post.pid} onClick={() => redirect("/home/post/" + post.pid)} className='border-2 flex flex-col w-full justify-between pt-2 rounded-md shadow-md hover:shadow-2xl'>
              <p className='flex primary-font text-xl p-2 flex-wrap max-w-full overflow-x-clip'>{post.pname}</p>
              <div className='text-sm backdrop-brightness-90 rounded-md rounded-t-none justify-between w-full flex items-center' >
                <span className='py-1 px-4'>{post.created?.toDateString()}</span>
                <button className='flex cursor-pointer bg-red-400 hover:bg-red-500 h-full p-2 px-8 hover:font-bold ' onClick={(e) => { e.stopPropagation(); deletepost(post.pid) }}>Delete</button>
              </div>
            </div>
        })}
      </div>
    </div >
  )
}

export default Page