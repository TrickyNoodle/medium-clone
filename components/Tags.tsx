const Tags = ({ readonly, tags, settags }: { readonly?: boolean; tags: string[]; settags: React.Dispatch<React.SetStateAction<string[]>> }) => {
    function something(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.value.trim().length == 0)
            return;
        let s = e.currentTarget.value.split(" ")
        if (s.length > 1) {
            s = s.filter((e) => {
                if (e == "" || e == " ")
                    return false
                else
                    return true
            })
            if (s[0].length > 2)
                if (tags.includes(s[0]) == false)
                    settags([...tags, s[0]])
            e.currentTarget.value = ""
        }
    }
    return (
        <div className='flex max-w-full flex-wrap gap-2 w-full p-4 text-sm'>
            {tags.map((e, i) => {
                return <p key={i} className={`border inline rounded-full px-4 p-2 hover:shadow-xl shadow-md cursor-pointer ${readonly ? null : "hover:bg-red-100"}`} onClick={() => readonly ? null : settags(tags.filter((t) => t == e ? false : true))}>
                    {e}
                </p>
            })}
            {readonly ? null : <input className={`resize-none field-sizing-content border rounded-md px-2`} placeholder='Tags?' onChange={(e) => something(e)} />}
        </div>
    )
}

export default Tags