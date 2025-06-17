import { Client, Storage } from "appwrite";
import { type PropsWithChildren, createContext } from "react";
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!ENDPOINT) throw new Error("Appwrite endpoint missing");
if (!PROJECT_ID) throw new Error("Appwrite project id missing");

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const storage = new Storage(client);
export const FileStorageContext = createContext({ storage });

export default function FileStorageProvider({ children }: PropsWithChildren) {
	return (
		<FileStorageContext.Provider value={{ storage }}>
			{children}
		</FileStorageContext.Provider>
	);
}
