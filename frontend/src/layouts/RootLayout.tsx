import {Outlet} from "react-router";
import Header from "../components/Header.tsx";
import useUser from "../hooks/api/useUser.ts";
import {useEffect} from "react";
import useUserStore from "../state/useUserStore.ts";
import {useShallow} from "zustand/react/shallow";

export default function RootLayout() {
    const {data: userData, isLoading} = useUser()
    const [user, setUser] = useUserStore(useShallow(state => [state.user, state.setUser]))


    useEffect(() => {
        if(userData && !user){
            console.log('setting user: ', userData)
            setUser(userData)
        }

    }, [user, isLoading])

    if(isLoading) return <div>Loading...</div>

    if(!isLoading && !user) return <div>User not found...</div>

    return (
        <main className="grid grid-cols-1 grid-rows-[72px_auto] h-screen">
            <Header/>
            <Outlet/>
        </main>

    )
}