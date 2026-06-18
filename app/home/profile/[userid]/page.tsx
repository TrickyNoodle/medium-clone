"use client"
import { follow, getFollowers, getfollowing, getPosts, getUserDetails, unfollow } from '@/app/lib/Account'
import ShowUsers from '@/components/ShowUsers'
import { sessionuser } from '@/components/store'
import { redirect, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export type Post = {
  uid: number;
  pid: number;
  pname: string;
  pcontent: string | null;
  created: Date | null;
};

export type User = {
  uid?: number | undefined | null
  name?: string | undefined | null
  email?: string | undefined | null
  joined?: Date | undefined | null
  following?: number[] | undefined | null
  bio?: string | undefined | null
  error?: string | undefined | null
  image?: string | undefined | null
}

export type Followers = {
  uid: number | undefined | null
  uname: string | undefined | null
  image: string | undefined | null
}
const Page = () => {
  const [showusers, setshowusers] = useState<string | null>(null)
  const [userdetails, setuserdetails] = useState<User>({})
  const [posts, setposts] = useState<Post[]>([]);
  const [followers, setfollowers] = useState<Followers[]>([])
  const { userid }: { userid: string } = useParams()
  const [isfollowed, setisfollowed] = useState(false);
  const [following, setfollowing] = useState<Followers[]>([])
  const suser = sessionuser((state) => state)
  async function followunfollow() {
    let result = null
    if (isfollowed)
      result = await unfollow(parseInt(userid), suser.uid as number)
    else
      result = await follow(parseInt(userid), suser.uid as number)
    if ((await result).msg == "success")
      setisfollowed(!isfollowed)
  }
  useEffect(() => {
    async function run() {
      const data = await getUserDetails(parseInt(userid))
      setuserdetails(data)
      const data1 = await getPosts(parseInt(userid))
      setposts(data1)
      const data2 = await getFollowers(parseInt(userid))
      setfollowers(data2)
      data?.following?.includes(parseInt(userid)) ? setisfollowed(true) : setisfollowed(false)
      const data3 = await getfollowing(data?.following as number[])
      setfollowing(data3)
    }
    run()
  }, [])
  return (
    <div className='flex flex-col gap-4 py-2'>
      <div className='flex p-8  rounded-md shadow-md hover:shadow-xl border gap-4 justify-between transition-all duration-300 w-full'>
        <div className='flex gap-4 relative'>
          <img src={userdetails.image as string} className='rounded-full w-1/6 relative' />
          <div className='flex flex-col justify-stretch'>
            <p className='text-sm'>Joined Medium on {userdetails.joined?.toDateString()}</p>
            <p className='primary-font text-2xl font-bold'>{userdetails.name}</p>
            <p className='text-md w-full text-gray-400'>{userdetails.bio}</p>
          </div>
        </div>
        <div className='flex items-center w-full justify-end'>
          <ul className='flex gap-4 [&>li]:hover:underline items-center [&>li]:transition-all [&>li]:duration-300'>
            <li className='text-xl' onClick={() => setshowusers("Following")}>{userdetails.following?.length} Following</li>
            <li className='text-xl' onClick={() => setshowusers("Followers")}>{followers.length} Followers</li>
            {showusers ? <ShowUsers users={showusers == "Following" ? following : followers} setshowusers={setshowusers} showusers={showusers} /> : null}
            <li><button onClick={followunfollow} className={`tranisiton-all duration-300 cursor-pointer hover:shadow-md hover:text-white font-bold ${isfollowed ? "hover:bg-red-400" : "hover:bg-green-500"} text-xl border-2 px-4 py-2 rounded-md ${isfollowed ? "border-red-400" : "border-green-500"}`}>{isfollowed ? "UnFollow" : "Follow"}</button></li>
          </ul>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {posts.length == 0 ? <div className='col-span-3 border p-4 backdrop-brightness-90 rounded-md'>
          <p className='text-center text-xl font-bold'>This User Hasn&apos;t Posted Anything Yet</p>
        </div> : posts.map((post) => {
          return <div key={post.pid} onClick={() => redirect("/home/post/" + post.pid)} className='border-2 flex flex-col w-full justify-center pt-2 rounded-md shadow-md hover:shadow-2xl'>
            <p className='flex primary-font text-xl p-2'>{post.pname}</p>
            <p className='text-sm backdrop-brightness-90 px-4 py-1 rounded-md rounded-t-none' >{post.created?.toDateString()}</p>
          </div>
        })}
      </div>
    </div>
  )
}

export default Page