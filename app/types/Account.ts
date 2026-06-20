
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