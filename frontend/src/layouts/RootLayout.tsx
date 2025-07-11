import { useEffect } from "react";
import { Outlet, useNavigate, useResolvedPath } from "react-router";
import { Routes } from "../../../shared/Routes.enum.ts";
import Header from "../components/Header.tsx";
import useUser from "../hooks/api/useUser.ts";

export default function RootLayout() {
	useUser();
	const { pathname } = useResolvedPath({});
	const navigate = useNavigate();

	useEffect(() => {
		if (!pathname) return;
		if (pathname === Routes.HOME) navigate(Routes.CHATS);
	}, [pathname, navigate]);

	return (
		<main className="grid grid-cols-1 grid-rows-[90px_auto] h-screen">
			<Header />
			<Outlet />
		</main>
	);
}
