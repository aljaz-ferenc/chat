import {FilterIcon, PlusIcon, SearchIcon} from "../assets/icons/icons.tsx";

const fakeUsers = [
    {
        id: 1,
        name: 'Jasmin The Batman',
        message: 'Hello, how are you? Hello, how are you? Hello, how are you? Hello, how are you?',
        isTyping: true,
        lastMessage: '45 min'
    },
    {
        id: 2,
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: false,
        lastMessage: '1 day'
    },
    {
        id: 3,
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: false,
        lastMessage: '2 days'
    },
    {
        id: 4,
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: true,
        lastMessage: '1 hour'
    },
    {
        id: 5,
        name: 'Jane Doe',
        message: 'Hello, how are you?',
        isTyping: false,
        lastMessage: '2 hours'
    }
]

export default function ChatRoute() {
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
                        <button className='bg-primary cursor-pointer hover:bg-background transition-all  px-6'>
                            <div className='flex items-center gap-4 py-3'>
                                <img src='https://picsum.photos/id/100/50/50' alt='user'
                                     className='w-12 aspect-square rounded-[5px]'/>
                                <div className='flex flex-col items-start gap-1'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-bold text-white'>{user.name}</h3>
                                        {user.isTyping && <span className='text-xs text-muted/50'>Typing...</span>}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-muted text-xs truncate max-w-40 text-left'>{user.message}</p>
                                        {user.lastMessage &&
                                            <span className='text-xs text-muted/50 w-max'>&bull; {user.lastMessage}</span>}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className='w-full bg-primary'>

            </div>
        </div>
    )
}