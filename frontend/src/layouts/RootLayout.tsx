import { Outlet } from "react-router";
import Header from "../components/Header.tsx";
import useUser from "../hooks/api/useUser.ts";

export default function RootLayout() {
	useUser();

	return (
		<main className="grid grid-cols-1 grid-rows-[72px_auto] h-screen">
			<Header />
			<Outlet />
		</main>
	);
}
