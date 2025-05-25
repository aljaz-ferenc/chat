import useAllUsers from "../hooks/api/useAllUsers.ts";
import UserCard, {UserCardSkeleton} from "./UserCard.tsx";
import useUserStore from "../state/useUserStore.ts";
import {useShallow} from "zustand/react/shallow";

export default function SearchUsers() {
    const {data: users} = useAllUsers()
    const [thisUser] = useUserStore(useShallow(state => [state.user]))

    return (
        <div className='p-6'>
            <div>
                <input type="text" placeholder='Search users...'
                       className={'w-full p-2 outline-border outline rounded-[5px] focus-visible:outline-none focus-visible:bg-background text-muted'}/>
            </div>
            <div className='flex flex-col gap-4 mt-6'>
                {users ? users.map(user => {
                    if(user._id === thisUser?._id) return null
                    return <div key={user._id} className='flex justify-between items-center'>
                        <UserCard user={user}/>
                        <button
                            onClick={() => console.log(user.firstName)}
                            className='cursor-pointer text-white bg-message-primary px-3 py-1 h-min rounded-[5px]'>Add
                        </button>
                    </div>
                }) : <div  className='flex flex-col gap-4'>{Array(10).fill(0).map((_, i) => <UserCardSkeleton key={i}/>)}</div>}
            </div>
        </div>
    )
}