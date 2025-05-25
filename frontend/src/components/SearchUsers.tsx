import useAllUsers from "../hooks/api/useAllUsers.ts";
import UserCard from "./UserCard.tsx";

export default function SearchUsers() {
    const {data: users} = useAllUsers()

    if (!users) return (
        <div>Loading...</div>
    )

    return (
        <div className='p-6'>
            <div>
                <input type="text" placeholder='Search users...'
                       className={'w-full p-2 outline-border outline rounded-[5px] focus-visible:outline-none focus-visible:bg-background text-muted'}/>
            </div>
            <div className='flex flex-col gap-2 mt-6'>
                {users.map(user => (
                    <div key={user._id} className='flex justify-between items-center'>
                        <UserCard user={user}/>
                        <button className='text-white bg-message-primary px-3 py-1 h-min rounded-[5px]'>Add</button>
                    </div>
                ))}
            </div>
        </div>
    )
}