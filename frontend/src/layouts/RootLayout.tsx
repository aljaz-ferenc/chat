import { Outlet } from "react-router";
import Header from "../components/Header.tsx";

export default function RootLayout() {
	return (
		<main className="grid grid-cols-1 grid-rows-[72px_auto] h-screen">
			<Header />
			<Outlet />
		</main>
	);
}
