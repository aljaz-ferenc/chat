import { useParams } from "react-router";

export default function Contact() {
	const { id } = useParams();

	return <div>CONTACT {id}</div>;
}
