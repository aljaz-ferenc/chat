import {FilterIcon, PlusIcon, SearchIcon} from "../assets/icons/icons.tsx";
import UserCard from "../components/UserCard.tsx";
import {Link, Outlet} from "react-router";
import {cn} from "../utils/utils.ts";

export const fakeUsers = [
    {
        id: '1',
        name: 'Jasmin The Batman',
        message: 'Hello, how are you? Hello, how are you? Hello, how are you? Hello, how are you?',
        isTyping: true,
        lastMessage: '45 min'
    },
    {
        id: '2',
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: false,
        lastMessage: '1 day'
    },
    {
        id: '3',
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: false,
        lastMessage: '2 days'
    },
    {
        id: '4',
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: true,
        lastMessage: '1 hour'
    },
    {
        id: '5',
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: false,
        lastMessage: '2 hours'
    }
]

export default function ChatLayout() {
    return (
        <div className='flex'>
            <div className='min-w-[320px] h-full bg-primary border-r border-border'>
                <div className='py-5 px-6 flex gap-4'>
                    <h3 className='font-bold text-2xl mr-auto text-white'>Chats</h3>
                    <button
                        className='flex gap-2 items-center text-muted [&_svg]:fill-muted font-bold text-xs hover:text-message-primary hover:[&_svg]:fill-message-primary cursor-pointer'>
                        <PlusIcon/>
                        <span>New</span>
                    </button>
                    <button
                        className='flex gap-2 items-center text-muted [&_svg]:fill-muted font-bold text-xs hover:text-message-primary hover:[&_svg]:fill-message-primary cursor-pointer'>
                        <FilterIcon/>
                        <span>Filter</span>
                    </button>
                </div>
                <div className='flex items-center gap-2 [&_svg]:fill-muted relative px-6'>
                    <span className='absolute top-1/2 -translate-y-1/2 left-9 [&_svg]:p-[1px]'>
                    <SearchIcon/>
                    </span>
                    <input type="text"
                           className='w-full placeholder:text-muted pl-10 py-2 transition-all rounded-full focus-visible:bg-background focus-visible:outline-none text-muted outline-border outline-1'
                           placeholder='Search contacts'/>
                </div>
                <div className='flex flex-col mt-4'>
                    {fakeUsers.map(user => (
                        <Link to={`${user.id}`} className={cn(['cursor-pointer bg-primary hover:bg-background transition-all px-6'])}
                                key={user.id} type='button'>
                            <UserCard user={user} showLastMessageTime showTypingStatus className='py-3'/>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='w-full bg-primary flex flex-col'>
                <Outlet/>
                <div className='h-[88px] bg-primary border-t border-border p-6'>
                    MESSAGE INPUT
                </div>
            </div>
        </div>
    )
}

