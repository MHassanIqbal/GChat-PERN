import { Search } from "lucide-react"
import { useState } from "react"
import UseConversation from "../../zustand/UseConversation"
import UseGetConversations from "../../hooks/UseGetConversations"
import toast from "react-hot-toast"

const SearchInput = () => {
    const [search, setSearch] = useState('')
    const { setSelectedConversation } = UseConversation()
    const { conversations } = UseGetConversations()

    const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!search) return
        if (search.length < 3) {
            return toast.error("Enter atleast 3 characters")
        }
        const conversation = conversations.find((con: ConversationType) =>
            con.fullName.toLowerCase().includes(search.toLowerCase())
        )

        if (conversation) {
            setSelectedConversation(conversation)
            setSearch('')
        } else {
            toast.error('User not Found')
        }
    }

    return (
        <form className='flex items-center gap-2' onSubmit={handleSubmitForm}>
            <input
                type="text"
                placeholder="Search Here..."
                className='input-sm md:input input-bordered rounded-full sm:rounded-full w-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className='btn md:btn-md btn-sm btn-circle bg-sky-500 text-white  '>
                <Search className='w-4 h-4 md:w-6 md:h-6 outline-none' />
            </button>
        </form>
    )
}

export default SearchInput