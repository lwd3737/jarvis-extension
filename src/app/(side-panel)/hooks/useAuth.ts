import { useContext, useEffect } from "react";
import { AuthContext } from "../(side-pannel)/components/AuthProvider";

export default function useAuth() {
	const auth = useContext(AuthContext);

	useEffect(() => {
		if (!auth) {
			throw new Error("useAuth must be used within an AuthProvider");
		}
	}, [auth]);

	return auth;
}
