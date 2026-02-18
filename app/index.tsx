import { useAuth } from "@/hooks/useAuth";
import Login from "./login";
import Register from "./register";

export default function Index() {
	const { session } = useAuth();

	return !session ? <Login /> : <Register />;
}
