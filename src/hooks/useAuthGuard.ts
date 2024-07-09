import { useRouter } from "next/navigation";
import { UnauthorizedException } from "../exceptions/unauthorize.exception";

export function useAuthGuard() {
	const router = useRouter();

	return async (api: Function) => {
		try {
			return await api();
		} catch (err) {
			if (err instanceof UnauthorizedException) {
				console.log("UnauthorizedException");
				router.replace("/login");
			}
		}
	};
}
