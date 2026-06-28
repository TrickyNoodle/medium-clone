"use client";

import React, { useEffect, useRef, useState } from "react";
import { followingposts, getrecentposts } from "../lib/Post";
import { Post } from "../types/Post";
import { ForwardRefEditor } from "@/components/ForwardRefEditor";
import Link from "next/link";
import Tags from "@/components/Tags";
import { useRouter } from "next/navigation";
import { useInView } from "motion/react";
import { sessionuser } from "@/components/store";
import { getUserDetails } from "../lib/Account";
import { User } from "@/app/types/Account";

const Page = () => {
    const router = useRouter();
    const suser = sessionuser((state) => state);

    const [tags, settags] = useState<string[]>([]);
    const [recentposts, setrecentposts] = useState<Post[]>([]);
    const [feedtype, setfeedtype] = useState(0);
    const [user, setuser] = useState<User>();

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const load = useRef(null);
    const isinview = useInView(load);

    // Load logged-in user
    useEffect(() => {
        async function run() {
            if (!suser.uid) return;
            const result = await getUserDetails(suser.uid);
            setuser(result);
        }

        run();
    }, [suser]);

    async function fetchposts(offset = recentposts.length) {
        if (loading || !hasMore) return;

        if (feedtype === 1 && !user) return;

        setLoading(true);

        try {
            const result =
                feedtype === 0
                    ? await getrecentposts(offset)
                    : await followingposts(user?.following || [], offset);

            if (result.length === 0) {
                setHasMore(false);
                return;
            }

            setrecentposts((prev) => [
                ...prev,
                ...result.filter(
                    (post) => !prev.some((p) => p.pid === post.pid)
                ),
            ]);
        } finally {
            setLoading(false);
        }
    }

    // Reset feed when switching
    useEffect(() => {
        if (feedtype === 1 && !user) return;
        async function run(){
            setrecentposts([]);
            setHasMore(true);
            await fetchposts(0);
        }
        run()
    }, [feedtype, user]);

    // Infinite scroll
    useEffect(() => {
        if (!isinview) return;
        async function run() {
            fetchposts();
        }
        run()
    }, [isinview]);

    return (
        <div className="flex flex-col gap-2 items-center">
            <div className="flex border rounded-md text-xl w-fit sticky top-10 left-0 right-0 z-500 bg-white">
                <label
                    className={`p-4 rounded-md rounded-r-none cursor-pointer ${feedtype === 0 ? "backdrop-brightness-80" : ""
                        }`}
                >
                    <input
                        type="radio"
                        className="hidden"
                        checked={feedtype === 0}
                        onChange={() => setfeedtype(0)}
                    />
                    Latest Posts
                </label>

                <label
                    className={`p-4 rounded-md rounded-l-none cursor-pointer ${feedtype === 1 ? "backdrop-brightness-80" : ""
                        }`}
                >
                    <input
                        type="radio"
                        className="hidden"
                        checked={feedtype === 1}
                        onChange={() => setfeedtype(1)}
                    />
                    Following
                </label>
            </div>

            <div className="flex relative gap-2 justify-between">
                {recentposts.length != 0 ? <div className="flex border top-32 sticky left-0 h-fit rounded-md flex-col p-2 text-xl shadow-2xl w-full">
                    <p>Filter Posts By Tags</p>
                    <Tags tags={tags} settags={settags} />
                </div> : null}

                <div className="flex flex-col gap-4 w-full">
                    {recentposts
                        .filter((p) => {
                            if (tags.length === 0) return true;
                            return p.tags.some((tag) => tags.includes(tag));
                        })
                        .map((p) => (
                            <div
                                key={p.pid}
                                className="border rounded-md backdrop-brightness-90 shadow-md hover:shadow-xl w-full cursor-pointer"
                                onClick={() =>
                                    router.push("/home/post/" + p.pid)
                                }
                            >
                                <p className="text-xl font-bold p-2">
                                    {p.pname}
                                </p>

                                <ForwardRefEditor
                                    markdown={
                                        p.pcontent?.slice(0, 50) || ""
                                    }
                                    readOnly
                                    className="bg-white rounded-md p-2"
                                />

                                <div className="flex justify-between p-2 text-sm items-center">
                                    <Link
                                        href={"/home/profile/" + p.uid}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:underline font-bold"
                                    >
                                        By {p.uname}
                                    </Link>

                                    <div className="flex gap-2">
                                        {p.tags.map((tag) => (
                                            <button
                                                key={tag}
                                                className="p-2 rounded-full border shadow-md hover:shadow-xl cursor-pointer bg-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    if (!tags.includes(tag)) {
                                                        settags([
                                                            ...tags,
                                                            tag,
                                                        ]);
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>

                                    <p>
                                        {p.created?.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {feedtype === 1 && user?.following?.length === 0 ? (
                <p>
                    Your Following List is Empty, Please Follow Someone First.
                </p>
            ) : (
                <button
                    ref={load}
                    disabled={loading || !hasMore}
                    className="underline text-xl cursor-pointer disabled:opacity-50"
                    onClick={() => fetchposts()}
                >
                    {loading
                        ? "Loading..."
                        : hasMore
                            ? "Load More"
                            : "That's it, No more Posts ❤️"}
                </button>
            )}
        </div>
    );
};

export default Page;